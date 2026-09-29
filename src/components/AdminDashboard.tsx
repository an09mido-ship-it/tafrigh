import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { AppUser, UserStatus } from '../types/user';
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Mail,
  Calendar,
  Lock,
  Unlock,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { currentUser, updateUserStatus, isAdmin } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'admin'>('all');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [blockModalUser, setBlockModalUser] = useState<AppUser | null>(null);
  const [blockReason, setBlockReason] = useState('مخالفة شروط الاستخدام أو بطلب من الإدارة');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to all users in realtime (Admins only)
  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: AppUser[] = [];
        snapshot.forEach((doc) => {
          fetched.push(doc.data() as AppUser);
        });
        setUsers(fetched);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-xl border border-rose-100">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">غير مصرح بالوصول</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            هذه اللوحة خاصة بمدير النظام فقط (<span className="font-semibold text-slate-800" dir="ltr">ahmedschoolp@gmail.com</span>). الحسابات الأخرى لا تملك صلاحية رؤية المستخدمين أو حظرهم.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-all"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleStatus = async (user: AppUser) => {
    if (user.uid === currentUser?.uid) {
      alert('لا يمكنك حظر حسابك الخاص كمسؤول!');
      return;
    }

    if (user.status === 'active') {
      // Open block reason modal
      setBlockModalUser(user);
    } else {
      // Unblock directly
      try {
        setActionInProgress(user.uid);
        await updateUserStatus(user.uid, 'active');
        showToast(`تم إلغاء حظر الحساب ${user.email} بنجاح.`);
      } catch (err: any) {
        alert('تعذر تحديث حالة المستخدم: ' + err.message);
      } finally {
        setActionInProgress(null);
      }
    }
  };

  const confirmBlock = async () => {
    if (!blockModalUser) return;
    try {
      setActionInProgress(blockModalUser.uid);
      await updateUserStatus(blockModalUser.uid, 'blocked', blockReason);
      showToast(`تم حظر المستخدم ${blockModalUser.email} بنجاح.`);
      setBlockModalUser(null);
    } catch (err: any) {
      alert('فشل حظر المستخدم: ' + err.message);
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter users based on query and tabs
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'active') return u.status === 'active';
    if (statusFilter === 'blocked') return u.status === 'blocked';
    if (statusFilter === 'admin') return u.role === 'admin';
    return true;
  });

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm overflow-y-auto" dir="rtl">
      <div className="min-h-screen px-4 py-8 flex justify-center">
        <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-auto max-h-[92vh]">
          {/* Top Bar */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
                <Shield size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">لوحة تحكم المشرف (Admin Control)</h2>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  التحكم في وصول المستخدمين وحظرهم أو تفعيل حساباتهم في الوقت الفعلي
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span>العودة للنظام</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between transition-all">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-emerald-100 hover:text-white text-xs">
                إغلاق
              </button>
            </div>
          )}

          <div className="p-6 overflow-y-auto space-y-6">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">إجمالي المسجلين</span>
                  <div className="text-2xl font-bold text-slate-800 mt-0.5">{totalUsers}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <UserCheck size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">الحسابات النشطة</span>
                  <div className="text-2xl font-bold text-emerald-700 mt-0.5">{activeCount}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <UserX size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">الحسابات المحظورة</span>
                  <div className="text-2xl font-bold text-rose-700 mt-0.5">{blockedCount}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">المشرفون (Admins)</span>
                  <div className="text-2xl font-bold text-purple-700 mt-0.5">{adminCount}</div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                  className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === 'all'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الكل ({totalUsers})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === 'active'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  نشط ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter('blocked')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === 'blocked'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  محظور ({blockedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('admin')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === 'admin'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  المشرفون ({adminCount})
                </button>
              </div>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <RefreshCw size={28} className="animate-spin text-purple-600" />
                <span>جاري تحميل بيانات المستخدمين...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Users size={40} className="mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">لا يوجد مستخدمين مطابقين للبحث</p>
                <p className="text-xs text-slate-500 mt-1">جرّب تغيير كلمات البحث أو الفلاتر</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-100/75 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">المستخدم</th>
                      <th className="py-3.5 px-4">الدور الصلاحيات</th>
                      <th className="py-3.5 px-4">حالة الحساب</th>
                      <th className="py-3.5 px-4">تاريخ التسجيل</th>
                      <th className="py-3.5 px-4">آخر ظهور</th>
                      <th className="py-3.5 px-4 text-center">الإجراءات والتحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredUsers.map((user) => {
                      const isSelf = user.uid === currentUser?.uid;
                      const isUserAdmin = user.role === 'admin';
                      const isUserBlocked = user.status === 'blocked';

                      return (
                        <tr key={user.uid} className={`hover:bg-slate-50/80 transition-colors ${isUserBlocked ? 'bg-rose-50/20' : ''}`}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.displayName || 'Avatar'}
                                  className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                                  {(user.displayName || user.email)[0].toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                  <span>{user.displayName || 'مستخدم بدون اسم'}</span>
                                  {isSelf && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold">
                                      أنت
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 font-mono flex items-center gap-1" dir="ltr">
                                  <Mail size={12} className="text-slate-400" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isUserAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                <Shield size={12} />
                                مشرف (Admin)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                مستخدم عادي
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {isUserBlocked ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  <Lock size={12} />
                                  محظور
                                </span>
                                {user.blockedReason && (
                                  <p className="text-[11px] text-rose-600 mt-1 max-w-xs truncate" title={user.blockedReason}>
                                    السبب: {user.blockedReason}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle size={12} />
                                نشط ومفعل
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={13} className="text-slate-400" />
                              <span>{new Date(user.createdAt).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock size={13} className="text-slate-400" />
                              <span>{new Date(user.lastLoginAt).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {isSelf ? (
                              <span className="text-xs text-slate-400 italic">حسابك الحالي</span>
                            ) : (
                              <button
                                onClick={() => handleToggleStatus(user)}
                                disabled={actionInProgress === user.uid}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50 ${
                                  isUserBlocked
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {actionInProgress === user.uid ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : isUserBlocked ? (
                                  <>
                                    <Unlock size={14} />
                                    <span>إلغاء الحظر وتفعيل الحساب</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX size={14} />
                                    <span>حظر المستخدم</span>
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Confirmation Modal */}
      {blockModalUser && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">تأكيد حظر المستخدم</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  سيتم منع هذا المستخدم فوراً من استخدام مستخرج اللوحات وسيرى شاشة الحظر.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
              <span className="text-slate-500 text-xs block mb-1">المستخدم المستهدف:</span>
              <p className="font-semibold text-slate-800" dir="ltr">{blockModalUser.email}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                سبب الحظر (سيظهر للمستخدم):
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="اكتب سبب الحظر هنا..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBlockModalUser(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmBlock}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-rose-600/20"
              >
                تأكيد الحظر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
