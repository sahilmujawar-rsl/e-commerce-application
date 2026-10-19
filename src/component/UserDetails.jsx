import { useContext } from 'react'
import UserContext from '../context/UserContext'
import './UserDetails.css'

export default function UserDetails() {
  const { users } = useContext(UserContext)
  const registeredUser = users[users.length - 1]

  if (!registeredUser) {
    return null
  }

  return (
    <section className="user-details" aria-labelledby="user-details-title">
      <h2 id="user-details-title">Registered account</h2>
      <dl className="user-details__list">
        <div className="user-details__row">
          <dt>Name</dt>
          <dd>{registeredUser.name}</dd>
        </div>
        <div className="user-details__row">
          <dt>Email</dt>
          <dd>{registeredUser.email}</dd>
        </div>
      </dl>
    </section>
  )
}