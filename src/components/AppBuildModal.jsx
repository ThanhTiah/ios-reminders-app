import React from 'react';
import { Smartphone, Download, CheckCircle, Globe, Share2, Sparkles, X } from 'lucide-react';

export default function AppBuildModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-2xl p-6 animate-slide-up space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-[var(--text-primary)]">
              Hướng Dẫn Sử Dụng Trực Tiếp Trên Oppo Find X
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: PWA (Recommended & Easiest) */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">
              Cách 1: Cài dạng PWA (Nhanh nhất - Không cần cài file APK)
            </h3>
          </div>
          <ol className="text-xs text-[var(--text-primary)] space-y-2 list-decimal list-inside pl-1 font-medium">
            <li>Mở địa chỉ địa phương này (hoặc IP máy tính) trên Chrome điện thoại Oppo.</li>
            <li>Bấm vào **nút Menu 3 chấm** góc phải trên Chrome (hoặc icon Chia sẻ).</li>
            <li>Chọn **"Thêm vào màn hình chính"** (Add to Home screen).</li>
            <li>App sẽ xuất hiện ngoài màn hình chính Oppo với Icon iOS Reminders mượt mà, chạy full màn hình không cần thanh địa chỉ trình duyệt!</li>
          </ol>
        </div>

        {/* Option 2: Native Android APK */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
              Cách 2: Build File Android APK (.apk)
            </h3>
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
            Dự án đã tích hợp sẵn thư viện **Capacitor Android**. Bạn chỉ cần chạy lệnh <code>npx cap open android</code> trong thư mục dự án để xuất ra file <code>.apk</code> cài vào máy ColorOS!
          </p>
        </div>

        {/* Storage notice */}
        <div className="flex items-start gap-2 bg-gray-100 dark:bg-zinc-800/60 p-3 rounded-2xl text-xs text-[var(--text-secondary)]">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Toàn bộ dữ liệu danh sách và lời nhắc của bạn được lưu <strong>Offline 100%</strong> trên máy điện thoại cá nhân, hoàn toàn riêng tư và không mất dữ liệu.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition text-sm"
        >
          Đã Hiểu & Đóng
        </button>
      </div>
    </div>
  );
}
