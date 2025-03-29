// src/utils/dateUtils.js

export function parseDisplayDate(displayDate) {
  if (!displayDate) return null;
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const [month, day] = displayDate.split(" ");
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) return null;

  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthIndex, parseInt(day, 10), 0, 0, 0); // Local time
}

export function normalizeDate(date) {
  if (!date) return null;
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function isTomorrow(date) {
  const today = normalizeDate(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const inputDate = normalizeDate(date);
  return isSameDay(inputDate, tomorrow);
}

// dateUtils.js
export function formatCourseDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  const formatter = new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(date);
  let month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;

  // Capitaliza la primera letra del mes
  month = month.charAt(0).toUpperCase() + month.slice(1);

  return `${month} ${day}`;
}