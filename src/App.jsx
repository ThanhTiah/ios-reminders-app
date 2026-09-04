import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { isToday, isTomorrow, isAfter, startOfDay, parseISO } from 'date-fns';

// Services & Utilities
import {
  getStoredLists,
  saveStoredLists,
  getStoredTasks,
  saveStoredTasks,
  getStoredTheme,
  saveStoredTheme
} from './services/storage';
import { notificationEngine } from './services/notifications';

// Components
import Header from './components/Header';
import SmartCards from './components/SmartCards';
import CustomLists from './components/CustomLists';
import ReminderItem from './components/ReminderItem';
import TaskDetailModal from './components/TaskDetailModal';
import NewListModal from './components/NewListModal';
import QuickAddBar from './components/QuickAddBar';
import AppBuildModal from './components/AppBuildModal';

import { Plus, ListFilter, Calendar, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => getStoredTheme());

  // Data state
  const [lists, setLists] = useState(() => getStoredLists());
  const [tasks, setTasks] = useState(() => getStoredTasks());

  // Navigation & Filtering state
  const [activeFilter, setActiveFilter] = useState('today'); // 'today', 'scheduled', 'all', 'flagged', 'completed', 'custom'
  const [selectedListId, setSelectedListId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState(null);

  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);

  // Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  // Request Notification permission on launch
  useEffect(() => {
    notificationEngine.requestPermission();
  }, []);

  // Save tasks to local storage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Save lists to local storage
  useEffect(() => {
    saveStoredLists(lists);
  }, [lists]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Smart List Counts
  const counts = useMemo(() => {
    const today = startOfDay(new Date());

    const todayCount = tasks.filter(t => !t.completed && t.dueDate && isToday(parseISO(t.dueDate))).length;
    const scheduledCount = tasks.filter(t => !t.completed && t.dueDate).length;
    const allCount = tasks.filter(t => !t.completed).length;
    const flaggedCount = tasks.filter(t => !t.completed && t.flagged).length;
    const completedCount = tasks.filter(t => t.completed).length;

    return {
      today: todayCount,
      scheduled: scheduledCount,
      all: allCount,
      flagged: flaggedCount,
      completed: completedCount
    };
  }, [tasks]);

  // Custom List counts
  const taskCountsByList = useMemo(() => {
    const map = {};
    lists.forEach(l => {
      map[l.id] = tasks.filter(t => t.listId === l.id && !t.completed).length;
    });
    return map;
  }, [lists, tasks]);

  // Filter Tasks based on active filter or search query
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Category Filter
    if (activeFilter === 'today') {
      result = result.filter(t => !t.completed && t.dueDate && isToday(parseISO(t.dueDate)));
    } else if (activeFilter === 'scheduled') {
      result = result.filter(t => !t.completed && t.dueDate);
    } else if (activeFilter === 'all') {
      result = result.filter(t => !t.completed);
    } else if (activeFilter === 'flagged') {
      result = result.filter(t => !t.completed && t.flagged);
    } else if (activeFilter === 'completed') {
      result = result.filter(t => t.completed);
    } else if (activeFilter === 'custom' && selectedListId) {
      result = result.filter(t => t.listId === selectedListId && !t.completed);
    }

    return result;
  }, [tasks, activeFilter, selectedListId, searchQuery]);

  // Task Actions
  const handleToggleComplete = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            // Trigger confetti celebration if completing last task in list
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.8 }
            });
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleToggleFlag = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, flagged: !t.flagged } : t))
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSaveTask = (taskData) => {
    setTasks(prev => {
      const exists = prev.some(t => t.id === taskData.id);
      if (exists) {
        return prev.map(t => (t.id === taskData.id ? taskData : t));
      } else {
        return [taskData, ...prev];
      }
    });

    // Schedule notification if time is set
    if (taskData.dueDate && taskData.dueTime) {
      notificationEngine.sendNotification(`Lời nhắn: ${taskData.title}`, {
        body: taskData.notes || 'Đã đến giờ nhắc nhở!'
      });
    }
  };

  const handleQuickAdd = ({ title, dueDate, dueTime }) => {
    const targetListId = selectedListId || lists[0]?.id;
    const newTask = {
      id: 'task-' + Date.now(),
      listId: targetListId,
      title,
      notes: '',
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      priority: 'none',
      flagged: false,
      repeat: 'none',
      completed: false,
      subtasks: [],
      tags: []
    };
    handleSaveTask(newTask);
  };

  // List Actions
  const handleSaveList = (listData) => {
    setLists(prev => {
      const exists = prev.some(l => l.id === listData.id);
      if (exists) {
        return prev.map(l => (l.id === listData.id ? listData : l));
      } else {
        return [...prev, listData];
      }
    });
  };

  const handleDeleteList = (listId) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    setTasks(prev => prev.filter(t => t.listId !== listId));
    if (selectedListId === listId) {
      setActiveFilter('today');
      setSelectedListId(null);
    }
  };

  // Active Title helper
  const getHeaderTitle = () => {
    if (searchQuery) return `Kết quả tìm kiếm "${searchQuery}"`;
    if (activeFilter === 'today') return 'Hôm Nay';
    if (activeFilter === 'scheduled') return 'Đã Lên Lịch';
    if (activeFilter === 'all') return 'Tất Cả';
    if (activeFilter === 'flagged') return 'Đã Đánh Dấu';
    if (activeFilter === 'completed') return 'Đã Hoàn Thành';
    if (activeFilter === 'custom' && selectedListId) {
      const current = lists.find(l => l.id === selectedListId);
      return current ? current.name : 'Danh Sách';
    }
    return 'Lời Nhắc';
  };

  const selectedListObj = lists.find(l => l.id === selectedListId);

  return (
    <div className="min-h-screen pb-24 transition-colors">
      {/* Top sticky bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenNewList={() => {
          setListToEdit(null);
          setIsListModalOpen(true);
        }}
        onOpenAppInfo={() => setIsAppInfoOpen(true)}
      />

      <main className="max-w-3xl mx-auto px-4 pt-4">
        {/* iOS 18 Smart Cards Grid */}
        {!searchQuery && (
          <SmartCards
            activeFilter={activeFilter}
            setActiveFilter={(id) => {
              setActiveFilter(id);
              setSelectedListId(null);
            }}
            counts={counts}
          />
        )}

        {/* Custom Lists Section */}
        {!searchQuery && (
          <CustomLists
            lists={lists}
            activeFilter={activeFilter}
            selectedListId={selectedListId}
            onSelectList={(id) => {
              setActiveFilter('custom');
              setSelectedListId(id);
            }}
            taskCountsByList={taskCountsByList}
            onEditList={(list) => {
              setListToEdit(list);
              setIsListModalOpen(true);
            }}
            onDeleteList={handleDeleteList}
          />
        )}

        {/* Main Task List Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2
              className="text-xl font-black tracking-tight"
              style={{ color: selectedListObj && activeFilter === 'custom' ? selectedListObj.color : 'inherit' }}
            >
              {getHeaderTitle()}
            </h2>
            <span className="text-sm font-bold text-[var(--text-secondary)] bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {filteredTasks.length}
            </span>
          </div>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-80"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lời Nhắc</span>
          </button>
        </div>

        {/* Task Items List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const listObj = lists.find(l => l.id === task.listId);
              return (
                <ReminderItem
                  key={task.id}
                  task={task}
                  list={activeFilter !== 'custom' ? listObj : null}
                  onToggleComplete={handleToggleComplete}
                  onToggleFlag={handleToggleFlag}
                  onEditTask={(t) => {
                    setTaskToEdit(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDeleteTask={handleDeleteTask}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
            <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">
              Không có lời nhắc nào trong mục này
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Gõ vào ô bên dưới để tạo lời nhắc nhanh bằng giọng văn tự nhiên!
            </p>
          </div>
        )}
      </main>

      {/* Floating Quick Add Bar */}
      <QuickAddBar
        onQuickAdd={handleQuickAdd}
        onOpenDetailNew={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
      />

      {/* Modals */}
      <TaskDetailModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        lists={lists}
        activeListId={selectedListId}
        onSaveTask={handleSaveTask}
      />

      <NewListModal
        isOpen={isListModalOpen}
        onClose={() => {
          setIsListModalOpen(false);
          setListToEdit(null);
        }}
        listToEdit={listToEdit}
        onSaveList={handleSaveList}
      />

      <AppBuildModal
        isOpen={isAppInfoOpen}
        onClose={() => setIsAppInfoOpen(false)}
      />
    </div>
  );
}
