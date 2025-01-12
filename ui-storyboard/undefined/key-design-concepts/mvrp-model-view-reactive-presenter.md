# MVRP 방식 (Model-View-Reactive Presenter)

• 기존 MVP 패턴에 Reactive 방식으로 Presenter, View가 바인딩 됩니다. (UniTask, R3 이용)

• Presenter를 본 문서에서는 “Lifecycle”이라고 부릅니다.

• View/UI와 비즈니스 로직(UseCase) 사이에서 Presenter가 모든 동작을 중재합니다.

• Presenter(또는 Lifecycle)는 최종적으로 UseCase를 호출하고, UseCase는 Repository와 Gateway를 통해 외부 통신/DB/캐싱 등을 처리합니다.
