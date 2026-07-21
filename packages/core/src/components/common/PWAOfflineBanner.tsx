import React from 'react';
import { usePWA } from '../../hooks/usePWA';
import { WifiOff, Download } from 'lucide-react';

export const PWAOfflineBanner: React.FC = () => {
  const { isOffline, canInstall, promptInstall } = usePWA();

  if (!isOffline && !canInstall) return null;

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 text-foreground py-2 px-4 text-xs flex items-center justify-between transition-all">
      {isOffline ? (
        <div className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Modo Offline Ativo — Você está navegando nos produtos salvos em cache.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>📱 Deseja instalar o aplicativo do catálogo no seu dispositivo?</span>
        </div>
      )}

      {canInstall && !isOffline && (
        <button
          onClick={promptInstall}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full hover:opacity-90 transition-all text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar App</span>
        </button>
      )}
    </div>
  );
};

export default PWAOfflineBanner;
