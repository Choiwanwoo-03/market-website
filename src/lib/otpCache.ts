interface OTPEntry {
  code: string
  expiresAt: number
}

const otpCache = new Map<string, OTPEntry>()

export function setOTP(email: string, code: string): void {
  otpCache.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  })
}

export function verifyOTP(email: string, code: string): boolean {
  const entry = otpCache.get(email.toLowerCase())
  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    otpCache.delete(email.toLowerCase())
    return false
  }
  if (entry.code !== code) return false
  otpCache.delete(email.toLowerCase())
  return true
}