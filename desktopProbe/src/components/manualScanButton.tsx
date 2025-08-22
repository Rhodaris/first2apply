import { useAppState } from '@/hooks/appState';
import { triggerManualScan } from '@/lib/electronMainSdk';
import { useState } from 'react';

import { Button } from './ui/button';

interface ManualScanButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ManualScanButton({ variant = 'default', size = 'default', className }: ManualScanButtonProps) {
  const { isScanning: isCurrentlyScanning } = useAppState();
  const [isTriggering, setIsTriggering] = useState(false);

  const handleManualScan = async () => {
    setIsTriggering(true);
    
    try {
      await triggerManualScan();
    } catch (error: any) {
      console.error('Failed to trigger manual scan:', error);
    } finally {
      setIsTriggering(false);
    }
  };

  const isButtonDisabled = isCurrentlyScanning || isTriggering;

  return (
    <Button
      onClick={handleManualScan}
      disabled={isButtonDisabled}
      variant={variant}
      size={size}
      className={className}
    >
      {isCurrentlyScanning 
        ? 'Scanner Running...' 
        : isTriggering 
          ? 'Starting...' 
          : 'Run Search Now'
      }
    </Button>
  );
}
