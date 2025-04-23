// Format dates consistently across the application
export const formatDate = (dateString: string | Date | undefined, includeDay = false): string => {
  if (!dateString) return "-";
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    ...(includeDay && { day: 'numeric' })
  };
  
  return date.toLocaleDateString('id-ID', options);
};

// Format currency values consistently
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return "0";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Get current formatted date with day
export const getCurrentDate = (): string => {
  return formatDate(new Date(), true);
};