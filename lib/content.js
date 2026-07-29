import fs from 'fs'
import path from 'path'

const contentPath = path.join(process.cwd(), 'data', 'content.json')

export function getContent() {
  const raw = fs.readFileSync(contentPath, 'utf-8')
  return JSON.parse(raw)
}

export function saveContent(data) {
  fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf-8')
}
