import fs from 'fs'
import path from 'path'

const contentPath = path.join(process.cwd(), 'data', 'content.json')

export default function handler(req, res) {
  if (req.method === 'GET') {
    const raw = fs.readFileSync(contentPath, 'utf-8')
    res.status(200).json(JSON.parse(raw))
  } else if (req.method === 'POST') {
    fs.writeFileSync(contentPath, JSON.stringify(req.body, null, 2), 'utf-8')
    res.status(200).json({ ok: true })
  } else {
    res.status(405).end()
  }
}
