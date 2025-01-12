# Lifecycle

### 개념

* 화면의 실질적인 진입점(EntryPoint)입니다.
* MVP에서의 Presenter 역할을 합니다.
* 화면 단위로 생성합니다.
* 화면의 수명과 연결되는 개념이라는 의미에서 Lifecycle이라 명명합니다.
* **한 화면에 하나만 작성합니다.&#x20;**<mark style="color:red;">**(예외 없음)**</mark>

### 구현 정책

* 생성자는 LifetimeScope에서 가져온 각 클래스의 레퍼런스를 가져오는 역할만 합니다. (다른 복잡한 처리는 하지 않는다)
* 화면 전환 전에 `WillPushEnterAsync` 안에서 다음을 수행합니다.
  * Model 생성합니다.
  * View 초기화(생성한 모델을 View에 전달)합니다.
* 화면 전환 후 `DidPushEnter` 안에서 View 버튼 처리를 구독합니다.
  *    화면 전환 후 버튼 처리를 활성화하면 전환 중에는 버튼 입력 이벤트가 발생하지 않습니다. (전환중에 버튼이 눌리면 여러가지로 곤란한 경우가 많아집니다.)
* 클래스의 어트리뷰트에 AssetName(프리펩 이름)을 지정합니다.

### 예시 코드

```csharp
[AssetName("TestPage")]
public class TestPageLifecycle : LifecyclePageBase
{
    // 생성자에서 받는 것을 선언합니다.
    private readonly TestPageView _view;
    private readonly PageEventPublisher _publisher;
    private readonly ModalManager _modalManager;

    // 생성자 인젝션
    [Inject]
    public TestPageLifecycle(TestPageView view, PageEventPublisher publisher, ModalManager modalManager) : base(view)
    {
        _view = view;
        _publisher = publisher;
        _modalManager = modalManager;
    }

    // 화면 전환 전 타이밍에 View 초기화하기
    protected override UniTask WillPushEnterAsync(CancellationToken cancellationToken)
    {
        var testModel = new TestPageModel();
        _view.SetView(testModel);
        return UniTask.CompletedTask;
    }

    // 화면 전환 후 버튼 이벤트 등록하기
    public override void DidPushEnter()
    {
        base.DidPushEnter();
        // 페이지 표시
        _view.OnClickPage.Subscribe(_ => {
          _publisher.SendPushEvent(new NextPageBuilder());
        });
        // Modal 표시
        _view.OnClickModal.Subscribe(_ => {
          _modalManager.Push(new NextModalBuilder()).Forget();
        });
    }
}
```

{% hint style="success" %}
PageEventPublisher와 ModalManager는 ScreenSystem의 기능으로 각각 Page와 Modal을 전환하는 역할을 합니다. 다음으로 열릴 화면을 Builder를 통해 구축합니다.
{% endhint %}

