import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Flag, AlertCircle, Plus, Trash2, Tag, Repeat } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskDetailModal({
  isOpen,
  onClose,
  taskToEdit,
  lists,
  activeListId,
  onSaveTask
}) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [listId, setListId] = useState(activeListId || lists[0]?.id);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('none'); // none, low, medium, high
  const [flagged, setFlagged] = useState(false);
  const [repeat, setRepeat] = useState('none'); // none, daily, weekly, monthly
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagText, setNewTagText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setNotes(taskToEdit.notes || '');
      setListId(taskToEdit.listId || activeListId || lists[0]?.id);
      setDueDate(taskToEdit.dueDate || '');
      setDueTime(taskToEdit.dueTime || '');
      setPriority(taskToEdit.priority || 'none');
      setFlagged(taskToEdit.flagged || false);
      setRepeat(taskToEdit.repeat || 'none');
      setSubtasks(taskToEdit.subtasks || []);
      setTags(taskToEdit.tags || []);
    } else {
      setTitle('');
      setNotes('');
      setListId(activeListId && activeListId !== 'all' ? activeListId : lists[0]?.id);
      setDueDate(format(new Date(), 'yyyy-MM-dd'));
      setDueTime('09:00');
      setPriority('none');
      setFlagged(false);
      setRepeat('none');
      setSubtasks([]);
      setTags([]);
    }
  }, [taskToEdit, isOpen, activeListId, lists]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'sub-' + Date.now(), title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(
      subtasks.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = newTagText.trim().replace(/^#/, '');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTagText('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: taskToEdit ? taskToEdit.id : 'task-' + Date.now(),
      title: title.trim(),
      notes: notes.trim(),
      listId: listId || lists[0]?.id,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      priority,
      flagged,
      repeat,
      subtasks,
      tags,
      completed: taskToEdit ? taskToEdit.completed : false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full sm:max-w-lg bg-[var(--bg-card)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-color)] shadow-2xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:opacity-80"
          >
            Hủy
          </button>
          <h2 className="font-bold text-base text-[var(--text-primary)]">
            {taskToEdit ? 'Chi Tiết Lời Nhắc' : 'Lời Nhắc Mới'}
          </h2>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:opacity-80 disabled:opacity-40"
          >
            Xong
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-5 flex-1">
          {/* Title & Notes section */}
          <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-[var(--border-color)]">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề lời nhắc"
              className="w-full bg-transparent font-semibold text-base focus:outline-none placeholder:text-gray-400"
              autoFocus
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={3}
              className="w-full bg-transparent text-sm mt-2 focus:outline-none placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* List Selector */}
          <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-[var(--border-color)] flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-primary)]">Danh sách</span>
            <select
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer"
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id} className="dark:bg-zinc-800 dark:text-white">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Settings */}
          <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Ngày nhắc</span>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-blue-600 dark:text-blue-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Giờ nhắc</span>
              </div>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="bg-transparent text-sm font-semibold text-blue-600 dark:text-blue-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Lặp lại</span>
              </div>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="bg-transparent text-sm font-semibold text-blue-600 dark:text-blue-400 focus:outline-none"
              >
                <option value="none" className="dark:bg-zinc-800">Không lặp</option>
                <option value="daily" className="dark:bg-zinc-800">Hàng ngày</option>
                <option value="weekly" className="dark:bg-zinc-800">Hàng tuần</option>
                <option value="monthly" className="dark:bg-zinc-800">Hàng tháng</option>
              </select>
            </div>
          </div>

          {/* Priority & Flag */}
          <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Độ ưu tiên</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-200 dark:bg-zinc-700/80 p-1 rounded-xl">
                {[
                  { id: 'none', label: 'Không' },
                  { id: 'low', label: 'Thấp (!)' },
                  { id: 'medium', label: 'Vừa (!!)' },
                  { id: 'high', label: 'Cao (!!!)' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                      priority === p.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm font-medium text-[var(--text-primary)] font-medium">Đánh dấu cờ</span>
              </div>
              <button
                type="button"
                onClick={() => setFlagged(!flagged)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  flagged ? 'bg-amber-500' : 'bg-gray-300 dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                    flagged ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Danh sách việc phụ (Subtasks)
            </h4>

            {subtasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(sub.id)}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          sub.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-400'
                        }`}
                      >
                        {sub.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                      <span className={`text-sm ${sub.completed ? 'line-through text-gray-400' : ''}`}>
                        {sub.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Thêm việc phụ nhỏ..."
                className="flex-1 bg-[var(--bg-card)] text-sm px-3 py-2 rounded-xl border border-[var(--border-color)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-gray-100 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Thẻ Phân Loại (Tags)
            </h4>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-red-500">
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newTagText}
                onChange={(e) => setNewTagText(e.target.value)}
                placeholder="Thêm thẻ (ví dụ: work, home)..."
                className="flex-1 bg-[var(--bg-card)] text-sm px-3 py-2 rounded-xl border border-[var(--border-color)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-200 dark:bg-zinc-700 text-xs font-semibold rounded-xl hover:opacity-80"
              >
                Gắn Thẻ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
