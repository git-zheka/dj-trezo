import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { filePath, data } = req.body

  // data = "data:image/jpeg;base64,..."
  const base64 = data.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')

  const fullPath = path.join(process.cwd(), 'public', filePath)
  const dir = path.dirname(fullPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(fullPath, buffer)

  const url = `/${filePath}?t=${Date.now()}`
  res.status(200).json({ ok: true, url })
}
