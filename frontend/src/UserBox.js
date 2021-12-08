import AuthBox from './AuthBox'
import { useEffect, useState } from 'react'
import { userStatus } from './api'
import AuthenticatedBox from './AuthenticatedBox'

const AUTH_STATE_UNKNOWN = 0
const AUTH_STATE_AUTHENTICATED = 1
const AUTH_STATE_NOT_AUTHENTICATED = 2

const UserBox = () => {
  const [authState, setAuthState] = useState(AUTH_STATE_UNKNOWN)
  const [user, setUser] = useState(AUTH_STATE_UNKNOWN)

  useEffect(() => {
    if (authState === AUTH_STATE_UNKNOWN) {
      (async () => {
        try {
          setUser(await userStatus())
          setAuthState(AUTH_STATE_AUTHENTICATED)
        } catch (e) {
          setAuthState(AUTH_STATE_NOT_AUTHENTICATED)
        }
      })()
    }
  }, [authState])

  const reloadAuth = () => {
    setAuthState(AUTH_STATE_UNKNOWN)
  }

  return (
    <>
      {(authState === AUTH_STATE_UNKNOWN) && <div>Loading</div>}
      {(authState === AUTH_STATE_AUTHENTICATED) && <AuthenticatedBox reloadAuth={reloadAuth} user={user} />}
      {(authState === AUTH_STATE_NOT_AUTHENTICATED) && <AuthBox reloadAuth={reloadAuth} />}
    </>

  )
}

export default UserBox
