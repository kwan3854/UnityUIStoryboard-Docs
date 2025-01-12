# Model, View, Presenter(Lifecycle) 세트

* Page/Modal 당 1개의 Model, 1개의 Presenter, 1개의 View를 기본 단위로 삼는다.
* 복잡도에 따라 Model이나 View를 여러 개 구성할 수 있지만, 최종적으로는 단일 Model, 단일 View 형태로 “합쳐”서 사용하는 것을 권장.
* Presenter는 반드시 UseCase를 통해 로직을 수행하며, UseCase에서 Repository를 통해 외부 통신(서버, DB 등)을 처리.
* Repository는 다시 Gateway를 통해 실제 통신을 담당.
* UseCase 레벨에서는 통신 규약, 프로토콜 등을 신경 쓰지 않아도 되게끔 개발.
* Gateway는 실제 통신 규약 API 등에 맞추어 개발
* Repository가 추후에 UseCase와 Gateway의 중간 매개체로 가장 나중에 개발됨.
