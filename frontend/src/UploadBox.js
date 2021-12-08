import SearchUser from './SearchUser'
import { useContext, useEffect, useState } from 'react'
import { userFind } from './api'
import { SnackBarContext } from './Snack'
import useHash from './useHash'
import DragAndDropBox from './DragAndDropBox'

const UploadBox = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const snack = useContext(SnackBarContext)
  const [email, setEmail] = useHash()

  useEffect(() => {
    if (!email) return
    (async () => {
      try {
        setLoading(true)
        const response = await userFind(email.replace('#', ''))
        setUser(response.user)
      } catch (e) {
        console.log(e)
        snack('error', 'Something went wrong')
        setEmail('')
      } finally {
        setLoading(false)
      }
    })()
  }, [email])
  if (loading) {
    return <div>Loading</div>
  }
  if (!email) {
    return <SearchUser />
  }
  return <DragAndDropBox user={user} />
}

export default UploadBox
