# 목업 코드의 강력함

### 목업 코드는 언제 사용하나요?

규모가 작고 복잡도가 낮은 단순한 프로젝트라면 목업 코드를 작성해서 인젝트 가능한 아키텍처의 유용성이 드러나지 않을 수 있습니다. 그러나 규모가 커질수록, 복잡도가 증가할수록, 여러 사람이 함께 작업할수록 이런 구조의 진가가 드러납니다.

목업코드를 이용하면 다음과 같은 작업이 가능합니다.

* 프로토타이핑
* 독립적인 테스트

### 상황 가정

다음과 같은 상황을 가정해 봅시다. 이미 어느정도 기능하는 프로젝트가 있습니다. 여기에 추가적인 기능에 대한 기획의 방향성을 테스트 해 보고 싶은 상황이 생겼습니다. 이 기능은 서버와의 통신이 필수적인 기능입니다. 그러나 언제까지나 기획의 방향성에 대한 확인을 하는 작업 정도이기 때문에 서버 작업까지 하는 등의 자원 낭비를 최소화 하고 싶습니다. 동시에 아무리 프로토 타이핑이라고 하더라도, 완전히 하드코딩된 코드를 이미 잘 동작중인 프로젝트에 억지로 집어넣거나 하기도 껄끄러운 상황입니다.

#### 우리는 이미 잘 분리된 구조로 설계 해 놓았다.

* 어니언 아키텍처를 기반으로 도메인 로직 부분과 외부 로직을 구분 해 놓았음
* 서로가 인터페이스로 느슨하게 연결되어있음.
* DI 컨테이너를 통해 종속성이 관리되고 있음.

따라서 클라이언트 측은, 서버에서 데이터가 오는 레이어만을 목업 클래스로 대체하여 끼워넣기만 해 놓고, 도메인 로직만을 고려하여 로직을 구현한 다음 추후, 기획이 확정되어 서버에서 실제 데이터가 오는 상황이 된다면 서버와 연결되도록 실제 레이어를 그때 구현하여 바꿔끼워넣으면 되는 것입니다.

이러한 방식을 활용하면 복잡하고 depth가 깊은 UI의 디버깅과 테스팅도 용이하게 할 수 있습니다.

만약 로그인 화면부터 시작해서 총 10개의 depth를 순차적으로 들어가야 나타나는 화면을 개발하고 있다고 해 봅시다. 만약 그 화면의 동작에 필요한 데이터가 앞 화면에서부터의 종속성이 있어서 반드시 매번 순차적으로 모든 10개의 화면을 진행후에 테스트를 할 수 있다면 얼마나 끔찍한 상황인가요.

이때 우리는 모킹을 통해서 종속성을 떼어내고 개발중인 화면만 개별적으로 실행시켜 테스팅이 가능합니다.
