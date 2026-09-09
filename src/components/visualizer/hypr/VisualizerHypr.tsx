// src/components/visualizer/hypr/VisualizerHypr.tsx
// Hyprland tiling-inspired lyric visualizer: glass lyric windows arranged as tiled panes
// with rotating gradient borders, glass blur, and dwindle/master/monocle layouts.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import VisualizerShell from '../VisualizerShell';
import VisualizerSubtitleOverlay from '../VisualizerSubtitleOverlay';
import { useVisualizerRuntime } from '../runtime';
import { computeHyprLayout, type HyprWindow, type HyprRect } from './hyprTiling';
import HyprPane from './HyprPane';
import HyprActiveLine from './HyprActiveLine';
import HyprStaticLine from './HyprStaticLine';
import type { VisualizerSharedProps } from '../definition';
import type { Line } from '../../../types';

// src/components/visualizer/hypr/VisualizerHypr.tsx
// Renders lyric lines as tiled glass windows over the shared background wallpaper.

const HyprRenderer: React.FC<VisualizerSharedProps> = (props) => {
    const {
        currentTime,
        currentLineIndex,
        lines,
        theme,
        audioPower,
        audioBands,
        showText,
        paused,
        coverUrl,
        onLyricLineSeek,
        lyricsFontScale,
        subtitleFontScale,
        subtitleOverlayOpacity,
        subtitleOverlayBackground,
        subtitleUpcomingLyricsBlur,
        isPlayerChromeHidden,
        hideTranslationSubtitle,
        showSubtitleTranslation,
        subtitleContentMode,
        hyprTuning,
    } = props;

    const tuning = hyprTuning ?? {
        layoutMode: 'dwindle' as const,
        mfact: 0.55,
        gapsInner: 12,
        gapsOuter: 28,
        rounding: 18,
        borderSize: 2,
        inactiveDim: 0.35,
        glassOpacity: 0.5,
        blurStrength: 1.0,
        borderSpinSpeed: 0.6,
        enterStyle: 'popin' as const,
        transitionSpeed: 1.0,
        showPastCount: 2,
        showUpcomingCount: 3,
        showCoverWindow: true,
        audioGlow: 1.0,
    };

    const { activeLine, recentCompletedLine, nextLines } = useVisualizerRuntime({
        currentTime,
        currentLineIndex,
        lines,
    });

    // Viewport for layout computation
    const viewportRef = useRef<HTMLDivElement>(null);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setViewportSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Build window descriptors: cover + past + active + upcoming
    const effectiveIndex = currentLineIndex >= 0 ? currentLineIndex : -1;
    const pastLines: Line[] = useMemo(() => {
        const result: Line[] = [];
        for (let i = effectiveIndex - 1; i >= Math.max(0, effectiveIndex - tuning.showPastCount); i--) {
            result.unshift(lines[i]);
        }
        return result;
    }, [lines, effectiveIndex, tuning.showPastCount]);

    const upcomingLines: Line[] = useMemo(() => {
        const result: Line[] = [];
        for (let i = effectiveIndex + 1; i < Math.min(lines.length, effectiveIndex + 1 + tuning.showUpcomingCount); i++) {
            result.push(lines[i]);
        }
        return result;
    }, [lines, effectiveIndex, tuning.showUpcomingCount]);

    // Window list for layout
    const windows: HyprWindow[] = useMemo(() => {
        const result: HyprWindow[] = [];
        if (tuning.showCoverWindow && coverUrl) {
            result.push({ id: 'cover', role: 'cover' });
        }
        pastLines.forEach((_, i) => result.push({ id: `past-${i}`, role: 'past' }));
        if (activeLine) {
            result.push({ id: 'active', role: 'active' });
        }
        upcomingLines.forEach((_, i) => result.push({ id: `upcoming-${i}`, role: 'upcoming' }));
        return result;
    }, [pastLines, upcomingLines, activeLine, tuning.showCoverWindow, coverUrl]);

    // Compute layout rectangles
    const rects: HyprRect[] = useMemo(() => {
        if (viewportSize.width <= 0 || viewportSize.height <= 0) return [];
        return computeHyprLayout({
            viewport: viewportSize,
            windows,
            layoutMode: tuning.layoutMode,
            gapsInner: tuning.gapsInner,
            gapsOuter: tuning.gapsOuter,
            mfact: tuning.mfact,
        });
    }, [viewportSize, windows, tuning.layoutMode, tuning.gapsInner, tuning.gapsOuter, tuning.mfact]);

    // Map windows to rects
    const windowEntries = useMemo(() => {
        return windows.map((w, i) => ({ ...w, rect: rects[i] })).filter((e) => e.rect);
    }, [windows, rects]);

    // Accent color CSS variable for the gradient border
    const accentVar = theme.accentColor ?? '#8888cc';

    const handlePaneClick = useCallback((line: Line) => {
        onLyricLineSeek?.(line.startTime);
    }, [onLyricLineSeek]);

    return (
        <VisualizerShell
            theme={theme}
            audioPower={audioPower}
            audioBands={audioBands}
            sharedProps={props}
        >
            <div
                ref={viewportRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    // Inject accent color for gradient borders
                    ['--hypr-accent' as string]: accentVar,
                }}
            >
                {/* CSS keyframe for rotating gradient border */}
                <style>{`
                    @keyframes hypr-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>

                <AnimatePresence mode="popLayout">
                    {windowEntries.map((entry) => {
                        if (entry.role === 'cover') {
                            return (
                                <HyprPane
                                    key={entry.id}
                                    id={entry.id}
                                    x={entry.rect.x}
                                    y={entry.rect.y}
                                    w={entry.rect.w}
                                    h={entry.rect.h}
                                    rounding={tuning.rounding}
                                    borderSize={tuning.borderSize}
                                    glassOpacity={tuning.glassOpacity}
                                    blurStrength={tuning.blurStrength}
                                    inactiveDim={tuning.inactiveDim}
                                    isActive={false}
                                    enterStyle={tuning.enterStyle}
                                    borderSpinSpeed={0}
                                    transitionSpeed={tuning.transitionSpeed}
                                >
                                    <img
                                        src={coverUrl ?? undefined}
                                        alt=""
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: tuning.rounding,
                                        }}
                                    />
                                </HyprPane>
                            );
                        }

                        const line = entry.role === 'active'
                            ? activeLine
                            : entry.role === 'past'
                                ? pastLines[parseInt(entry.id.split('-')[1] ?? '0')]
                                : upcomingLines[parseInt(entry.id.split('-')[1] ?? '0')];

                        if (!line) return null;

                        return (
                            <HyprPane
                                key={entry.id}
                                id={entry.id}
                                x={entry.rect.x}
                                y={entry.rect.y}
                                w={entry.rect.w}
                                h={entry.rect.h}
                                rounding={tuning.rounding}
                                borderSize={tuning.borderSize}
                                glassOpacity={tuning.glassOpacity}
                                blurStrength={tuning.blurStrength}
                                inactiveDim={tuning.inactiveDim}
                                isActive={entry.role === 'active'}
                                enterStyle={tuning.enterStyle}
                                borderSpinSpeed={entry.role === 'active' ? tuning.borderSpinSpeed : 0}
                                transitionSpeed={tuning.transitionSpeed}
                                onClick={() => handlePaneClick(line)}
                            >
                                {entry.role === 'active' ? (
                                    <HyprActiveLine
                                        line={line}
                                        currentTime={currentTime}
                                        theme={theme}
                                        fontScale={lyricsFontScale ?? 1}
                                        isPaused={!!paused}
                                    />
                                ) : (
                                    <HyprStaticLine
                                        line={line}
                                        theme={theme}
                                        fontScale={lyricsFontScale ?? 1}
                                    />
                                )}
                            </HyprPane>
                        );
                    })}
                </AnimatePresence>
            </div>

            <VisualizerSubtitleOverlay
                showText={!!showText}
                activeLine={activeLine}
                recentCompletedLine={recentCompletedLine}
                nextLines={upcomingLines}
                theme={theme}
                translationFontSize={`clamp(${(1.125 * (lyricsFontScale ?? 1)).toFixed(3)}rem, ${(2.6 * (lyricsFontScale ?? 1)).toFixed(3)}vw, ${(1.25 * (lyricsFontScale ?? 1)).toFixed(3)}rem)`}
                upcomingFontSize={`clamp(${(0.875 * (lyricsFontScale ?? 1)).toFixed(3)}rem, ${(2 * (lyricsFontScale ?? 1)).toFixed(3)}vw, ${(1 * (lyricsFontScale ?? 1)).toFixed(3)}rem)`}
                subtitleFontScale={subtitleFontScale}
                subtitleOverlayOpacity={subtitleOverlayOpacity}
                subtitleOverlayBackground={subtitleOverlayBackground}
                subtitleUpcomingLyricsBlur={subtitleUpcomingLyricsBlur}
                isPlayerChromeHidden={isPlayerChromeHidden}
                hideTranslationSubtitle={hideTranslationSubtitle}
                showSubtitleTranslation={showSubtitleTranslation}
                subtitleContentMode={subtitleContentMode}
            />
        </VisualizerShell>
    );
};

export default HyprRenderer;
