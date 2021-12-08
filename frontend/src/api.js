const getCookie = (name) => {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

const custoFetch = async (url, method = 'GET', data = undefined) => {
  const csrftoken = getCookie('csrftoken')
  const csrfHeader = csrftoken ? { 'X-CSRFToken': getCookie('csrftoken') } : {}
  const body = data
    ? {
        body: JSON.stringify(data)
      }
    : {}
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...csrfHeader
    },
    ...body
  })
  if (!response.ok) {
    throw response
  }
  return response.json()
}

const userCreate = async (email, password) => {
  const data = {
    email: email,
    password: password
  }
  return custoFetch('/api/users/', 'POST', data)
}

const userLogin = async (email, password) => {
  const data = {
    email,
    password
  }
  return custoFetch('/api/users/login/', 'POST', data)
}

const userStatus = async () => {
  return custoFetch('/api/users/status/')
}

const userLogout = async () => {
  return custoFetch('/api/users/logout/', 'POST')
}

const userFind = async (email) => {
  return custoFetch('/api/users/find/', 'POST', { email })
}

const userUpdateSealdId = async (sealdId) => {
  return custoFetch('/api/users/update_seald_id/', 'POST', { seald_id: sealdId })
}

const uploadCreate = async (email, filename) => {
  return custoFetch('/api/uploads/', 'POST', { email, filename })
}

const uploadUploadPart = async (session, part, dataUint8Array) => {
  const data = Buffer.from(dataUint8Array).toString('base64')
  return custoFetch('/api/uploads/upload_part/', 'POST', { session, part, data })
}

const uploadFinalize = async (session) => {
  return custoFetch('/api/uploads/finalize/', 'POST', { session })
}

const uploadList = async () => {
  return custoFetch('/api/uploads/')
}

export {
  userCreate, userLogin, userStatus, userLogout, userFind, userUpdateSealdId,
  uploadCreate, uploadUploadPart, uploadFinalize, uploadList
}
