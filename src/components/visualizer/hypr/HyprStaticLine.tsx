// src/components/visualizer/hypr/HyprStaticLine.tsx
// Inactive lyric line text: dim, static, no animation.

import React, { useMemo } from 'react';
import type { Line, Theme } from '../../../types';
import { resolveThemeFontStack, resolveThemeFontWeight } from '../../../utils/fontStacks';

export interface HyprStaticLineProps {
    line: Line;
    theme: Theme;
    fontScale: number;
}

const HyprStaticLine: React.FC<HyprStaticLineProps> = ({
    line,
    theme,
    fontScale,
}) => {
    const fontStack = useMemo(() => resolveThemeFontStack(theme), [theme]);
    const fontWeight = useMemo(() => resolveThemeFontWeight(theme, 300), [theme]);

    return (
        <div
            style={{
                fontSize: `${fontScale * 0.8}em`,
                fontFamily: fontStack,
                fontWeight,
                lineHeight: 1.4,
                textAlign: 'center',
                color: theme.primaryColor,
                opacity: 0.4,
                wordBreak: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
            }}
        >
            {line.fullText}
        </div>
    );
};

export default React.memo(HyprStaticLine);
