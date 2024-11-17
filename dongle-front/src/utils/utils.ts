import { formatDistanceToNow, format } from "date-fns";

export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'L\'indirizzo email non può essere vuoto.'
  }
  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    return 'L\'indirizzo email non è valido.'
  }
  return null
}

export const formatBalance = (balance: string, decimals: number): string => {
  const value = parseFloat(balance) / Math.pow(10, decimals);
  return value.toFixed(value < 0.01 ? 8 : 4);
};

export const getErrorMessage = (error: any) => {
  // console.log('❌❌❌ getErrorMessage', error)

  if (error && (typeof error === 'string' || error instanceof String)) {
    return error
  } else if (error?.response?.data?.error?.message) {
    return error.response.data.error.message
  } else if (error?.response?.data?.error?.detail) {
    return error.response.data.error.detail
  } else if (error?.response?.data?.error) {
    return error.response.data.error
  } else if (error?.response?.data?.message) {
    return error.response.data.message
  } else if (error?.request?.statusText) {
    return error.request.statusText
  } else if (error?.request?.status) {
    return error.request.status
  } else if (error?.message) {
    return error.message
  } else {
    return "Server error"
  }
}


export const formatTimestampForMessages = (timestamp: number | string | Date, locale = 'en') => {
  const now = new Date();
  const date = new Date(timestamp);

  const distance = formatDistanceToNow(date, { addSuffix: true });

  const isMoreThanADay = now.getTime() - date.getTime() > 24 * 60 * 60 * 1000;

  if (isMoreThanADay) {
    const formattedDate = format(date, "PPpp");
    return `${distance} (${formattedDate})`;
  }

  return distance; // Mostra "5 minuti fa", "2 ore fa", ecc.
}

/**
 * Handles input changes for any other number value.
 * Validates and sanitizes the input, ensuring it's a valid number
 *
 * @param e - React change event from input field
 * @param setInput - Function to update input state
 */
export function handleNumberInputChange(e: React.ChangeEvent<HTMLInputElement>, setInput: (value: string) => void) {
  const { value } = e.target;

  // Allow numbers and one decimal point
  if (!/^[0-9]*[.,]?[0-9]*(\s+[0-9]*[.,]?[0-9]*)?$/.test(value)) return;

  const sanitizedValue = value.replace(/\s+/g, '').replace(',', '.');
  const numValue = parseFloat(sanitizedValue);

  if (sanitizedValue === '' || Number.isNaN(numValue)) {
    setInput('');
  } else {
    setInput(sanitizedValue);
  }
}
