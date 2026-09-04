import React from 'react';
import { format, isToday, isTomorrow, isBefore, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Flag, Clock, Calendar, CheckSquare, Tag, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { soundFX } from '../utils/sound';

export default function ReminderItem({
  task,
  onToggleComplete,
  onToggleFlag,
  onEditTask,
  onDeleteTask,
  list
}) {
  const handleCheck = (e) => {
    e.stopPropagation();
    if (!task.completed) {
      soundFX.playComplete();
    } else {
      soundFX.playUncomplete();
    }
    onToggleComplete(task.id);
  };

  // Date formatting helper
  const getFormattedDate = () => {
    if (!task.dueDate) return null;
    const dateObj = new Date(task.dueDate);
    const today = startOfDay(new Date());

    if (isToday(dateObj)) return 'Hôm nay';
    if (isTomorrow(dateObj)) return 'Ngày mai';
    return format(dateObj, 'eee, dd/MM', { locale: vi });
  };

  const isOverdue = task.dueDate && isBefore(new Date(task.dueDate), startOfDay(new Date())) && !task.completed;

  // Subtasks progress
  const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

  return (
    <div
      onClick={() => onEditTask(task)}
      className={`group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        task.completed
          ? 'bg-[var(--bg-card)]/50 border-[var(--border-color)] opacity-60'
          : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-blue-500/30 hover:shadow-sm'
      }`}
    >
      {/* iOS Circular Checkbox */}
      <button
        onClick={handleCheck}
        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
          task.completed
            ? 'bg-blue-600 border-blue-600 text-white animate-ios-check'
            : 'border-gray-300 dark:border-zinc-600 hover:border-blue-500'
        }`}
      >
        {task.completed && (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        )}
      </button>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {/* Priority indicators */}
          {task.priority === 'high' && (
            <span className="text-red-500 font-bold text-xs">!!!</span>
          )}
          {task.priority === 'medium' && (
            <span className="text-amber-500 font-bold text-xs">!!</span>
          )}
          {task.priority === 'low' && (
            <span className="text-blue-500 font-bold text-xs">!</span>
          )}

          <h3
            className={`font-semibold text-sm leading-tight text-[var(--text-primary)] break-words ${
              task.completed ? 'line-through text-[var(--text-secondary)]' : ''
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Notes preview */}
        {task.notes && (
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {task.notes}
          </p>
        )}

        {/* Metadata badges (Date, Time, List, Subtasks, Tags) */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
          {/* Date & Time */}
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${
                isOverdue
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{getFormattedDate()}</span>
              {task.dueTime && (
                <>
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{task.dueTime}</span>
                </>
              )}
            </span>
          )}

          {/* List origin badge */}
          {list && (
            <span
              className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md text-white shadow-2xs"
              style={{ backgroundColor: list.color }}
            >
              {list.name}
            </span>
          )}

          {/* Subtask count */}
          {totalSubtasks > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-700 text-[var(--text-secondary)] font-medium">
              <CheckSquare className="w-3 h-3" />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </span>
          )}

          {/* Tags */}
          {task.tags && task.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-0.5 text-blue-500 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right actions: Flag toggle & delete */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFlag(task.id);
          }}
          className={`p-1.5 rounded-full transition ${
            task.flagged
              ? 'text-amber-500 bg-amber-500/10'
              : 'text-gray-300 dark:text-zinc-600 hover:text-amber-500'
          }`}
          title="Đánh dấu cờ"
        >
          <Flag className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task.id);
          }}
          className="p-1.5 rounded-full text-gray-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
          title="Xóa lời nhắc"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
