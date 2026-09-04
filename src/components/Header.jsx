import React from 'react';
import { Search, Moon, Sun, Plus, Smartphone, Sparkles } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  onOpenNewList,
  onOpenAppInfo
}) {
  return (
    <header className="sticky top-0 z-20 ios-glass px-4 py-3 border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {/* Top title & bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Lời Nhắc</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAppInfo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
              title="Cài đặt lên Oppo / Android"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Cài vào máy</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
              title="Đổi giao diện Sáng / Tối"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onOpenNewList}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm Danh Sách</span>
            </button>
          </div>
        </div>

        {/* Search input bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lời nhắc, ghi chú, #tag..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-200/70 dark:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-gray-400 dark:bg-zinc-600 text-white rounded-full w-4 h-4 flex items-center justify-center hover:opacity-80"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
