import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { ResultsTable } from './components/ResultsTable';
import { TipsAndWarnings } from './components/TipsAndWarnings';
import { AuthModal } from './components/AuthModal';
import { BlockedScreen } from './components/BlockedScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { processFile } from './utils/audioProcessing';
import { extractLicensePlates, ProcessedResult } from './services/gemini';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  Shield,
  LogOut,
  CheckCircle,
  Users,
  RefreshCw,
} from 'lucide-react';

// Utility for concurrency control
async function asyncPool<T, R>(
  poolLimit: number,
  array: T[],
  iteratorFn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const ret: Promise<R>[] = [];
  const executing: Promise<void>[] = [];

  for (const [i, item] of array.entries()) {
    const p = Promise.resolve().then(() => iteratorFn(item, i));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

export default function App() {
  const { currentUser, userProfile, isAdmin, isBlocked, isLoading, logout } = useAuth();
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      );
    });
  }, []);

  const handleReset = () => {
    setFiles([]);
    setIsProcessing(false);
    setProgress(0);
    setCurrentFile(undefined);
    setResults([]);
    setFailedFiles([]);
    setProcessedCount(0);
  };

  const handleUpdateNote = (resultId: string, entryIndex: number, newNote: string) => {
    setResults((prev) =>
      prev.map((res) => {
        if (res.id === resultId) {
          const updatedEntries = [...res.entries];
          if (updatedEntries[entryIndex]) {
            updatedEntries[entryIndex] = {
              ...updatedEntries[entryIndex],
              notes: newNote,
            };
          }
          return { ...res, entries: updatedEntries };
        }
        return res;
      })
    );
  };

  const handleUpdateEntryField = (
    resultId: string,
    entryIndex: number,
    field: 'type' | 'plate' | 'notes',
    value: string
  ) => {
    setResults((prev) =>
      prev.map((res) => {
        if (res.id === resultId) {
          const updatedEntries = [...res.entries];
          if (updatedEntries[entryIndex]) {
            updatedEntries[entryIndex] = {
              ...updatedEntries[entryIndex],
              [field]: value,
            };
          }
          return { ...res, entries: updatedEntries };
        }
        return res;
      })
    );
  };

  const handleUpdateResultNote = (resultId: string, newNote: string) => {
    setResults((prev) =>
      prev.map((res) => {
        if (res.id === resultId) {
          return { ...res, customNote: newNote };
        }
        return res;
      })
    );
  };

  const handleAddManualEntry = (resultId: string) => {
    setResults((prev) =>
      prev.map((res) => {
        if (res.id === resultId) {
          return {
            ...res,
            entries: [...res.entries, { type: '', plate: '', notes: '' }],
          };
        }
        return res;
      })
    );
  };

  const startProcessing = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    setFailedFiles([]);
    setResults([]);

    const FILE_CONCURRENCY = 2;
    const CHUNK_CONCURRENCY = 3;

    const processSingleFile = async (file: File) => {
      try {
        setCurrentFile(`جاري المعالجة: ${file.name}`);

        const audioChunks = await processFile(file);

        const processChunk = async (chunk: any, chunkIndex: number) => {
          const chunkName =
            audioChunks.length > 1 ? `${file.name} (الجزء ${chunkIndex + 1})` : file.name;
          return await extractLicensePlates(chunk, chunkName);
        };

        const chunkResults = await asyncPool(CHUNK_CONCURRENCY, audioChunks, processChunk);

        let allEntries: any[] = [];
        const transcripts: string[] = [];
        let errorMsg: string | undefined = undefined;

        chunkResults.forEach((res) => {
          if (res.transcript) {
            transcripts.push(res.transcript);
          }
          if (res.entries && res.entries.length > 0) {
            allEntries = [...allEntries, ...res.entries];
          }
          if (res.error) {
            errorMsg = res.error;
          }
        });

        const finalResult: ProcessedResult = {
          source: file.name,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          transcript: transcripts.join(' | '),
          entries: allEntries,
          error: errorMsg,
        };

        setResults((prev) => [...prev, finalResult]);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        setFailedFiles((prev) => [...prev, file.name]);
      } finally {
        setProcessedCount((prev) => {
          const newCount = prev + 1;
          setProgress(newCount / files.length);
          return newCount;
        });
      }
    };

    await asyncPool(FILE_CONCURRENCY, files, processSingleFile);

    setIsProcessing(false);
    setCurrentFile(undefined);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-600/30 mb-4 animate-bounce">
          🇸🇦
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <RefreshCw size={20} className="animate-spin text-emerald-600" />
          <span>جاري التحقق من الجلسة والصلاحيات...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Show Login/Register Modal
  if (!currentUser) {
    return <AuthModal />;
  }

  // 3. Blocked Account -> Show Blocked Screen immediately
  if (isBlocked) {
    return <BlockedScreen />;
  }

  // 4. Authenticated & Active -> Main Application
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header with User Info and Admin Dashboard Button */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
              🇸🇦
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span>مستخرج اللوحات السعودية</span>
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                  (Saudi License Plate Extractor)
                </span>
              </h1>
              <div className="text-[11px] text-emerald-600 font-medium hidden sm:block">
                Powered by Gemini AI • Firebase Cloud
              </div>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Dashboard Button (Only visible to Admin) */}
            {isAdmin && (
              <button
                onClick={() => setShowAdminDashboard(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                title="لوحة تحكم المشرف وإدارة المستخدمين"
              >
                <Shield size={14} className="text-purple-200" />
                <span className="hidden md:inline">لوحة تحكم المشرف</span>
                <span className="md:hidden">الإدارة</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">الأدمن</span>
              </button>
            )}

            {/* User Profile Chip */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-xl text-xs">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}

              <div className="hidden sm:block text-right">
                <div className="font-semibold text-slate-800 leading-tight max-w-[130px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </div>
                <div className="text-[10px] text-slate-400 max-w-[130px] truncate" dir="ltr">
                  {currentUser.email}
                </div>
              </div>

              {/* Status Badge */}
              {isAdmin ? (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  <Shield size={10} />
                  مشرف
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  <CheckCircle size={10} />
                  نشط
                </span>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard Modal */}
      {showAdminDashboard && isAdmin && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}

      {/* Main Extractor Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Account Status Banner */}
        <section className="bg-white rounded-xl p-5 border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                مرحباً بك، {currentUser.displayName || currentUser.email}!
              </h2>
              <p className="text-xs text-slate-500">
                حسابك نشط ومصرح له باستخدام استخراج اللوحات السعودية من الملفات الصوتية والمرئية.
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="text-xs text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shrink-0">
              <Shield size={14} />
              <span>أنت مسجل كمدير النظام (Admin)</span>
            </div>
          )}
        </section>

        {/* Instructions */}
        <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
          <h2 className="text-lg font-semibold mb-2">Batch Processing System</h2>
          <p className="text-gray-600 mb-4 text-sm">
            قم برفع التسجيلات الصوتية أو مقاطع الفيديو لاستخراج لوحات السيارات السعودية آلياً.
            يدعم الملفات بصيغ .mp3, .wav, .mp4, .mov والمزيد.
          </p>

          {!isProcessing && files.length === 0 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 rounded-lg text-sm border border-amber-200/60">
              <AlertTriangle className="shrink-0 mt-0.5 text-amber-600" size={16} />
              <p>
                <strong>ملاحظة تقنية:</strong> مقاطع الفيديو الكبيرة تتم معالجتها وضغط الصوت محلياً داخل المتصفح قبل الإرسال لتحسين السرعة وتقليل استهلاك البيانات.
              </p>
            </div>
          )}
        </section>

        {/* File Upload Area */}
        <section>
          <FileUpload onFilesSelected={handleFilesSelected} disabled={isProcessing} />

          {files.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-700 text-sm">
                تم اختيار {files.length} ملف
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <RotateCcw size={16} />
                  إعادة تعيين (Reset)
                </button>
                <button
                  onClick={startProcessing}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    'جاري المعالجة...'
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" />
                      بدء المعالجة واستخراج اللوحات
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tips & Warnings */}
        {!isProcessing && files.length === 0 && (
          <section>
            <TipsAndWarnings />
          </section>
        )}

        {/* Progress Status */}
        {(isProcessing || processedCount > 0) && (
          <section>
            <ProcessingStatus
              progress={progress}
              currentFile={currentFile}
              totalFiles={files.length}
              processedCount={processedCount}
              failedFiles={failedFiles}
            />
          </section>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <section>
            <ResultsTable
              results={[...results].sort((a, b) =>
                a.source.localeCompare(b.source, undefined, { numeric: true, sensitivity: 'base' })
              )}
              onUpdateNote={handleUpdateNote}
              onUpdateEntryField={handleUpdateEntryField}
              onUpdateResultNote={handleUpdateResultNote}
              onAddManualEntry={handleAddManualEntry}
            />
          </section>
        )}
      </main>
    </div>
  );
}
