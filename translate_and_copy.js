// ESM 예시
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// @rmw/deepl-markdown-translate는 ESM 형태로 배포
import translate from '@rmw/deepl-markdown-translate'

const DEEPL_API_KEY = process.env.DEEPL_API_KEY
if (!DEEPL_API_KEY) {
  throw new Error('DEEPL_API_KEY is not set')
}

// __dirname/_filename 대용
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sourceDir = process.cwd()              // 현재 폴더(소스)
const targetDir = path.join(__dirname, 'english-repo')  // 번역 결과

const IGNORED_DIRS = ['.git', '.github', 'node_modules', 'english-repo']
const EXTENSIONS = ['.md', '.txt']

async function walkAndTranslate(currentPath) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name)

    // 무시할 폴더
    if (IGNORED_DIRS.some(ignore => entryPath.includes(ignore))) {
      continue
    }

    const targetPath = entryPath.replace(sourceDir, targetDir)

    if (entry.isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true })
      }
      await walkAndTranslate(entryPath)
    } else {
      // 파일
      const ext = path.extname(entry.name).toLowerCase()
      if (EXTENSIONS.includes(ext)) {
        const content = fs.readFileSync(entryPath, 'utf-8')
        // ESM import: translate 함수
        // 라이브러리 내부적으로 coffee-script를 쓸 수 있으나, 여긴 ESM
        const translated = await translate(content, 'EN')
        fs.writeFileSync(targetPath, translated, 'utf-8')
        console.log(`Translated: ${entryPath} -> ${targetPath}`)
      } else {
        // 그 외 복사
        fs.copyFileSync(entryPath, targetPath)
      }
    }
  }
}

;(async () => {
  try {
    console.log('Start translating...')
    await walkAndTranslate(sourceDir)
    console.log('Translation complete!')
  } catch (err) {
    console.error('Error in translation process:', err)
    process.exit(1)
  }
})()