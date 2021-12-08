import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import UploadIcon from '@mui/icons-material/CloudUpload'
import Typography from '@mui/material/Typography'
import useHash from './useHash'

const SearchUser = () => {
  const [, setEmail] = useHash()

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setEmail(data.get('email'))
  }

  return (
    <Box
      sx={{
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '70%'
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <UploadIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Upload a file to someone you know !
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          autoFocus
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Search user
        </Button>
      </Box>
    </Box>
  )
}

export default SearchUser
