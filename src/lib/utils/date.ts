// Date utility functions

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getWeekStart = (date: string | Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split("T")[0];
};

export const getWeekEnd = (date: string | Date): string => {
  const weekStart = getWeekStart(date);
  const weekStartDate = new Date(weekStart);
  const weekEnd = new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);
  return weekEnd.toISOString().split("T")[0];
};

export const getMonthStart = (date: string | Date): string => {
  const d = new Date(date);
  const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
  return monthStart.toISOString().split("T")[0];
};

export const getMonthEnd = (date: string | Date): string => {
  const d = new Date(date);
  const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return monthEnd.toISOString().split("T")[0];
};

export const addDays = (date: string | Date, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const isToday = (date: string | Date): boolean => {
  const today = new Date().toISOString().split("T")[0];
  const checkDate = new Date(date).toISOString().split("T")[0];
  return today === checkDate;
};

export const isThisWeek = (date: string | Date): boolean => {
  const weekStart = getWeekStart(new Date());
  const weekEnd = getWeekEnd(new Date());
  const checkDate = new Date(date).toISOString().split("T")[0];
  return checkDate >= weekStart && checkDate <= weekEnd;
};

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "hace un momento";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} día${days > 1 ? "s" : ""}`;
  } else {
    return formatDate(date);
  }
};
