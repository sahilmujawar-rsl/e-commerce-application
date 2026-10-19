export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(account) {
  const name = account.name?.trim() ?? ''
  const email = account.email?.trim() ?? ''
  const password = account.password ?? ''

  const errors = {}

  if (!name) {
    errors.name = 'Enter your name.'
  }

  if (!email) {
    errors.email = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Enter a password.'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return errors
}