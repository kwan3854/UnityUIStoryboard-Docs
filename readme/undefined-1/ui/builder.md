# Builder

### 개념

* BuilderBase는 ScreenSystem의 기능 중 하나로, DI Container와 연동하여 화면을 생성하고 Page와 Modal을 생성합니다.
* 다음 화면에서 사용할 요소는 Parameter로 정의하여 전달할 수 있습니다.
* 예를 들어 인벤토리에서 아이템을 눌러 상세 아이템 페이지로 넘어가는 UI라고 한다면,
  * 선택한 아이템의 ID를 다음 화면으로 파라미터를 통해 전달할 수 있습니다.

### Sign In Modal 에서의 예시 코드

```csharp
public class SignInModalBuilder : ModalBuilderBase<SignInModalLifecycle, SignInModalView>
{
    public SignInModalBuilder(bool playAnimation) : base(playAnimation)
    {
    }
}
```

### 만약 파라미터를 화면 호출시에 전달하고 싶다면

* ModalBuilderBase, PageBuilderBase 는 파라미터가 있는 버전과 없는 버전 두 가지가 있습니다.

```csharp
namespace ScreenSystem.Modal
{
    public abstract class ModalBuilderBase<TModal, TModalView, TParameter> : ModalBuilderBase<TModal, TModalView>
        where TModal : IModal
        where TModalView : ModalViewBase
    {
        public ModalBuilderBase(TParameter parameter, bool playAnimation = true, string overridePrefabName = null);
​
        protected override void SetUpParameter(LifetimeScope lifetimeScope);
​
        public async UniTask<IModal> Build(ModalContainer modalContainer, LifetimeScope parent, CancellationToken cancellationToken);
    }
​
    public abstract class ModalBuilderBase<TModal, TModalView> : IModalBuilder
        where TModal : IModal
        where TModalView : ModalViewBase
    {
        public ModalBuilderBase(bool playAnimation = true, string overridePrefabName = null);
    }
}
```

만약, 파라미터를 전달받는 BuilderBase를 사용한 경우, 해당 화면의 LifetimeScope 역시 파라미터를 받는 `LifetimeScopeWithParameter<T>` 를 사용해야 합니다. 그렇게 하면, Builder측에서 화면을 생성할때 자동으로 LifetimeScope 쪽으로 파라미터를 전달해 줍니다.
