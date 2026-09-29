import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, Mail, Clock, HelpCircle } from 'lucide-react';

export const BlockedScreen: React.FC = () => {
  const { userProfile, currentUser, logout } = useAuth();

  const formattedDate = userProfile?.blockedAt
    ? new Date(userProfile.blockedAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'غير محدد';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
        {/* Red warning top bar */}
        <div className="bg-rose-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-3">
            <ShieldAlert size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">تم تعليق / حظر حسابك</h1>
          <p className="text-rose-100 text-sm mt-1">
            لقد قام مدير النظام بتعليق صلاحيات وصول هذا الحساب مؤقتاً
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* User info box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">البريد الإلكتروني:</span>
              <span className="font-semibold text-slate-800" dir="ltr">
                {currentUser?.email || userProfile?.email}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">حالة الحساب:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                محظور
              </span>
            </div>

            {userProfile?.blockedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock size={14} />
                  تاريخ الحظر:
                </span>
                <span className="text-slate-700">{formattedDate}</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-3">
              <span className="text-xs text-slate-500 block mb-1">سبب الحظر:</span>
              <p className="text-sm font-medium text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {userProfile?.blockedReason || 'تم الحظر بواسطة مشرف النظام (الإدارة).'}
              </p>
            </div>
          </div>

          {/* Contact Admin note */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 text-sm">
            <HelpCircle size={18} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">هل تعتقد أن هذا الإجراء تم عن طريق الخطأ؟</p>
              <p className="text-amber-700 mt-1">
                يمكنك التواصل مع المشرف المسؤول لحل المشكلة أو إعادة تنشيط حسابك:
              </p>
              <a
                href="mailto:ahmedschoolp@gmail.com"
                className="mt-2 inline-flex items-center gap-1.5 text-amber-900 font-bold hover:underline"
                dir="ltr"
              >
                <Mail size={14} />
                ahmedschoolp@gmail.com
              </a>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => logout()}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج والتبديل لحساب آخر</span>
          </button>
        </div>
      </div>
    </div>
  );
};
