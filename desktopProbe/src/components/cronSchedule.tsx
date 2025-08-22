import { AVAILABLE_CRON_RULES } from '@/lib/types';
import { useState } from 'react';

import { ManualScanButton } from './manualScanButton';
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
  const [scanStatus, setScanStatus] = useState<string>('');

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
          <ManualScanButton className="w-[180px]" />
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
