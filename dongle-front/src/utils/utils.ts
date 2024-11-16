import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale"; // Importa la lingua italiana (se necessario)

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


export const formatTimestampForMessages = (timestamp: number, locale = 'en') => {  
  const now = new Date();
  const date = new Date(timestamp);

  const distance = formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale === 'it' ? it : undefined, // Usa la lingua specificata
  });

  // Se il messaggio è di più di un giorno fa, mostra anche la data completa
  const isMoreThanADay = now.getTime() - date.getTime() > 24 * 60 * 60 * 1000;

  if (isMoreThanADay) {
    const formattedDate = format(date, "PPpp", {
      locale: locale === 'it' ? it : undefined,
    });
    return `${distance} (${formattedDate})`;
  }

  return distance; // Mostra "5 minuti fa", "2 ore fa", ecc.
}
