// Compress the 10 uploaded images to web-friendly size for the gallery
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const UPLOAD_DIR = '/home/z/my-project/upload'
const OUT_DIR = '/home/z/my-project/public/gallery'

const files = [
  'pasted_image_1782692541044.png',
  'pasted_image_1782692945273.png',
  'pasted_image_1782693205559.png',
  'pasted_image_1782693267673.png',
  'pasted_image_1782693324047.png',
  'pasted_image_1782693333167.png',
  'pasted_image_1782693342708.png',
  'pasted_image_1782693353450.png',
  'pasted_image_1782693382993.png',
  'pasted_image_1782693392369.png',
]

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

const results = []
for (let i = 0; i < files.length; i++) {
  const src = `${UPLOAD_DIR}/${files[i]}`
  const outName = `gallery-${String(i + 1).padStart(2, '0')}.jpg`
  const out = `${OUT_DIR}/${outName}`

  try {
    const info = await sharp(src)
      .resize({ width: 1280, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(out)

    results.push({ index: i + 1, src: files[i], out: outName, ...info })
    console.log(`OK  ${outName}  ${Math.round(info.size / 1024)} KB  ${info.width}x${info.height}`)
  } catch (e) {
    console.error(`FAIL ${files[i]}: ${e.message}`)
    results.push({ index: i + 1, src: files[i], error: e.message })
  }
}

console.log('\nDone. Compressed', results.length, 'images.')
