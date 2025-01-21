import os
import shutil
import requests

def main():
    source_dir = "./"  # 한국어 레포 루트
    target_dir = "./english-repo"  # 영어 레포 클론 폴더
    os.makedirs(target_dir, exist_ok=True)

    # 모든 파일과 폴더 복사
    for root, dirs, files in os.walk(source_dir):
        for dirname in dirs:
            src_dir = os.path.join(root, dirname)
            tgt_dir = src_dir.replace(source_dir, target_dir, 1)
            os.makedirs(tgt_dir, exist_ok=True)
        for filename in files:
            src_file = os.path.join(root, filename)
            tgt_file = src_file.replace(source_dir, target_dir, 1)

            # .md 파일 번역
            if filename.endswith(".md"):
                with open(src_file, "r", encoding="utf-8") as f:
                    text = f.read()

                response = requests.post(
                    url="https://api-free.deepl.com/v2/translate",
                    data={
                        "auth_key": os.environ["DEEPL_API_KEY"],
                        "text": text,
                        "target_lang": "EN"
                    }
                )

                if response.status_code == 200:
                    translated_text = response.json()["translations"][0]["text"]
                    with open(tgt_file, "w", encoding="utf-8") as f:
                        f.write(translated_text)
                else:
                    print(f"Error translating {src_file}: {response.text}")
            else:
                # 번역이 필요 없는 파일 복사
                shutil.copy2(src_file, tgt_file)

if __name__ == "__main__":
    main()