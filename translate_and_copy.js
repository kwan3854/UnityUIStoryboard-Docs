// translate_and_copy.js (CJS)
const fs = require('fs')
const path = require('path')
const translate = require('@rmw/deepl-markdown-translate')

const DEEPL_API_KEY = process.env.DEEPL_API_KEY
if (!DEEPL_API_KEY) {
  throw new Error('DEEPL_API_KEY is not set.')
}

// 현재 디렉토리(소스)와 'english-repo'(결과물) 설정
const sourceDir = __dirname
const targetDir = path.join(__dirname, 'english-repo')

// 무시 패턴
const IGNORED_DIRS = ['.git', '.github', 'node_modules', 'english-repo']

// 번역 대상 확장자
const EXTENSIONS = ['.md', '.txt']

async function walkAndTranslate(currentPath) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name)

    // 무시할 폴더면 스킵
    if (IGNORED_DIRS.some((ignore) => entryPath.includes(ignore))) {
      continue
    }

    const targetPath = entryPath.replace(sourceDir, targetDir)

    if (entry.isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true })
      }
      await walkAndTranslate(entryPath)
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      if (EXTENSIONS.includes(ext)) {
        const content = fs.readFileSync(entryPath, 'utf-8')
        // @rmw/deepl-markdown-translate → CoffeeScript/CJS 내부에서 동작
        const translated = await translate(content, 'EN')
        fs.writeFileSync(targetPath, translated, 'utf-8')
        console.log(`Translated: ${entryPath} -> ${targetPath}`)
      } else {
        // 그냥 복사
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