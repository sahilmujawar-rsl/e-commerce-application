import { useActionState, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../context/UserContext'
import './Registration.css'
import SubmitButton from './SubmitButton'
import UserDetails from './UserDetails'
import { validate } from './registrationValidation'

const emptyUser = { name: '', email: '', password: '' }
const initialSubmission = { success: false, errors: {}, formError: '' }

function submitRegistration(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.endsWith('@fail.test')) {
        reject(new Error('Registration could not be completed. Try again.'))
        return
      }
      resolve()
    }, 5000)
  })
}

export default function Registration() {
  const [user, setUser] = useState(emptyUser)
  const { addUser } = useContext(UserContext)

  function handleChange(event) {
    const { name, value } = event.target
    setUser((currentUser) => ({ ...currentUser, [name]: value }))
  }

  const [submission, formAction] = useActionState(
    async (_previousSubmission, formData) => {
      const account = {
        name: formData.get('name')?.trim() ?? '',
        email: formData.get('email')?.trim() ?? '',
        password: formData.get('password') ?? '',
      }
      const errors = validate(account)

      if (Object.keys(errors).length > 0) {
        console.warn('[registration] Validation failed.', Object.keys(errors))
        return { success: false, errors, formError: '' }
      }

      try {
        await submitRegistration(account.email)
      } catch (error) {
        console.error('Registration request failed.', error)
        return {
          success: false,
          errors: {},
          formError: error.message,
        }
      }

      addUser({ name: account.name, email: account.email })
      setUser(emptyUser)
      console.info('[registration] Registration completed.')
      return { success: true, errors: {}, formError: '' }
    },
    initialSubmission,
  )

  return (
    <>
      <title>Create an account | E-commerce Store</title>
      <meta
        name="description"
        content="Create an account to get started with our online store."
      />
      <main className="registration-page">
        <section
          className="registration-card"
          aria-labelledby="registration-title"
        >
          <h1 id="registration-title">Create your account</h1>
          <p className="registration-card__description">
            Enter your details to get started.
          </p>

          <form className="registration-form" action={formAction} noValidate>
            <label htmlFor="registration-name">Name</label>
            <input
              value={user.name}
              onChange={handleChange}
              aria-invalid={Boolean(submission.errors.name)}
              aria-describedby={
                submission.errors.name ? 'registration-name-error' : undefined
              }
              autoComplete="name"
              id="registration-name"
              name="name"
              placeholder="Your name"
              required
            />
            {submission.errors.name && (
              <p
                className="registration-form__error"
                id="registration-name-error"
                role="alert"
              >
                {submission.errors.name}
              </p>
            )}

            <label htmlFor="registration-email">Email</label>
            <input
              value={user.email}
              onChange={handleChange}
              aria-invalid={Boolean(submission.errors.email)}
              aria-describedby={
                submission.errors.email ? 'registration-email-error' : undefined
              }
              autoComplete="email"
              id="registration-email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
            {submission.errors.email && (
              <p
                className="registration-form__error"
                id="registration-email-error"
                role="alert"
              >
                {submission.errors.email}
              </p>
            )}

            <label htmlFor="registration-password">Password</label>
            <input
              value={user.password}
              onChange={handleChange}
              aria-invalid={Boolean(submission.errors.password)}
              aria-describedby={
                submission.errors.password
                  ? 'registration-password-error'
                  : undefined
              }
              autoComplete="new-password"
              id="registration-password"
              name="password"
              placeholder="At least 8 characters"
              required
              type="password"
              minLength={8}
            />
            {submission.errors.password && (
              <p
                className="registration-form__error"
                id="registration-password-error"
                role="alert"
              >
                {submission.errors.password}
              </p>
            )}

            <SubmitButton />
            {submission.formError && (
              <p className="registration-form__error" role="alert">
                {submission.formError}
              </p>
            )}
            {submission.success && (
              <p className="registration-form__success" role="status">
                Your account has been created.{' '}
                <Link to="/products">Browse products</Link>
              </p>
            )}
          </form>

          <UserDetails />
        </section>
      </main>
    </>
  )
}
