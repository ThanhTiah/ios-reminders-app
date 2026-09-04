import React from 'react';
import { Calendar, CalendarDays, Inbox, Flag, CheckCircle2 } from 'lucide-react';

export default function SmartCards({ activeFilter, setActiveFilter, counts }) {
  const cards = [
    {
      id: 'today',
      title: 'Hôm nay',
      count: counts.today,
      icon: Calendar,
      colorBg: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      id: 'scheduled',
      title: 'Đã lên lịch',
      count: counts.scheduled,
      icon: CalendarDays,
      colorBg: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      id: 'all',
      title: 'Tất cả',
      count: counts.all,
      icon: Inbox,
      colorBg: 'bg-gray-600 dark:bg-zinc-500',
      textColor: 'text-gray-600 dark:text-zinc-400'
    },
    {
      id: 'flagged',
      title: 'Đã đánh dấu',
      count: counts.flagged,
      icon: Flag,
      colorBg: 'bg-amber-500',
      textColor: 'text-amber-500'
    },
    {
      id: 'completed',
      title: 'Đã xong',
      count: counts.completed,
      icon: CheckCircle2,
      colorBg: 'bg-emerald-500',
      textColor: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => setActiveFilter(card.id)}
            className={`p-3.5 rounded-2xl flex flex-col justify-between h-24 transition-all duration-200 text-left relative overflow-hidden ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/50 scale-[1.02]'
                : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  isActive ? 'bg-white/20' : card.colorBg
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span
                className={`text-2xl font-black tracking-tight ${
                  isActive ? 'text-white' : 'text-[var(--text-primary)]'
                }`}
              >
                {card.count}
              </span>
            </div>

            <span
              className={`text-xs font-semibold tracking-wide ${
                isActive ? 'text-white/90' : 'text-[var(--text-secondary)]'
              }`}
            >
              {card.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
