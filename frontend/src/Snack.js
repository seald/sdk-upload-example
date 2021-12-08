import { createContext, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

const SnackBarContext = createContext(() => {})

const SnackBarWrapper = (props) => {
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackData, setSnackData] = useState(['success', 'success'])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackOpen(false)
  }

  const snack = (severity, message) => {
    setSnackData([severity, message])
    setSnackOpen(true)
  }

  return (
    <SnackBarContext.Provider value={snack}>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackData[0]} sx={{ width: '100%' }}>
          {snackData[1]}
        </Alert>
      </Snackbar>
      {props.children}
    </SnackBarContext.Provider>
  )
}

export { SnackBarContext, SnackBarWrapper }
