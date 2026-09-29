import React, { useState } from 'react';
import { Download, Table as TableIcon, Pencil, Plus, Check } from 'lucide-react';
import { ProcessedResult } from '../services/gemini';
import { CANONICAL_SURVEY_NOTES, CANONICAL_VEHICLE_TYPES } from '../utils/arabicNormalizer';

interface ResultsTableProps {
  results: ProcessedResult[];
  onUpdateNote: (resultId: string, entryIndex: number, newNote: string) => void;
  onUpdateEntryField?: (resultId: string, entryIndex: number, field: 'type' | 'plate' | 'notes', value: string) => void;
  onUpdateResultNote?: (resultId: string, newNote: string) => void;
  onAddManualEntry?: (resultId: string) => void;
}

export function ResultsTable({
  results,
  onUpdateNote,
  onUpdateEntryField,
  onUpdateResultNote,
  onAddManualEntry
}: ResultsTableProps) {
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const handleExportCSV = () => {
    // Add BOM for Excel Arabic support
    const BOM = '\uFEFF';
    const headers = ['الملف (Source)', 'المعرف (ID)', 'نوع السيارة (Type)', 'رقم اللوحة (Plate)', 'الملاحظات (Notes)'];
    
    const rows = results.flatMap(result => 
      result.entries.length > 0 ? (
        result.entries.map(entry => [
          result.source,
          result.id,
          entry.type || '',
          entry.plate || '',
          entry.notes || ''
        ])
      ) : [
        [
          result.source,
          result.id,
          '',
          '',
          result.customNote || (result.error ? `Error: ${result.error}` : 'لم يتم العثور على لوحات')
        ]
      ]
    );

    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `license_plates_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFeedback = (id: string) => {
    setSavedFeedback(id);
    setTimeout(() => {
      setSavedFeedback((prev) => (prev === id ? null : prev));
    }, 1500);
  };

  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <TableIcon size={20} className="text-indigo-600" />
            <h3 className="text-lg">البيانات المستخرجة (Extracted Plates)</h3>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Pencil size={13} className="text-indigo-500" />
            <span>خانة <strong>الملاحظات</strong> قابلة للكتابة والتعديل مباشرة، وسيتم حفظها في ملف الـ CSV.</span>
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors text-sm font-medium shadow-sm shrink-0"
        >
          <Download size={16} />
          <span>تصدير ملف Excel / CSV</span>
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
            <tr>
              <th className="px-4 py-3 min-w-[160px]">الملف (Source)</th>
              <th className="px-4 py-3 min-w-[140px]">نوع السيارة (Vehicle Type)</th>
              <th className="px-4 py-3 min-w-[140px]">رقم اللوحة (Plate Number)</th>
              <th className="px-4 py-3 min-w-[280px]">
                <div className="flex items-center gap-1.5 text-indigo-900">
                  <Pencil size={14} className="text-indigo-600" />
                  <span>الملاحظات (Notes) - قابلة للكتابة ✏️</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.flatMap((result) => 
              result.entries.length > 0 ? (
                result.entries.map((entry, idx) => {
                  const entryKey = `${result.id}-${idx}`;
                  return (
                    <tr key={entryKey} className="hover:bg-indigo-50/30 transition-colors">
                      {/* Source */}
                      <td className="px-4 py-3 text-gray-700 font-medium max-w-[200px] truncate" title={result.source}>
                        {result.source}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 text-gray-900">
                        {onUpdateEntryField ? (
                          <input
                            type="text"
                            dir="rtl"
                            list="vehicle-types-datalist"
                            value={entry.type}
                            onChange={(e) => onUpdateEntryField(result.id, idx, 'type', e.target.value)}
                            placeholder="نوع أو حالة المركبة..."
                            className="w-full px-2.5 py-1 text-xs bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none transition-all placeholder:text-gray-400"
                          />
                        ) : (
                          entry.type ? (
                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md font-medium text-xs">
                              {entry.type}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )
                        )}
                      </td>

                      {/* Plate */}
                      <td className="px-4 py-3">
                        {onUpdateEntryField ? (
                          <input
                            type="text"
                            dir="rtl"
                            value={entry.plate}
                            onChange={(e) => onUpdateEntryField(result.id, idx, 'plate', e.target.value)}
                            placeholder="رقم اللوحة..."
                            className="w-full px-2.5 py-1 text-sm font-mono font-bold text-emerald-800 bg-emerald-50/80 hover:bg-white focus:bg-white border border-emerald-200 focus:border-emerald-500 rounded-md focus:outline-none transition-all"
                          />
                        ) : (
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono font-bold text-base tracking-wider" dir="rtl">
                            {entry.plate}
                          </span>
                        )}
                      </td>

                      {/* Notes (Fully Editable) */}
                      <td className="px-4 py-3">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            dir="rtl"
                            list="survey-notes-datalist"
                            value={entry.notes || ''}
                            onChange={(e) => {
                              onUpdateNote(result.id, idx, e.target.value);
                              triggerFeedback(entryKey);
                            }}
                            placeholder="اختر أو اكتب ملاحظة (مثل: اول برحه يمين، شارع سدين)..."
                            className="w-full px-3 py-1.5 text-sm text-gray-900 bg-amber-50/40 hover:bg-white focus:bg-white border border-amber-200/80 hover:border-indigo-400 focus:border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400 placeholder:text-xs"
                          />
                          {savedFeedback === entryKey && (
                            <span className="absolute left-2 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 pointer-events-none animate-fade-in">
                              <Check size={10} /> تم
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr key={result.id} className="hover:bg-amber-50/30">
                  <td className="px-4 py-3.5 text-gray-700 font-medium max-w-[200px] truncate" title={result.source}>
                    {result.source}
                  </td>
                  <td colSpan={3} className="px-4 py-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="text-amber-700 text-xs shrink-0">
                        {result.error ? (
                          <span className="text-red-600 font-medium">{result.error}</span>
                        ) : (
                          <span>لم يتم استخراج لوحات تلقائياً</span>
                        )}
                      </div>

                      {/* Allow user to write note even if no plates were detected */}
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          dir="rtl"
                          value={result.customNote || ''}
                          onChange={(e) => onUpdateResultNote && onUpdateResultNote(result.id, e.target.value)}
                          placeholder="اكتب ملاحظة لهذا الملف (مثال: لا يوجد لوحات، أو اكتب ما قيل في الصوت)..."
                          className="flex-1 px-3 py-1.5 text-xs text-gray-800 bg-amber-50/50 hover:bg-white focus:bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        {onAddManualEntry && (
                          <button
                            type="button"
                            onClick={() => onAddManualEntry(result.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors shrink-0"
                          >
                            <Plus size={13} />
                            <span>إضافة لوحة يدوياً</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Datalist for autocomplete with the 44 canonical notes */}
      <datalist id="survey-notes-datalist">
        {CANONICAL_SURVEY_NOTES.map((note) => (
          <option key={note} value={note} />
        ))}
      </datalist>

      {/* Datalist for autocomplete with canonical vehicle types & classifications */}
      <datalist id="vehicle-types-datalist">
        {CANONICAL_VEHICLE_TYPES.map((vType) => (
          <option key={vType} value={vType} />
        ))}
      </datalist>
    </div>
  );
}
