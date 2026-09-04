import React from 'react';
import * as Icons from 'lucide-react';
import { ChevronRight, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';

export default function CustomLists({
  lists,
  activeFilter,
  selectedListId,
  onSelectList,
  taskCountsByList,
  onEditList,
  onDeleteList
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Danh Sách Của Tôi
        </h2>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden divide-y divide-[var(--border-color)] shadow-sm">
        {lists.map((list) => {
          const IconComponent = Icons[list.icon] || Icons.List;
          const isSelected = activeFilter === 'custom' && selectedListId === list.id;
          const taskCount = taskCountsByList[list.id] || 0;

          return (
            <div
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`flex items-center justify-between p-3.5 cursor-pointer transition ${
                isSelected
                  ? 'bg-blue-500/10 dark:bg-blue-500/20'
                  : 'hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                  style={{ backgroundColor: list.color }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  {list.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                  {taskCount}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditList(list);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full text-gray-400 hover:text-blue-500 transition"
                    title="Chỉnh sửa danh sách"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {lists.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteList(list.id);
                      }}
                      className="p-1 hover:bg-red-500/10 rounded-full text-gray-400 hover:text-red-500 transition"
                      title="Xóa danh sách"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
