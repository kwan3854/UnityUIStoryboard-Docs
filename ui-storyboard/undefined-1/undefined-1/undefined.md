# 자동 초기화 사용하기

{% hint style="warning" %}
반드시 새 프로젝트에서 진행하세요. 기존 프로젝트에 적용하려는 경우 수동으로 asmdef와 폴더 구조등을 스스로 정리하세요.
{% endhint %}

## 1. 자동 초기화

### 자동 초기화 사용법

1. `Edit`-> `Project Settings...` 클릭

<figure><img src="../../../.gitbook/assets/스크린샷 2025-01-11 오후 10.57.10.png" alt="" width="373"><figcaption><p>Project Settings</p></figcaption></figure>

2. UI Storyboard 탭 선택 (최초 진입시 설정 변수 생성 버튼이 표시될 수 있음, 만약 표시된다면 클릭)
3. `Project Name` 에 프로젝트 이름 입력
4. `Initialize Project Structure`버튼 클릭

<figure><img src="../../../.gitbook/assets/스크린샷 2025-01-11 오후 10.57.23 (2).png" alt=""><figcaption><p>UI Storyboard Settings</p></figcaption></figure>

## 2. 자동 초기화는 어떤 일을 해 주나요?

### 폴더 구조를 생성해 줍니다.

<figure><img src="../../../.gitbook/assets/스크린샷 2025-01-11 오후 11.10.31 (1).png" alt=""><figcaption><p>Directories</p></figcaption></figure>

### Assembly Definitions를 생성해 줍니다.

* `asmdef` 의 적절한 사용은 약속된 구조에서 벗어난 코드를 작성하는 것을 방지하고, 프로젝트의 컴파일 속도를 빠르게 만들어줍니다.
* 자동 초기화는
  * 가장 기본적으로 필요한 필수 asmdef 를 생성해줍니다.
  * 가장 기본적으로 필요한 필수 reference를 자동으로 생성해줍니다.

<figure><img src="../../../.gitbook/assets/스크린샷 2025-01-11 오후 11.12.47.png" alt=""><figcaption><p>Assembly Definition</p></figcaption></figure>

