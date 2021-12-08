import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LoginIcon from '@mui/icons-material/Login'
import RegisterIcon from '@mui/icons-material/GetApp'
import Typography from '@mui/material/Typography'
import { useContext, useState } from 'react'
import { userCreate, userLogin, userUpdateSealdId } from './api'
import { SnackBarContext } from './Snack'
import { sealdInitiateIdentity, sealdRetrieveIdentity } from './seald'

export default function AuthBox ({ reloadAuth }) {
  const [signIn, setSignIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const snack = useContext(SnackBarContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setLoading(true)
    try {
      if (signIn) {
        const loginResponse = await userLogin(
          data.get('email'),
          data.get('password')
        )
        await sealdRetrieveIdentity(loginResponse.user.id.toString(), data.get('password'))
      } else {
        const createResponse = await userCreate(
          data.get('email'),
          data.get('password')
        )
        const sealdId = await sealdInitiateIdentity(
          createResponse.user.id.toString(),
          createResponse.seald_user_license_token,
          data.get('password')
        )
        await userLogin(
          data.get('email'),
          data.get('password')
        )
        await userUpdateSealdId(sealdId)
      }
      snack('success', 'Logged in')
      reloadAuth()
    } catch (e) {
      console.log(e)
      if (e.status) {
        snack('error', (await e.json()).detail)
      } else {
        snack('error', 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
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
        {signIn ? <LoginIcon /> : <RegisterIcon />}
      </Avatar>
      <Typography component='h1' variant='h5'>
        {
          signIn
            ? 'Check files sent to you ?'
            : 'Want people to send file to you ?'
        }
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          autoComplete='email'
          autoFocus
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          autoComplete='current-password'
        />
        {
          !signIn &&
            <TextField
              margin='normal'
              required
              fullWidth
              name='password_confirm'
              label='Confirm password'
              type='password'
              id='password_confirm'
            />
        }
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {signIn ? 'Sign In' : 'Sign Up'}
        </Button>
        <Grid container>
          <Grid item>
            <Link onClick={() => { !loading && setSignIn(!signIn) }} href='#' variant='body2'>
              {signIn ? 'Don\'t have an account? Sign Up' : 'Already have an account ? Sign In'}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
