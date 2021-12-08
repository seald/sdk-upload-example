import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import RegisterIcon from '@mui/icons-material/GetApp'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import useHash from './useHash'
import { useDropzone } from 'react-dropzone'
import { useCallback, useContext, useState } from 'react'
import { Alert, Paper } from '@mui/material'
import Button from '@mui/material/Button'
import { uploadCreate, uploadFinalize, uploadUploadPart } from './api'
import { SnackBarContext } from './Snack'
import { anonymousSDK } from './seald'

const MAX_FILES = 10
const UPLOAD_STATE_NOTSTARTED = 0
const UPLOAD_STATE_UPLOAD = 1
const UPLOAD_STATE_FINISHED = 2

const DragAndDropBox = ({ user }) => {
  const [state, setState] = useState(UPLOAD_STATE_NOTSTARTED)
  const [files, setFiles] = useState([])
  const [email, setEmail] = useHash()
  const snack = useContext(SnackBarContext)
  const onDrop = useCallback(acceptedFiles => {
    if (files.length >= MAX_FILES) {
      return undefined
    } else if (files.length + acceptedFiles.length >= MAX_FILES) {
      setFiles([...files, ...acceptedFiles.slice(0, MAX_FILES - files.length)])
    } else {
      setFiles([...files, ...acceptedFiles])
    }
  }, [files, setFiles])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const upload = async () => {
    try {
      setState(UPLOAD_STATE_UPLOAD)
      for (const f of files) {
        const createUploadResponse = await uploadCreate(email.replace('#', ''), f.name)
        const session = createUploadResponse.upload.session
        const { encryptedFile } = await anonymousSDK.encrypt({
          encryptionToken: createUploadResponse.encryption_token,
          sealdIds: [user.seald_id],
          clearFile: f,
          filename: f.name
        })
        const reader = encryptedFile.stream().getReader()
        let done = false
        let buffer = new Uint8Array(0)
        let part = 0
        while (!done) {
          const data = await reader.read()
          if (data.value) {
            const newBuffer = new Uint8Array(buffer.length + data.value.length)
            newBuffer.set(buffer)
            newBuffer.set(data.value, buffer.length)
            buffer = newBuffer
            if (buffer.length > 5 * 1024 * 1024) {
              await uploadUploadPart(session, part++, buffer)
              buffer = new Uint8Array(0)
            }
          }
          done = data.done
        }
        if (buffer.length > 0) {
          await uploadUploadPart(session, part++, buffer)
        }
        await uploadFinalize(session)
      }
      setState(UPLOAD_STATE_FINISHED)
      snack('success', 'Success')
      setFiles([])
    } catch (e) {
      console.log(e)
      if (e.status) {
        snack('error', (await e.json()).detail)
      } else {
        snack('error', 'Something went wrong')
      }
    } finally {
      setState(UPLOAD_STATE_FINISHED)
    }
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
        <RegisterIcon />
      </Avatar>

      <Typography component='h1' variant='h5'>
        Send a file to {user.email}
      </Typography>
      <Paper
        elevation={3} {...getRootProps()}
        sx={{
          alignItems: 'center',
          width: '100%',
          margin: 4
        }}
      >
        <input {...getInputProps()} />
        {
          isDragActive
            ? <p>Drop the files here ...</p>
            : <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </Paper>
      {
        files.length >= MAX_FILES &&
          <Alert severity='warning'>Maximum file number reached !</Alert>
      }
      <ul>
        {files.map((f, i) => (
          <ul key={i}>
            {f.name}
          </ul>
        ))}
      </ul>
      <Button
        fullWidth
        variant='contained'
        onClick={upload}
        sx={{ mt: 3, mb: 2 }}
        disabled={files.length === 0 || state !== UPLOAD_STATE_NOTSTARTED}
      >
        Send
      </Button>
      <Grid container>
        <Grid item>
          <Link onClick={() => { setEmail('') }} href='#' variant='body2'>
            Send to someone else
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DragAndDropBox
