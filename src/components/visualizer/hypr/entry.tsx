import React from 'react';
import { defineVisualizer } from '../definition';
// src/components/visualizer/hypr/entry.tsx
// Hyprland tiling-inspired lyric visualizer mode.

const VisualizerHypr = React.lazy(() => import('./VisualizerHypr'));
const HyprSettingsPanel = React.lazy(() => import('./HyprSettingsPanel'));

export default defineVisualizer({
    mode: 'hypr',
    order: 140,
    labelKey: 'ui.visualizerHypr',
    labelFallback: 'Hypr',
    previewSeed: 'hypr',
    previewStartOffset: 0,
    tuningKind: 'hypr',
    render: (props) => <VisualizerHypr {...props} />,
    renderSettingsPanel: (props) => <HyprSettingsPanel {...props} />,
    resetSettings: ({ resetHyprTuning }) => { resetHyprTuning?.(); },
});
