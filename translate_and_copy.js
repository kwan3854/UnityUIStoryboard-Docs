import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import translate from '@rmw/deepl-markdown-translate'

// GitHub Action의 env에서 가져오기
const DEEPL_API_KEY = process.env.DEEPL_API_KEY
if (!DEEPL_API_KEY) {
  throw new Error('DEEPL_API_KEY 환경 변수가 설정되지 않았습니다.')
}

// 번역할 디렉토리는 현재 리포 (소스) 디렉토리, 결과물은 english-repo 디렉토리로
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sourceDir = __dirname // or process.cwd() 등으로 잡아도 됨
const targetDir = path.join(__dirname, 'english-repo')

// 무시할 패턴들
const IGNORED_DIRS = ['.git', '.github', 'node_modules', 'english-repo']

// 번역할 확장자
const EXTENSIONS = ['.md', '.txt']

async function walkAndTranslate(currentPath) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name)

    // 무시할 디렉토리면 패스
    if (IGNORED_DIRS.some((ignore) => entryPath.includes(ignore))) {
      continue
    }

    const targetPath = entryPath.replace(sourceDir, targetDir)

    if (entry.isDirectory()) {
      // 디렉토리 생성
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true })
      }
      await walkAndTranslate(entryPath)
    } else {
      // 파일 처리
      const ext = path.extname(entry.name).toLowerCase()

      if (EXTENSIONS.includes(ext)) {
        // 파일 읽기
        const content = fs.readFileSync(entryPath, 'utf-8')
        // 번역 실행
        const translated = await translate(content, 'EN')  // 두 번째 인자로 "EN-US" 등도 가능
        // 번역 결과 쓰기
        fs.writeFileSync(targetPath, translated, 'utf-8')
      } else {
        // 그냥 복사
        fs.copyFileSync(entryPath, targetPath)
      }
    }
  }
}

(async () => {
  try {
    console.log('Start translating...')
    await walkAndTranslate(sourceDir)
    console.log('Translation complete!')
  } catch (err) {
    console.error('Error in translation process:', err)
    process.exit(1)
  }
})()