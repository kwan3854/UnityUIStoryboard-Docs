# translate_all.R
# 의존성: babeldown, (그리고 brio, withr, etc.가 babeldown 내부에서 사용)
Sys.setenv("DEEPL_API_URL" = "https://api.deepl.com")


# 1) 모든 .md 파일을 찾는다
md_files <- list.files(
  path = ".", 
  pattern = "\\.md$", 
  recursive = TRUE,
  full.names = TRUE
)

# 번역 제외 폴더 (영어 레포, .git, .github 등) 필터링
exclude_folders <- c("english-repo", ".git", ".github", "node_modules")
md_files <- md_files[!grepl(paste(exclude_folders, collapse="|"), md_files)]

cat("Found .md files:\n")
print(md_files)

# 2) 각 파일을 번역해서 english-repo/에 저장
# babeldown::deepl_translate() → source_lang = "KO", target_lang = "EN"
# out_path = english-repo/ (동일 경로 구조)
library(babeldown)

for (f in md_files) {
  cat("\n===== Translating:", f, "=====\n")

  # out_path : "english-repo/..."
  out_f <- file.path("english-repo", f)

  # 폴더 생성
  dir.create(dirname(out_f), recursive = TRUE, showWarnings = FALSE)

  # babeldown 번역 수행
  # - formality, yaml_fields, etc. 옵션을 필요에 따라 설정
  # - 여기선 단순히 문서 전체를 "ko" -> "en" 번역
  deepl_translate(
    path = f,
    out_path = out_f,
    source_lang = "KO-KR",
    target_lang = "EN-US"
  )

  cat("Translated ->", out_f, "\n")
}

cat("\nAll .md files processed!\n")