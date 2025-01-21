# 어니언 아키텍처 (Onion Architecture)

* 일반적인 Clean Architecture를 실제 프로젝트에서 좀 더 **“프랙티컬”하게 변형**해 적용합니다.
* **내부 레이어**(도메인, UseCase)와 **외부 레이어**(Repository, Gateway)를 계층화해, 비즈니스 로직(UseCase/도메인)이 외부 의존성(네트워크, DB 등)에 흔들리지 않도록 설계합니다.
* &#x20;각 레이어 간 연결은 인터페이스를 통해서만 이뤄지며(MVP 제외), 모든 구현체는 **Dependency Injection(VContainer)**&#xB85C; 주입됩니다.
