import os
import shutil
import requests
import logging
from pathlib import Path
import time
from typing import Optional

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TranslationError(Exception):
    """번역 과정에서 발생하는 에러를 처리하기 위한 커스텀 예외"""
    pass

def setup_directories(source_dir: str, target_dir: str) -> None:
    """작업 디렉토리 설정 및 검증"""
    source_path = Path(source_dir).resolve()
    target_path = Path(target_dir).resolve()
    
    if not source_path.exists():
        raise FileNotFoundError(f"소스 디렉토리를 찾을 수 없습니다: {source_path}")
    
    target_path.mkdir(parents=True, exist_ok=True)
    return source_path, target_path

def translate_text(text: str, api_key: str, retries: int = 3) -> Optional[str]:
    """DeepL API를 사용한 텍스트 번역 with 재시도 로직"""
    for attempt in range(retries):
        try:
            response = requests.post(
                url="https://api-free.deepl.com/v2/translate",
                data={
                    "auth_key": api_key,
                    "text": text,
                    "target_lang": "EN"
                },
                timeout=30  # 타임아웃 설정
            )
            
            if response.status_code == 200:
                return response.json()["translations"][0]["text"]
            elif response.status_code == 429:  # Rate limit
                wait_time = min(2 ** attempt, 60)  # 지수 백오프
                logger.warning(f"Rate limit hit. Waiting {wait_time} seconds...")
                time.sleep(wait_time)
                continue
            else:
                logger.error(f"Translation API error: {response.status_code} - {response.text}")
                raise TranslationError(f"번역 API 오류: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            if attempt == retries - 1:
                raise TranslationError(f"네트워크 오류: {str(e)}")
            time.sleep(2 ** attempt)
            
    return None

def should_translate(file_path: Path) -> bool:
    """번역이 필요한 파일인지 확인"""
    if not file_path.is_file():
        return False
    
    # 번역하지 않을 파일/디렉토리 목록
    IGNORED_PATHS = {'.git', '.github', 'node_modules', '__pycache__'}
    TRANSLATE_EXTENSIONS = {'.md', '.txt'}
    
    if any(ignored in file_path.parts for ignored in IGNORED_PATHS):
        return False
    
    return file_path.suffix.lower() in TRANSLATE_EXTENSIONS

def main():
    try:
        # 환경 변수 검증
        api_key = os.environ.get("DEEPL_API_KEY")
        if not api_key:
            raise ValueError("DEEPL_API_KEY 환경 변수가 설정되지 않았습니다.")

        # 디렉토리 설정
        source_dir = os.getcwd()  # GitHub Actions의 작업 디렉토리
        target_dir = os.path.join(source_dir, "english-repo")
        source_path, target_path = setup_directories(source_dir, target_dir)
        
        logger.info(f"소스 디렉토리: {source_path}")
        logger.info(f"대상 디렉토리: {target_path}")

        # 파일 처리
        for source_file in source_path.rglob('*'):
            # 상대 경로 계산
            rel_path = source_file.relative_to(source_path)
            target_file = target_path / rel_path
            
            if source_file.is_dir():
                target_file.mkdir(parents=True, exist_ok=True)
                continue
                
            if should_translate(source_file):
                logger.info(f"번역 중: {rel_path}")
                try:
                    with open(source_file, "r", encoding="utf-8") as f:
                        text = f.read()
                    
                    translated_text = translate_text(text, api_key)
                    if translated_text:
                        target_file.parent.mkdir(parents=True, exist_ok=True)
                        with open(target_file, "w", encoding="utf-8") as f:
                            f.write(translated_text)
                    else:
                        logger.error(f"파일 번역 실패: {rel_path}")
                        
                except UnicodeDecodeError:
                    logger.warning(f"인코딩 오류, 파일 건너뛰기: {rel_path}")
                except Exception as e:
                    logger.error(f"파일 처리 중 오류 발생: {rel_path} - {str(e)}")
            else:
                # 번역이 필요없는 파일 복사
                if not any(ignored in str(source_file) for ignored in ['.git', '.github']):
                    target_file.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source_file, target_file)

    except Exception as e:
        logger.error(f"스크립트 실행 중 오류 발생: {str(e)}")
        raise

if __name__ == "__main__":
    main()