// src/components/visualizer/hypr/hyprMotions.ts
// Animation variants inspired by Hyprland's window open/close/switch behaviors.

import type { Variants } from 'framer-motion';
import type { HyprWindowEnterStyle } from '../../../types';

// Hyprland "popin 87%" — scale from 87% centered rectangle to full size
const popinVariants: Variants = {
    initial: { scale: 0.87, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } },
    exit: { scale: 0.87, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

// Hyprland "slide" — enter from nearest edge, exit same way
const slideVariants: Variants = {
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 30 } },
    exit: { y: 24, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
};

// Hyprland "fade" — simple opacity crossfade
const fadeVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const getHyprEnterVariants = (style: HyprWindowEnterStyle): Variants => {
    switch (style) {
        case 'slide': return slideVariants;
        case 'fade': return fadeVariants;
        case 'popin':
        default: return popinVariants;
    }
};

// "gnome" collapse: window shrinks to zero height at bottom of its slot
export const gnomeCollapseVariants: Variants = {
    initial: { scaleY: 0, opacity: 0, originY: 1 },
    animate: { scaleY: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 30 } },
    exit: { scaleY: 0, opacity: 0, originY: 1, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Layout reflow spring for position/size changes
export const layoutTransition = {
    type: 'spring' as const,
    stiffness: 220,
    damping: 26,
};
