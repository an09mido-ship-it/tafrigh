import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  currentFile?: string;
  totalFiles: number;
  processedCount: number;
  failedFiles: string[];
}

export function ProcessingStatus({
  progress,
  currentFile,
  totalFiles,
  processedCount,
  failedFiles
}: ProcessingStatusProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Processing Status</h3>
        <span className="text-sm font-medium text-gray-500">
          {processedCount} / {totalFiles} Files
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Current Status */}
      <div className="space-y-3">
        {currentFile && (
          <div className="flex items-center gap-3 text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg animate-pulse">
            <Loader2 className="animate-spin" size={18} />
            <span className="font-medium truncate">Processing: {currentFile}</span>
          </div>
        )}

        {failedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
              Failed Files ({failedFiles.length})
            </h4>
            <div className="bg-red-50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1">
              {failedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle size={12} />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
