import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import UploadBox from './UploadBox'
import UserBox from './UserBox'
import { SnackBarWrapper } from './Snack'

const App = () => {
  return (
    <SnackBarWrapper>
      <Container component='main' maxWidth='lg'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <UploadBox />
          <UserBox />
        </Box>
      </Container>
    </SnackBarWrapper>
  )
}

export default App
