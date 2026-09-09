import { defineVisualizerTuning } from '../tuningRegistry';
// src/components/visualizer/hypr/tuning.ts
// Transport adapter for Hypr tuning: bridges the store field to the renderer.

export default defineVisualizerTuning({
    mode: 'hypr',
    settingsKey: 'hyprTuning',
    settingsSetterKey: 'handleSetHyprTuning',
    apply: (props, tuning) => ({ ...props, hyprTuning: tuning }),
});
