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