# UnityScreenNavigator와의 관계

* ScreenSystem은 UnityScreenNavigator 의 wrapper 라이브러리라 할 수 있습니다.
* ScreenSystem의 가장 큰 의의는 VContainer(DI)의 도입입니다.
* 이와 함께 Onion Architecture 방식의 도입도 따라오게 됩니다.
* ScreenSystem에서는 UnityScreenNavigator에서 존재하는 `Page`, `Modal`, `Sheet` 중 `Page`와 `Modal` 두 가지만 사용합니다. (Sheet와 같은 탭 UI는 화면의 전환의 개념이 아닌 view 방식의 일종으로 보는 설계입니다.)
* `Page`는 화면의 기본이 되어 항상 표시되는 것입니다.
* `Page`가 갱신되면 화면 전체가 갱신됩니다.
* `Modal`은 `Page` 위에 표시되는 일종의 대화상자로 활용합니다.
* `Modal`은 여러개가 쌓여 있을 수 있습니다.
* 화면 전환은 Prefab의 전환을 통해 이루어집니다.
