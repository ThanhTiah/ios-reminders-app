import { addDays, format, setHours, setMinutes } from 'date-fns';

/**
 * Natural Language Processor for Quick Add (Vietnamese & English support)
 */
export function parseSmartInput(input) {
  if (!input || !input.trim()) {
    return { title: '', dueDate: null, dueTime: null };
  }

  let text = input.trim();
  let dueDate = null;
  let dueTime = null;
  const now = new Date();

  // Check date keywords
  if (/hôm nay|today/i.test(text)) {
    dueDate = format(now, 'yyyy-MM-dd');
    text = text.replace(/hôm nay|today/gi, '');
  } else if (/ngày mai|sáng mai|chiều mai|tối mai|tomorrow/i.test(text)) {
    dueDate = format(addDays(now, 1), 'yyyy-MM-dd');
    if (/sáng mai/i.test(text) && !dueTime) dueTime = '08:00';
    if (/chiều mai/i.test(text) && !dueTime) dueTime = '14:00';
    if (/tối mai/i.test(text) && !dueTime) dueTime = '20:00';
    text = text.replace(/ngày mai|sáng mai|chiều mai|tối mai|tomorrow/gi, '');
  } else if (/ngày kia|mốt/i.test(text)) {
    dueDate = format(addDays(now, 2), 'yyyy-MM-dd');
    text = text.replace(/ngày kia|mốt/gi, '');
  }

  // Check time formats: e.g., "9h30", "9h", "14h", "9:30", "8h sáng", "5h chiều", "8pm", "9am"
  const timeRegex = /(\d{1,2})(?:h|:)?(\d{2})?\s*(sáng|trưa|chiều|tối|am|pm)?/i;
  const matchTime = text.match(timeRegex);

  if (matchTime && !dueTime) {
    let hour = parseInt(matchTime[1], 10);
    let minute = matchTime[2] ? parseInt(matchTime[2], 10) : 0;
    const period = matchTime[3] ? matchTime[3].toLowerCase() : '';

    if (hour >= 0 && hour <= 24) {
      if ((period === 'chiều' || period === 'tối' || period === 'pm') && hour < 12) {
        hour += 12;
      } else if (period === 'trưa' && hour === 12) {
        hour = 12;
      } else if ((period === 'sáng' || period === 'am') && hour === 12) {
        hour = 0;
      }

      dueTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      text = text.replace(matchTime[0], '');
      if (!dueDate) {
        dueDate = format(now, 'yyyy-MM-dd');
      }
    }
  }

  // Clean title
  const cleanTitle = text.replace(/\s+/g, ' ').trim();

  return {
    title: cleanTitle || input,
    dueDate,
    dueTime
  };
}
