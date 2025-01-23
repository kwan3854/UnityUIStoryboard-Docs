// extract_and_deepl_all.mjs (ESM 문법)
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { extract, compose } from '@diplodoc/markdown-translation';

// DeepL API Key
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
  throw new Error("DEEPL_API_KEY not set!");
}

// DeepL 문서 번역 (Document API)
const DEEPL_DOC_ENDPOINT = "https://api.deepl.com/v2/document";

/**
 * 특정 폴더를 재귀 탐색하여 .md 파일 목록을 반환
 */
function getAllMdFiles(dir, fileList = []) {
  const ignore = ['.git', '.github', 'node_modules', 'english-repo'];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (ignore.includes(entry.name)) {
      continue;
    }
    if (entry.isDirectory()) {
      getAllMdFiles(fullPath, fileList);
    } else if (
      entry.isFile() &&
      path.extname(entry.name).toLowerCase() === '.md'
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadXlfToDeepL(xlfPath, sourceLang, targetLang) {
  const form = new FormData();
  form.append("auth_key", DEEPL_API_KEY);
  form.append("source_lang", sourceLang);
  form.append("target_lang", targetLang);
  form.append("file", fs.createReadStream(xlfPath));

  const res = await fetch(DEEPL_DOC_ENDPOINT, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepL upload failed: ${res.status} - ${text}`);
  }
  const { document_id, document_key } = await res.json();
  return { document_id, document_key };
}

async function waitForDocumentDone(document_id, document_key) {
  while (true) {
    const url = `${DEEPL_DOC_ENDPOINT}/${document_id}?auth_key=${DEEPL_API_KEY}&document_key=${document_key}`;
    const statusRes = await fetch(url);
    const data = await statusRes.json();

    if (data.status === "done") {
      return;
    } else if (data.status === "error") {
      throw new Error(`DeepL doc translation error: ${JSON.stringify(data)}`);
    } else {
      console.log(`DeepL doc status: ${data.status}, progress: ${data.document_progress}%`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function downloadTranslatedXlf(document_id, document_key, outputPath) {
  const url = `${DEEPL_DOC_ENDPOINT}/${document_id}/result?auth_key=${DEEPL_API_KEY}&document_key=${document_key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepL download failed: ${res.status} - ${text}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`Downloaded translated XLF to: ${outputPath}`);
}

(async () => {
  try {
    const sourceDir = process.cwd(); // 현재 리포 루트
    const mdFiles = getAllMdFiles(sourceDir);
    console.log("Found .md files:", mdFiles);

    for (const mdFilePath of mdFiles) {
      console.log(`===== Translating ${mdFilePath} =====`);
      const content = fs.readFileSync(mdFilePath, 'utf-8');

      // extract -> skeleton, xlf
      const { skeleton, xlf } = extract({
        markdown: content,
        source: { language: "ko", locale: "KR" },
        target: { language: "en", locale: "US" },
        skeletonPath: mdFilePath + ".skl.md",
        markdownPath: mdFilePath,
      });

      // log skeleton and xlf
      console.log("Skeleton:", skeleton);
      console.log("XLF:", xlf);

      if (!skeleton || skeleton.trim().length === 0) {
        console.log("No skeleton content (maybe no translatable text?) Skipping...");
        continue;
      }

      const skeletonPath = mdFilePath + ".skl.md";
      const xlfPath = mdFilePath + ".xlf";
      fs.writeFileSync(skeletonPath, skeleton, 'utf-8');
      fs.writeFileSync(xlfPath, xlf, 'utf-8');

      // DeepL Document Translation
      const { document_id, document_key } = await uploadXlfToDeepL(xlfPath, "KO", "EN");
      console.log(`Uploaded => doc_id=${document_id} key=${document_key}`);

      await waitForDocumentDone(document_id, document_key);
      console.log("DeepL done. Downloading...");

      const translatedXlfPath = mdFilePath + ".translated.xlf";
      await downloadTranslatedXlf(document_id, document_key, translatedXlfPath);

      // compose -> 최종 영문 MD
      const newSkeleton = fs.readFileSync(skeletonPath, 'utf-8');
      const newXlf = fs.readFileSync(translatedXlfPath, 'utf-8');
      const finalMd = compose({
        skeleton: newSkeleton,
        xlf: newXlf,
      });

      // 영어 리포에 동일 경로로 저장 (예: "english-repo/docs/Intro.md")
      const relative = path.relative(sourceDir, mdFilePath);
      const enTarget = path.join("english-repo", relative);

      fs.mkdirSync(path.dirname(enTarget), { recursive: true });
      fs.writeFileSync(enTarget, finalMd, "utf-8");
      console.log(`Translated -> ${enTarget}`);
    }

    console.log("All .md files processed!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();