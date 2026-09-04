import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { X, Check } from 'lucide-react';

const APPLE_COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#007AFF', // Blue
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#5AC8FA', // Teal
  '#A2845E', // Brown
  '#8E8E93', // Gray
  '#5856D6', // Indigo
  '#00C7BE'  // Cyan
];

const APPLE_ICONS = [
  'List', 'User', 'Briefcase', 'ShoppingBag', 'Heart', 
  'BookOpen', 'Home', 'Star', 'Gift', 'CheckSquare', 
  'Coffee', 'Dumbbell', 'Sparkles', 'Folder', 'Target', 'Zap'
];

export default function NewListModal({
  isOpen,
  onClose,
  listToEdit,
  onSaveList
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(APPLE_COLORS[4]); // Blue default
  const [icon, setIcon] = useState('List');

  useEffect(() => {
    if (listToEdit) {
      setName(listToEdit.name || '');
      setColor(listToEdit.color || APPLE_COLORS[4]);
      setIcon(listToEdit.icon || 'List');
    } else {
      setName('');
      setColor(APPLE_COLORS[4]);
      setIcon('List');
    }
  }, [listToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveList({
      id: listToEdit ? listToEdit.id : 'list-' + Date.now(),
      name: name.trim(),
      color,
      icon
    });

    onClose();
  };

  const PreviewIcon = Icons[icon] || Icons.List;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-2xl p-5 animate-slide-up flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:opacity-80"
          >
            Hủy
          </button>
          <h2 className="font-bold text-base text-[var(--text-primary)]">
            {listToEdit ? 'Sửa Danh Sách' : 'Danh Sách Mới'}
          </h2>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:opacity-80 disabled:opacity-40"
          >
            Xong
          </button>
        </div>

        {/* Live Badge Preview */}
        <div className="flex flex-col items-center justify-center my-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 scale-105"
            style={{ backgroundColor: color }}
          >
            <PreviewIcon className="w-8 h-8" />
          </div>
        </div>

        {/* List Name Input */}
        <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3 border border-[var(--border-color)]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên danh sách..."
            className="w-full bg-transparent font-bold text-center text-lg focus:outline-none placeholder:text-gray-400"
            autoFocus
          />
        </div>

        {/* Color Palette Selector */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5 px-1">
            Màu Sắc iOS
          </h4>
          <div className="grid grid-cols-6 gap-2.5">
            {APPLE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs"
                style={{ backgroundColor: c }}
              >
                {color === c && <Check className="w-5 h-5 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Selector */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5 px-1">
            Biểu Tượng (Icon)
          </h4>
          <div className="grid grid-cols-8 gap-2 bg-gray-100 dark:bg-zinc-800/60 p-3 rounded-2xl border border-[var(--border-color)]">
            {APPLE_ICONS.map((iconName) => {
              const IconComp = Icons[iconName] || Icons.List;
              const isSelected = icon === iconName;

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
