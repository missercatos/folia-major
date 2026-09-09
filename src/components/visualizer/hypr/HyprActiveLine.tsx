// src/components/visualizer/hypr/HyprActiveLine.tsx
// Active lyric line with per-word timing reveal, similar to classic mode's word state machine.
// Uses useMotionValueEvent with equality guard; no per-frame React rerender.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { Line, Theme } from '../../../types';
import { resolveThemeFontStack, resolveThemeFontWeight } from '../../../utils/fontStacks';

export interface HyprActiveLineProps {
    line: Line;
    currentTime: MotionValue<number>;
    theme: Theme;
    fontScale: number;
    isPaused: boolean;
}

type WordStatus = 'waiting' | 'active' | 'passed';

const HyprActiveLine: React.FC<HyprActiveLineProps> = ({
    line,
    currentTime,
    theme,
    fontScale,
    isPaused,
}) => {
    const [wordStates, setWordStates] = useState<WordStatus[]>(() =>
        line.words.map(() => 'waiting' as WordStatus),
    );

    const fontStack = useMemo(() => resolveThemeFontStack(theme), [theme]);
    const fontWeight = useMemo(() => resolveThemeFontWeight(theme, 300), [theme]);

    const updateTime = useCallback(() => {
        const t = currentTime.get();
        const newStates = line.words.map<WordStatus>((word) => {
            if (t < word.startTime) return 'waiting';
            if (t >= word.endTime) return 'passed';
            return 'active';
        });
        setWordStates((prev) => {
            const changed = newStates.some((s, i) => s !== prev[i]);
            return changed ? newStates : prev;
        });
    }, [currentTime, line.words]);

    useMotionValueEvent(currentTime, 'change', updateTime);

    // Reset states on line change
    useEffect(() => {
        setWordStates(line.words.map(() => 'waiting'));
    }, [line]);

    return (
        <div
            style={{
                fontSize: `${fontScale}em`,
                fontFamily: fontStack,
                fontWeight,
                lineHeight: 1.6,
                textAlign: 'center',
                wordBreak: 'break-word',
            }}
        >
            {line.words.map((word, i) => {
                const status = wordStates[i] ?? 'waiting';
                const color = status === 'active' || status === 'passed'
                    ? theme.accentColor
                    : theme.primaryColor;
                const opacity = status === 'waiting' ? 0.35 : 1;
                return (
                    <span
                        key={`${word.text}-${i}`}
                        style={{
                            color,
                            opacity,
                            transition: 'color 0.15s ease, opacity 0.15s ease',
                            display: 'inline',
                        }}
                    >
                        {word.text}
                    </span>
                );
            })}
        </div>
    );
};

export default React.memo(HyprActiveLine);
