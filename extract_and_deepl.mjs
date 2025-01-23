import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { extract, compose } from '@diplodoc/markdown-translation';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
  throw new Error("DEEPL_API_KEY not set!");
}

// DeepL Document Translation endpoints
const DEEPL_DOC_ENDPOINT = "https://api.deepl.com/v2/document";

async function uploadXlfToDeepL(xlfPath, sourceLang, targetLang) {
  // 1) POST /v2/document  (upload)
  const form = new FormData();
  form.append("auth_key", DEEPL_API_KEY);
  // DeepL 언어코드 예: EN, DE, FR, JA, KO (유료플랜), ...
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
  // GET /v2/document/{document_id} 로 상태 체크
  while (true) {
    const statusRes = await fetch(`${DEEPL_DOC_ENDPOINT}/${document_id}?auth_key=${DEEPL_API_KEY}&document_key=${document_key}`);
    const data = await statusRes.json();

    if (data.status === "done") {
      break;
    } else if (data.status === "error") {
      throw new Error(`DeepL doc translation error: ${JSON.stringify(data)}`);
    } else {
      console.log(`DeepL doc status: ${data.status}, progress: ${data.document_progress}%`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function downloadTranslatedXlf(document_id, document_key, outputPath) {
  // GET /v2/document/{document_id}/result 로 다운로드
  const res = await fetch(`${DEEPL_DOC_ENDPOINT}/${document_id}/result?auth_key=${DEEPL_API_KEY}&document_key=${document_key}`);
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
    // 1) 어떤 .md 파일을 읽어 skeleton + xlf 생성
    const mdText = fs.readFileSync("README.md", "utf-8");
    const { skeleton, xlf } = extract({
      markdown: mdText,
      source: { language: "ko", locale: "KR" },
      target: { language: "en", locale: "US" },
      skeletonPath: "README.skl.md",
      markdownPath: "README.md",
    });

    fs.writeFileSync("README.skl.md", skeleton, "utf-8");
    fs.writeFileSync("README.xlf", xlf, "utf-8");
    console.log("Extracted: README.skl.md + README.xlf");

    // 2) DeepL 문서 번역 API로 XLF 업로드 → 번역 대기 → 다운로드
    const { document_id, document_key } = await uploadXlfToDeepL("README.xlf", "KO", "EN"); 
    console.log(`DeepL doc uploaded, id=${document_id} key=${document_key}`);

    await waitForDocumentDone(document_id, document_key);
    console.log("DeepL doc translation done!");

    await downloadTranslatedXlf(document_id, document_key, "README.translated.xlf");

    // 3) compose(skeleton, 번역된 xlf) → 최종 번역 .md
    const newSkeleton = fs.readFileSync("README.skl.md", "utf-8");
    const translatedXlf = fs.readFileSync("README.translated.xlf", "utf-8");

    const translatedMarkdown = compose({
      skeleton: newSkeleton,
      xlf: translatedXlf,
    });

    fs.writeFileSync("README.en.md", translatedMarkdown, "utf-8");
    console.log("Composed final: README.en.md");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();