# 설치

{% hint style="success" %}
### OpenUPM 사용을 권장합니다.

Unity UI Storyboard는 많은 opensource 라이브러리들에 의존하고 있습니다. OpenUPM을 사용하면 자동으로 많은 dependency를 해소할 수 있습니다.&#x20;

만약 어떠한 이유로 OpenUPM 사용을 지양한다면, 직접 의존성을 해소하셔야 합니다. 의존성은 [dependencies.md](../undefined/dependencies.md "mention")에서 확인하세요
{% endhint %}

## OpenUPM 사용 (권장)

### Command-line 인터페이스를 이용한 설치 (권장)

1. 해당 유니티 프로젝트가 위치한 곳으로 이동
2. 아래의 커맨드 입력

```bash
openupm add com.kwanjoong.unityuistoryboard
```

### 패키지 매니저를 통해 설치

1. `Edit` -> `Project Settings ->` `Package Manager`
2. 새로운 Scoped Registry 등록 (또는 이미 존재하는 OpenUPM entry 수정)

```
Name: package.openupm.com
URL: https://package.openupm.com
```

3. `Save` 또는 `Apply` 클릭
4. `Window` -> `Package Manager 열기`
5. `+` 클릭
6. &#x20;`Add package by name...` 또는 `Add package from git URL...` 선택
7. `com.kwanjoong.unityuistoryboard` 을 이름에 붙여넣기
8. 최신버전/원하는버전 을 입력 (예: 0.1.0)
9. `Add` 클릭

***

또는 [Packages/manifest.json](https://docs.unity3d.com/Manual/upm-manifestPrj.html) 에 아래의 코드를 직접 삽입해도 됩니다.

```json
{
    "scopedRegistries": [
        {
            "name": "package.openupm.com",
            "url": "https://package.openupm.com",
            "scopes": []
        }
    ],
    "dependencies": {
        "com.kwanjoong.unityuistoryboard": "0.1.0"
    }
}
```

## Git과 Package Manager 를 이용한 설치 (권장하지 않음)

1. `Window` -> `Package Manager 열기`
2. `+` 클릭
3. `Add package from git URL...` 선택
4. `https://github.com/kwan3854/UnityUIStoryboard.git 입력`
5. `주의: 직접 의존성을 해소하세요.`
