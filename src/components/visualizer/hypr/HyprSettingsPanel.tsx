// src/components/visualizer/hypr/HyprSettingsPanel.tsx
// Tunable parameters for the Hyprland tiling visualizer mode.

import React, { useCallback } from 'react';
import type { VisualizerSettingsPanelProps } from '../definition';
import {
    DEFAULT_HYPR_TUNING,
    HYPR_MFACT_MIN, HYPR_MFACT_MAX,
    HYPR_GAPS_INNER_MIN, HYPR_GAPS_INNER_MAX,
    HYPR_GAPS_OUTER_MIN, HYPR_GAPS_OUTER_MAX,
    HYPR_ROUNDING_MIN, HYPR_ROUNDING_MAX,
    HYPR_BORDER_SIZE_MIN, HYPR_BORDER_SIZE_MAX,
    HYPR_INACTIVE_DIM_MIN, HYPR_INACTIVE_DIM_MAX,
    HYPR_GLASS_OPACITY_MIN, HYPR_GLASS_OPACITY_MAX,
    HYPR_BLUR_STRENGTH_MIN, HYPR_BLUR_STRENGTH_MAX,
    HYPR_BORDER_SPIN_SPEED_MIN, HYPR_BORDER_SPIN_SPEED_MAX,
    HYPR_TRANSITION_SPEED_MIN, HYPR_TRANSITION_SPEED_MAX,
    HYPR_SHOW_PAST_COUNT_MIN, HYPR_SHOW_PAST_COUNT_MAX,
    HYPR_SHOW_UPCOMING_COUNT_MIN, HYPR_SHOW_UPCOMING_COUNT_MAX,
    HYPR_AUDIO_GLOW_MIN, HYPR_AUDIO_GLOW_MAX,
} from '../../../types';

const HyprSettingsPanel: React.FC<VisualizerSettingsPanelProps> = ({
    t,
    hyprTuning,
    onHyprTuningChange,
    onSliderPointerDown,
    onSliderCommit,
    controlCardBg,
    rangeInputClass,
}) => {
    const tuning = hyprTuning ?? DEFAULT_HYPR_TUNING;

    const set = useCallback(
        (patch: Record<string, unknown>) => onHyprTuningChange?.(patch as any),
        [onHyprTuningChange],
    );

    const rangeStyle: React.CSSProperties = {
        width: '100%',
        accentColor: 'var(--accent-color)',
    };

    const cardStyle: React.CSSProperties = {
        background: controlCardBg,
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 8,
    };

    const labelStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
        fontSize: 13,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={labelStyle}>
                <span>{t('hyprSettings.layoutMode')}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {(['dwindle', 'master', 'monocle'] as const).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => set({ layoutMode: mode })}
                        style={{
                            flex: 1,
                            padding: '6px 0',
                            borderRadius: 8,
                            border: tuning.layoutMode === mode ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.15)',
                            background: tuning.layoutMode === mode ? 'rgba(var(--accent-color-rgb, 128,128,200), 0.2)' : 'transparent',
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: tuning.layoutMode === mode ? 600 : 400,
                        }}
                    >
                        {t(`hyprSettings.layout_${mode}`)}
                    </button>
                ))}
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.mfact')}</span>
                    <span>{(tuning.mfact * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min={HYPR_MFACT_MIN}
                    max={HYPR_MFACT_MAX}
                    step={0.01}
                    value={tuning.mfact}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ mfact: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.gapsInner')}</span>
                    <span>{tuning.gapsInner}px</span>
                </div>
                <input
                    type="range"
                    min={HYPR_GAPS_INNER_MIN}
                    max={HYPR_GAPS_INNER_MAX}
                    step={1}
                    value={tuning.gapsInner}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ gapsInner: parseInt(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.gapsOuter')}</span>
                    <span>{tuning.gapsOuter}px</span>
                </div>
                <input
                    type="range"
                    min={HYPR_GAPS_OUTER_MIN}
                    max={HYPR_GAPS_OUTER_MAX}
                    step={1}
                    value={tuning.gapsOuter}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ gapsOuter: parseInt(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.rounding')}</span>
                    <span>{tuning.rounding}px</span>
                </div>
                <input
                    type="range"
                    min={HYPR_ROUNDING_MIN}
                    max={HYPR_ROUNDING_MAX}
                    step={1}
                    value={tuning.rounding}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ rounding: parseInt(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.borderSize')}</span>
                    <span>{tuning.borderSize}px</span>
                </div>
                <input
                    type="range"
                    min={HYPR_BORDER_SIZE_MIN}
                    max={HYPR_BORDER_SIZE_MAX}
                    step={1}
                    value={tuning.borderSize}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ borderSize: parseInt(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.inactiveDim')}</span>
                    <span>{(tuning.inactiveDim * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min={HYPR_INACTIVE_DIM_MIN}
                    max={HYPR_INACTIVE_DIM_MAX}
                    step={0.01}
                    value={tuning.inactiveDim}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ inactiveDim: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.glassOpacity')}</span>
                    <span>{(tuning.glassOpacity * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min={HYPR_GLASS_OPACITY_MIN}
                    max={HYPR_GLASS_OPACITY_MAX}
                    step={0.01}
                    value={tuning.glassOpacity}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ glassOpacity: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.blurStrength')}</span>
                    <span>{tuning.blurStrength.toFixed(1)}</span>
                </div>
                <input
                    type="range"
                    min={HYPR_BLUR_STRENGTH_MIN}
                    max={HYPR_BLUR_STRENGTH_MAX}
                    step={0.1}
                    value={tuning.blurStrength}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ blurStrength: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.borderSpinSpeed')}</span>
                    <span>{tuning.borderSpinSpeed.toFixed(1)}</span>
                </div>
                <input
                    type="range"
                    min={HYPR_BORDER_SPIN_SPEED_MIN}
                    max={HYPR_BORDER_SPIN_SPEED_MAX}
                    step={0.1}
                    value={tuning.borderSpinSpeed}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ borderSpinSpeed: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.transitionSpeed')}</span>
                    <span>{tuning.transitionSpeed.toFixed(1)}</span>
                </div>
                <input
                    type="range"
                    min={HYPR_TRANSITION_SPEED_MIN}
                    max={HYPR_TRANSITION_SPEED_MAX}
                    step={0.1}
                    value={tuning.transitionSpeed}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ transitionSpeed: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.showPastCount')}</span>
                    <span>{tuning.showPastCount}</span>
                </div>
                <input
                    type="range"
                    min={HYPR_SHOW_PAST_COUNT_MIN}
                    max={HYPR_SHOW_PAST_COUNT_MAX}
                    step={1}
                    value={tuning.showPastCount}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ showPastCount: parseInt(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.showUpcomingCount')}</span>
                    <span>{tuning.showUpcomingCount}</span>
                </div>
                <input
                    type="range"
                    min={HYPR_SHOW_UPCOMING_COUNT_MIN}
                    max={HYPR_SHOW_UPCOMING_COUNT_MAX}
                    step={1}
                    value={tuning.showUpcomingCount}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ showUpcomingCount: parseInt(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.showCoverWindow')}</span>
                </div>
                <button
                    onClick={() => set({ showCoverWindow: !tuning.showCoverWindow })}
                    style={{
                        width: '100%',
                        padding: '6px 0',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: tuning.showCoverWindow ? 'rgba(var(--accent-color-rgb, 128,128,200), 0.2)' : 'transparent',
                        color: 'inherit',
                        cursor: 'pointer',
                        fontSize: 13,
                    }}
                >
                    {tuning.showCoverWindow ? 'ON' : 'OFF'}
                </button>
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>
                    <span>{t('hyprSettings.audioGlow')}</span>
                    <span>{(tuning.audioGlow * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min={HYPR_AUDIO_GLOW_MIN}
                    max={HYPR_AUDIO_GLOW_MAX}
                    step={0.01}
                    value={tuning.audioGlow}
                    onPointerDown={onSliderPointerDown}
                    onPointerUp={onSliderCommit}
                    onChange={(e) => set({ audioGlow: parseFloat(e.target.value) })}
                    className={rangeInputClass}
                    style={rangeStyle}
                />
            </div>
        </div>
    );
};

export default HyprSettingsPanel;
