/**
 * Formats a date to a localized string
 */
export const formatDate = (date: Date | string | null): string => {
  if (!date) return 'Not set';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Formats a discount value based on the discount type
 */
export const formatDiscount = (
  discountType: 'percentage' | 'fixed' | 'bogo', 
  discountValue: number
): string => {
  switch (discountType) {
    case 'percentage':
      return `${discountValue}%`;
    case 'fixed':
      return `$${discountValue.toFixed(2)}`;
    case 'bogo':
      return 'Buy One Get One';
    default:
      return `${discountValue}`;
  }
};

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Formats a rule operator for display
 */
export const formatOperator = (operator: string): string => {
  return operator.toUpperCase();
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
}; 