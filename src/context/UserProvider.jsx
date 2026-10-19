import { useState } from 'react'
import UserContext from './UserContext'

export default function UserProvider({ children }) {
  const [users, setUsers] = useState([])

  const addUser = (user) => {
    setUsers((currentUsers) => [...currentUsers, user])
  }

  return (
    <UserContext value={{ users, addUser }}>
      {children}
    </UserContext>
  )
}
