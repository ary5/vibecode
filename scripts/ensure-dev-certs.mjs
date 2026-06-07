import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'

const mkcertDir = join(homedir(), '.vite-plugin-mkcert')
const mkcertBinary = join(
  mkcertDir,
  platform() === 'win32' ? 'mkcert.exe' : 'mkcert',
)

if (!existsSync(mkcertBinary)) {
  console.log(
    'Dev certificates: mkcert not found yet — vite will download it on first start.',
  )
  process.exit(0)
}

try {
  execFileSync(mkcertBinary, ['-install'], { stdio: 'inherit' })
} catch {
  console.warn(
    'Dev certificates: could not install the local CA. You may see ERR_CERT_AUTHORITY_INVALID until mkcert is trusted.',
  )
}
