export const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);

  const formatted = date.toLocaleString('en-GB', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  });

  return formatted;
};
