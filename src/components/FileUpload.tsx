import React, { useCallback } from 'react';
import { Upload, FileAudio, FileVideo, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const ALLOWED_EXTENSIONS = [
  '.mp3', '.wav', '.m4a', '.ogg', '.aac', 
  '.mp4', '.mov', '.webm', '.avi'
];

export function FileUpload({ onFilesSelected, disabled }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      validateAndPassFiles(droppedFiles);
    },
    [disabled, onFilesSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    const selectedFiles = Array.from(e.target.files) as File[];
    validateAndPassFiles(selectedFiles);
  };

  const validateAndPassFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Only audio and video files are allowed.');
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        disabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
          : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer'
      }`}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        accept={ALLOWED_EXTENSIONS.join(',')}
        disabled={disabled}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
        <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
          <Upload size={32} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Drop audio/video files here
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400 max-w-md">
          {ALLOWED_EXTENSIONS.map(ext => (
            <span key={ext} className="bg-white px-2 py-1 rounded border border-gray-200">
              {ext}
            </span>
          ))}
        </div>
      </label>
    </div>
  );
}
