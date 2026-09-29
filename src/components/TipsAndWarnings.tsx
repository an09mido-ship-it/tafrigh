import React from 'react';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export function TipsAndWarnings() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Best Practices */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4 text-blue-800">
          <CheckCircle2 size={20} />
          <h3 className="font-semibold">Best Practices for High Accuracy</h3>
        </div>
        <ul className="space-y-3 text-sm text-blue-900">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Ensure audio is clear and speech is distinct from background noise.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>One speaker reading plates clearly yields the best results.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Keep individual files under 10-15 minutes if possible to avoid timeouts.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Keep this tab <strong>active and in focus</strong> while processing. Browsers slow down background tabs.</span>
          </li>
        </ul>
      </div>

      {/* Warnings & Limitations */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-center gap-2 mb-4 text-amber-800">
          <AlertTriangle size={20} />
          <h3 className="font-semibold">Warnings & Limitations</h3>
        </div>
        <ul className="space-y-3 text-sm text-amber-900">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span><strong>Gemini 3.5 Transcribe</strong> may occasionally fail (Error 500). The system will auto-retry 3 times.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Extremely large video files (e.g., &gt;500MB) may crash the browser tab due to memory limits during preprocessing.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Do not close or refresh the page during the batch process.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Only Saudi license plate formats are supported.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
