# 의존성

### ScreenSystem은 다음 라이브러리에 <mark style="color:red;">의존</mark>성을 가지고 있습니다.

* VContainer
  * DI 프레임워크로 클래스 및 오브젝트의 종속성을 관리합니다.
* UnityScreenNavigator
  * 화면을 페이지와 모듈 단위로 분할하고 전환하여 화면 전환을 수행합니다.
* UniTask
  * Task를 쉽게 다룰 수 있는 OSS로 통신, 화면 전환 등 폭넓게 사용됩니다.

### 다음 라이브러리와 함께 사용을 <mark style="color:green;">권장</mark>합니다.

* UniRx
  * 주로 View의 이벤트를 Presenter에게 알리고 MVP(MVRP)를 구현하기 위해 사용합니다.
* MessagePipe
  * 메시징 라이브러리로서 동시에 존재하는 다른 화면에 업데이트 내용을 전달하고 싶을 때 사용합니다.
