import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import FileIcon from '@mui/icons-material/InsertDriveFile'
import { useContext, useState } from 'react'
import { SnackBarContext } from './Snack'
import { sealdDecryptFile } from './seald'

const FileItem = ({ upload }) => {
  const [loading, setLoading] = useState(false)
  const snack = useContext(SnackBarContext)

  const download = async () => {
    setLoading(true)
    try {
      const downloadBlob = await fetch(upload.url)
      const decryptedStream = await sealdDecryptFile(await downloadBlob.blob())
      const url = window.URL.createObjectURL(decryptedStream)
      const a = document.createElement('a')
      a.style = 'display: none'
      a.href = url
      a.download = upload.filename
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.log(e)
      snack('error', 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <ListItemButton onClick={download} disabled={loading}>
      <ListItemIcon>
        <FileIcon />
      </ListItemIcon>
      <ListItemText primary={upload.filename} />
    </ListItemButton>
  )
}

export default FileItem
