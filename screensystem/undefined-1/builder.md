# Builder

### 개념

* BuilderBase는 ScreenSystem의 기능 중 하나로, DI Container와 연동하여 화면을 생성하고 Page와 Modal을 생성합니다.
* 다음 화면에서 사용할 요소는 Parameter로 정의하여 전달할 수 있습니다.
* 예를 들어 인벤토리에서 아이템을 눌러 상세 아이템 페이지로 넘어가는 UI라고 해 봅시다.
  * 선택한 아이템의 ID를 다음 화면으로 파라미터를 통해 전달할 수 있습니다.

### 예시 코드

```csharp
public class TestPageBuilder : PageBuilderBase<TestLifecycle, TestPageView>
{
    public TestBuilder(bool playAnimation = true, bool stack = true) : base(playAnimation, stack) { }
}

// 다음 화면에 파라미터를 전달하는 경우
public class TestPageBuilder : PageBuilderBase<TestLifecycle, TestView, TestPageParameter>
{
    public TestBuilder(TestParameter parameter, bool playAnimation = true, bool stack = true) : base(parameter, playAnimation, stack) { }
}
```
