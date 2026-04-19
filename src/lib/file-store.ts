// Stores actual file content as base64 in localStorage
// Key format: zaid_files_{requestId}_{filename}
// Admin files: zaid_admin_{requestId}_{filename}

const USER_PREFIX = 'zaid_files_'
const ADMIN_PREFIX = 'zaid_admin_'

function fileKey(prefix: string, reqId: string, filename: string) {
  return `${prefix}${reqId}_${filename}`
}

export function storeUserFile(reqId: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        localStorage.setItem(fileKey(USER_PREFIX, reqId, file.name), reader.result as string)
      } catch (e) { console.warn('File storage full', e) }
      resolve()
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getUserFile(reqId: string, filename: string): string | null {
  return localStorage.getItem(fileKey(USER_PREFIX, reqId, filename))
}

export function storeAdminFile(reqId: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        localStorage.setItem(fileKey(ADMIN_PREFIX, reqId, file.name), reader.result as string)
      } catch (e) { console.warn('File storage full', e) }
      resolve()
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getAdminFile(reqId: string, filename: string): string | null {
  return localStorage.getItem(fileKey(ADMIN_PREFIX, reqId, filename))
}

export function downloadFile(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
