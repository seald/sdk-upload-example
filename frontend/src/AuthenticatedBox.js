import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import UserIcon from '@mui/icons-material/AccountBox'
import LogoutIcon from '@mui/icons-material/Logout'
import RefreshIcon from '@mui/icons-material/Refresh'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { uploadList, userLogout } from './api'
import { List } from '@mui/material'
import CopyIcon from '@mui/icons-material/ContentCopy'
import { useContext, useEffect, useState } from 'react'
import { SnackBarContext } from './Snack'
import FileItem from './FileItem'
import { resetSeald } from './seald'

export default function AuthenticatedBox ({ reloadAuth, user }) {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const snack = useContext(SnackBarContext)
  const url = `${window.location.href.split('#')[0]}#${user.user.email}`
  useEffect(() => {
    if (loading) {
      (async () => {
        setUploads((await uploadList()).uploads)
        setLoading(false)
      })()
    }
  }, [loading, setUploads, setLoading])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      snack('success', 'Link copied to clipboard')
    } catch (e) {
      snack('error', 'Something went wrong')
    }
  }
  const logout = async () => {
    try {
      await userLogout()
      resetSeald()
    } catch (e) {

    }
    reloadAuth()
  }
  return (
    <Box
      sx={{
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%'
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <UserIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        {user.user.email}
        <Button
          startIcon={<LogoutIcon />}
          onClick={logout}
        />
      </Typography>
      {url}
      <Button
        startIcon={<CopyIcon />}
        onClick={copyLink}
      />
      <Typography component='h2' variant='h6'>
        My files
        <Button
          startIcon={<RefreshIcon />}
          onClick={logout}
        />
      </Typography>
      <List>
        {uploads.map((upload) => (
          <FileItem key={upload.id} upload={upload} />
        ))}
      </List>
    </Box>
  )
}
