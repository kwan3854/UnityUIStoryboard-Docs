# 목업 코드 작성하기

사실 우리는 이미 일종의 목업 코드를 작성한 바 있습니다.

이는, [gateway.md](../ui/gateway.md "mention") 코드인데, 설명을 간략화하기 위해 실제 서버에 연결하는 코드를 작성하지 않고 간단히 몇초간의 딜레이 후, 값을 반환하는 코드를 작성했습니다.

이와같은 방식으로 목업을 하려는 의도에 따라 목업할 레이어를 선택하여 실제 구현이 될 부분과 동일한 인터페이스를 구현하는 목업 클래스를 작성하여 DI 컨테이너에서 목업 클래스를 주입하여 사용하는 방식으로 구현합니다.

