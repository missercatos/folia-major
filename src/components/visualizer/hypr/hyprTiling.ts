// src/components/visualizer/hypr/hyprTiling.ts
// Pure layout engine: computes non-overlapping rectangles for a set of windows
// using Hyprland-inspired tiling algorithms (dwindle, master, monocle).

export interface HyprRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface HyprWindow {
    id: string;
    role: 'cover' | 'active' | 'past' | 'upcoming';
}

export type HyprLayoutMode = 'dwindle' | 'master' | 'monocle';

interface DwindleSplit {
    axis: 'h' | 'v';
    ratio: number;
}

// Recursive dwindle split: bisect the work area into left/right or top/bottom
// depending on which axis makes child halves squarer.
const dwindleSplit = (rect: HyprRect, splitRatio: number): DwindleSplit => {
    const widerThanTall = rect.w > rect.h;
    return { axis: widerThanTall ? 'v' : 'h', ratio: splitRatio };
};

const dwindleLayout = (
    rect: HyprRect,
    count: number,
    gaps: number,
    splitRatio: number,
): HyprRect[] => {
    if (count <= 0) return [];
    if (count === 1) return [rect];

    const split = dwindleSplit(rect, splitRatio);

    const gap = gaps / 2;
    const result: HyprRect[] = [];

    if (split.axis === 'v') {
        // Vertical split: left / right
        const leftW = Math.max(0, rect.w * split.ratio - gap);
        const rightW = Math.max(0, rect.w * (1 - split.ratio) - gap);
        const leftRect: HyprRect = { x: rect.x, y: rect.y, w: leftW, h: rect.h };
        const rightRect: HyprRect = {
            x: rect.x + leftW + gaps,
            y: rect.y,
            w: rightW,
            h: rect.h,
        };

        const leftCount = Math.ceil(count / 2);
        const rightCount = count - leftCount;
        result.push(...dwindleLayout(leftRect, leftCount, gaps, splitRatio));
        result.push(...dwindleLayout(rightRect, rightCount, gaps, splitRatio));
    } else {
        // Horizontal split: top / bottom
        const topH = Math.max(0, rect.h * split.ratio - gap);
        const bottomH = Math.max(0, rect.h * (1 - split.ratio) - gap);
        const topRect: HyprRect = { x: rect.x, y: rect.y, w: rect.w, h: topH };
        const bottomRect: HyprRect = {
            x: rect.x,
            y: rect.y + topH + gaps,
            w: rect.w,
            h: bottomH,
        };

        const topCount = Math.ceil(count / 2);
        const bottomCount = count - topCount;
        result.push(...dwindleLayout(topRect, topCount, gaps, splitRatio));
        result.push(...dwindleLayout(bottomRect, bottomCount, gaps, splitRatio));
    }

    return result;
};

// Master layout: hero window on the left, rest stacked vertically on the right.
const masterLayout = (
    rect: HyprRect,
    count: number,
    gaps: number,
    mfact: number,
): HyprRect[] => {
    if (count <= 0) return [];
    if (count === 1) return [rect];

    const gap = gaps / 2;
    const masterW = Math.max(0, rect.w * mfact - gap);
    const stackW = Math.max(0, rect.w * (1 - mfact) - gap);
    const masterRect: HyprRect = { x: rect.x, y: rect.y, w: masterW, h: rect.h };
    const stackRect: HyprRect = {
        x: rect.x + masterW + gaps,
        y: rect.y,
        w: stackW,
        h: rect.h,
    };

    const rects: HyprRect[] = [masterRect];
    // Stack remaining windows vertically
    const stackCount = count - 1;
    if (stackCount > 0) {
        const stackGap = Math.max(0, gap);
        const slotH = (rect.h - stackGap * Math.max(0, stackCount - 1)) / stackCount;
        for (let i = 0; i < stackCount; i++) {
            rects.push({
                x: stackRect.x,
                y: stackRect.y + i * (slotH + gaps),
                w: stackRect.w,
                h: Math.max(0, slotH),
            });
        }
    }

    return rects;
};

// Monocle layout: only the active window is visible (full screen).
const monocleLayout = (
    rect: HyprRect,
    _count: number,
    gaps: number,
): HyprRect[] => {
    const gap = gaps;
    return [{
        x: rect.x + gap,
        y: rect.y + gap,
        w: Math.max(0, rect.w - gap * 2),
        h: Math.max(0, rect.h - gap * 2),
    }];
};

export interface HyprTilingInput {
    viewport: { width: number; height: number };
    windows: HyprWindow[];
    layoutMode: HyprLayoutMode;
    gapsInner: number;
    gapsOuter: number;
    mfact: number;
}

export const computeHyprLayout = (input: HyprTilingInput): HyprRect[] => {
    const { viewport, windows, layoutMode, gapsInner, gapsOuter, mfact } = input;
    const count = windows.length;
    if (count === 0 || viewport.width <= 0 || viewport.height <= 0) return [];

    const workArea: HyprRect = {
        x: 0,
        y: 0,
        w: viewport.width,
        h: viewport.height,
    };

    const outerGap = gapsOuter;
    const innerGap = gapsInner;
    const rect: HyprRect = {
        x: outerGap,
        y: outerGap,
        w: Math.max(0, viewport.width - outerGap * 2),
        h: Math.max(0, viewport.height - outerGap * 2),
    };

    switch (layoutMode) {
        case 'monocle':
            return monocleLayout(rect, count, innerGap);
        case 'master':
            return masterLayout(rect, count, innerGap, mfact);
        case 'dwindle':
        default:
            return dwindleLayout(rect, count, innerGap, mfact);
    }
};
