import { useAppState } from '@/hooks/appState';
import { triggerManualScan } from '@/lib/electronMainSdk';
import { AVAILABLE_CRON_RULES } from '@/lib/types';
import { useState } from 'react';

import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

/**
 * Component used to set the cron schedule of the probe.
 */
export function CronSchedule({
  cronRule,
  onCronRuleChange,
}: {
  cronRule?: string;
  onCronRuleChange: (cron: string | undefined) => void;
}) {
  const { isScanning: isCurrentlyScanning } = useAppState();
  const [isTriggering, setIsTriggering] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');

  const handleManualScan = async () => {
    setIsTriggering(true);
    setScanStatus('Starting scan...');
    
    try {
      const result = await triggerManualScan();
      setScanStatus('Scan started successfully!');
    } catch (error: any) {
      setScanStatus(`Error: ${error.message || 'Failed to start scan'}`);
    } finally {
      setIsTriggering(false);
      // Clear status after 3 seconds
      setTimeout(() => setScanStatus(''), 3000);
    }
  };

  const isButtonDisabled = isCurrentlyScanning || isTriggering;

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-6 rounded-lg border p-6">
        <div className="space-y-1">
          <h2 className="text-lg">Search Frequency</h2>
          <p className="text-sm font-light">How often do you want to receive job notifications?</p>
        </div>
        <Select value={cronRule} onValueChange={onCronRuleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Never" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_CRON_RULES.map((rule) => (
              <SelectItem key={rule.value} value={rule.value}>
                {rule.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row items-center justify-between gap-6 rounded-lg border p-6">
          <div className="space-y-1">
            <h2 className="text-lg">Manual Control</h2>
            <p className="text-sm font-light">Run a search immediately to test your configuration</p>
          </div>
          <Button
            onClick={handleManualScan}
            disabled={isButtonDisabled}
            className="w-[180px]"
          >
            {isCurrentlyScanning 
              ? 'Scanner Running...' 
              : isTriggering 
                ? 'Starting...' 
                : 'Run Search Now'
            }
          </Button>
        </div>
        
        {scanStatus && (
          <div className={`text-sm p-3 rounded-lg border ${
            scanStatus.includes('Error') || scanStatus.includes('Failed')
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {scanStatus}
          </div>
        )}
      </div>
    </div>
  );
}
