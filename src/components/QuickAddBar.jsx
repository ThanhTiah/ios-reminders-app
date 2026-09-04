import React, { useState } from 'react';
import { Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { parseSmartInput } from '../utils/nlp';

export default function QuickAddBar({ onQuickAdd, onOpenDetailNew }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Use Smart NLP Parser
    const parsed = parseSmartInput(input);
    onQuickAdd({
      title: parsed.title,
      dueDate: parsed.dueDate,
      dueTime: parsed.dueTime
    });

    setInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 ios-glass border-t border-[var(--border-color)] shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 bg-gray-200/80 dark:bg-zinc-800/90 rounded-2xl px-3.5 py-2 border border-[var(--border-color)]">
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Lời nhắc mới (VD: 'Họp team 9h sáng mai')..."
            className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
          />
          {input.trim() && (
            <button
              type="submit"
              className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700 transition"
            >
              Thêm
            </button>
          )}
        </form>

        <button
          type="button"
          onClick={onOpenDetailNew}
          className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-95 transition shadow-sm shrink-0"
          title="Tạo lời nhắc đầy đủ chi tiết"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
