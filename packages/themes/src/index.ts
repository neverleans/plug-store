export * from './defineTheme';

// The 50 built-in themes are defined in @neverleans/plug-store-core, where the
// ThemeProvider consumes them. Re-exported here so this package stays the canonical
// import path for themes without keeping a second copy that drifts — which is exactly
// what previously left 35 of the 50 themes rendering as the fashion fallback.
export { themeConfigs } from '@neverleans/plug-store-core';
