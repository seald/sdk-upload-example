import SealdSDK from '@seald-io/sdk-web'
import SealdSDKPluginSSKSPassword from '@seald-io/sdk-plugin-ssks-password'
import AnonymousSDKBuilder from '@seald-io/sdk-web/lib/anonymous-sdk'

const appId = process.env.REACT_APP_SEALD_APP_ID

const newSeald = () => (
  SealdSDK({ appId, plugins: [SealdSDKPluginSSKSPassword()] })
)

let seald = newSeald()

const anonymousSDK = AnonymousSDKBuilder({})

const sealdInitiateIdentity = async (userId, userLicenseToken, password) => {
  await seald.initialize()
  await seald.initiateIdentity({ userId, userLicenseToken })
  await seald.ssksPassword.saveIdentity({ userId, password })
  return (await seald.getCurrentAccountInfo()).sealdId
}

const sealdRetrieveIdentity = async (userId, password) => {
  await seald.initialize()
  await seald.ssksPassword.retrieveIdentity({ userId, password })
}

const sealdDecryptFile = async (file) => {
  return await seald.decryptFile(file)
}

const resetSeald = () => {
  seald = newSeald()
}

export {
  sealdInitiateIdentity, sealdRetrieveIdentity, sealdDecryptFile, resetSeald,
  anonymousSDK
}
