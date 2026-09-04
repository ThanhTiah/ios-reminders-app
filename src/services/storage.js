import { format } from 'date-fns';

const STORAGE_KEYS = {
  LISTS: 'ios_reminders_lists_v1',
  TASKS: 'ios_reminders_tasks_v1',
  THEME: 'ios_reminders_theme_v1'
};

export const INITIAL_LISTS = [
  { id: 'list-personal', name: 'Cá nhân', icon: 'User', color: '#007AFF' },   // iOS Blue
  { id: 'list-work', name: 'Công việc', icon: 'Briefcase', color: '#FF9500' }, // iOS Orange
  { id: 'list-shopping', name: 'Mua sắm', icon: 'ShoppingBag', color: '#AF52DE' }, // iOS Purple
  { id: 'list-health', name: 'Sức khỏe', icon: 'Heart', color: '#FF2D55' },    // iOS Pink
  { id: 'list-study', name: 'Học tập', icon: 'BookOpen', color: '#34C759' }    // iOS Green
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    listId: 'list-personal',
    title: 'Khám phá ứng dụng Lời Nhắc mới trên Oppo Find X',
    notes: 'Ứng dụng tự làm theo chuẩn iOS 18, mượt mà và lưu dữ liệu offline 100%.',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '21:00',
    priority: 'high',
    flagged: true,
    completed: false,
    subtasks: [
      { id: 'sub-1', title: 'Thêm vào màn hình chính (Add to Home screen)', completed: true },
      { id: 'sub-2', title: 'Bật thông báo nhắc nhở', completed: false }
    ],
    tags: ['dùngthử', 'oppo']
  },
  {
    id: 'task-2',
    listId: 'list-work',
    title: 'Họp đánh giá tiến độ công việc tuần này',
    notes: 'Chuẩn bị slide báo cáo và danh sách hạng mục cần trao đổi.',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '09:30',
    priority: 'medium',
    flagged: false,
    completed: false,
    subtasks: [],
    tags: ['họp', 'côngviệc']
  },
  {
    id: 'task-3',
    listId: 'list-shopping',
    title: 'Đi siêu thị mua thực phẩm tuần',
    notes: 'Hoa quả tươi, sữa chua, cà phê espresso.',
    dueDate: null,
    dueTime: null,
    priority: 'low',
    flagged: true,
    completed: false,
    subtasks: [],
    tags: ['siêuthị']
  }
];

export function getStoredLists() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LISTS);
    return data ? JSON.parse(data) : INITIAL_LISTS;
  } catch (e) {
    console.error('Failed to load lists from localStorage', e);
    return INITIAL_LISTS;
  }
}

export function saveStoredLists(lists) {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
  } catch (e) {
    console.error('Failed to save lists to localStorage', e);
  }
}

export function getStoredTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : INITIAL_TASKS;
  } catch (e) {
    console.error('Failed to load tasks from localStorage', e);
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
}

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  } catch (e) {
    return 'dark';
  }
}

export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {}
}
