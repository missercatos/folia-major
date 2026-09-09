// src/components/visualizer/hypr/HyprPane.tsx
// Single lyric window: glass surface, rounded corners, shadow, rotating gradient border.

import React, { useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { getHyprEnterVariants, layoutTransition } from './hyprMotions';
import type { HyprWindowEnterStyle } from '../../../types';

export interface HyprPaneProps {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    rounding: number;
    borderSize: number;
    glassOpacity: number;
    blurStrength: number;
    inactiveDim: number;
    isActive: boolean;
    enterStyle: HyprWindowEnterStyle;
    borderSpinSpeed: number;
    transitionSpeed: number;
    onClick?: () => void;
    children: React.ReactNode;
}

// Build a conic-gradient CSS string for the focus border
const buildConicGradient = (
    isActive: boolean,
    theme: { accentColor?: string; primaryColor?: string },
    borderSpinSpeed: number,
): string => {
    if (!isActive || borderSpinSpeed <= 0) {
        return `linear-gradient(${theme.accentColor ?? '#888'}, ${theme.primaryColor ?? '#666'})`;
    }
    // Rotating conic gradient: 4 color stops around the ring
    const accent = theme.accentColor ?? '#888';
    return `conic-gradient(from 0deg, ${accent}, transparent 25%, ${accent} 50%, transparent 75%, ${accent})`;
};

const HyprPaneInner: React.FC<HyprPaneProps> = ({
    id,
    x,
    y,
    w,
    h,
    rounding,
    borderSize,
    glassOpacity,
    blurStrength,
    inactiveDim,
    isActive,
    enterStyle,
    borderSpinSpeed,
    transitionSpeed,
    onClick,
    children,
}) => {
    const variants = useMemo(() => getHyprEnterVariants(enterStyle), [enterStyle]);

    const opacity = isActive ? 1 : inactiveDim;
    const borderGrad = useMemo(() => {
        // Approximate accent from a global CSS var fallback (we don't have theme in props here)
        return isActive ? `conic-gradient(from 0deg, var(--hypr-accent, #8888cc), transparent 25%, var(--hypr-accent, #8888cc) 50%, transparent 75%, var(--hypr-accent, #8888cc))` : 'none';
    }, [isActive]);

    const innerRadius = rounding;
    const outerRadius = rounding + borderSize;

    return (
        <motion.div
            layout
            layoutId={`hypr-pane-${id}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{
                ...layoutTransition,
                stiffness: layoutTransition.stiffness * transitionSpeed,
            }}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: w,
                height: h,
                borderRadius: outerRadius,
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : undefined,
            }}
            onClick={onClick}
        >
            {/* Border ring layer */}
            {borderSize > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: outerRadius,
                        border: `${borderSize}px solid transparent`,
                        background: isActive
                            ? `conic-gradient(from 0deg, var(--hypr-accent, #8888cc), transparent 25%, var(--hypr-accent, #8888cc) 50%, transparent 75%, var(--hypr-accent, #8888cc)) border-box`
                            : `linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0.12)) border-box`,
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        animation: isActive && borderSpinSpeed > 0
                            ? `hypr-spin ${2 / borderSpinSpeed}s linear infinite`
                            : 'none',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Glass surface */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: innerRadius,
                    background: `rgba(128, 128, 128, ${glassOpacity * 0.35})`,
                    backdropFilter: blurStrength > 0 ? `blur(${blurStrength * 12}px)` : undefined,
                    WebkitBackdropFilter: blurStrength > 0 ? `blur(${blurStrength * 12}px)` : undefined,
                    opacity,
                    transition: `opacity ${0.3 * transitionSpeed}s ease`,
                }}
            />

            {/* Content layer */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    padding: '12px 16px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity,
                    transition: `opacity ${0.3 * transitionSpeed}s ease`,
                }}
            >
                {children}
            </div>
        </motion.div>
    );
};

export default React.memo(HyprPaneInner);
