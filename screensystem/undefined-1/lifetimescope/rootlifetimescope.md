# RootLifetimeScope

### 개념

* 프로젝트에 최상위 LifetimeScope 입니다.
* 게임의 시작부터 종료까지 영속됩니다.
* ScreenSystem에서는 일종의 EntryPoint를 실행시키는 역할도 시킵니다.

### 구현 방침

* 페이지 컨테이너와 모달 컨테이너를 SerializeField를 통해 참조 받습니다.
* 참조받은 두 컨테이너를 등록합니다.
  * `IContainerBuilder` 타입의 extension method로 ScreenSystem에서 지원하는 `RegisterPageSystem`과 `RegisterModalSystem` 메서드를 사용합니다.
* 첫번째 페이지를 Push시킵니다.
  * EntryPoint 클래스를 만듧니다.
    * IStartable 인터페이스를 이용, 구현합니다.
    * RootLifetimeScope에서 RegisterEntryPoint로서 등록합니다.
    * PageEventPublisher를 Inject 받아서 PageBuilder를 메시지로 보내면 페이지 Push 가능합니다.
  * 기타 메시지 브로커, 네트워크 관련 디펜던시 등등을 등록합니다.

```csharp
public class RootLifetimeScope : LifetimeScope
{
    [SerializeField] UnityScreenNavigator.Runtime.Core.Page.PageContainer _container;
    [SerializeField] UnityScreenNavigator.Runtime.Core.Modal.ModalContainer _modalContainer;

    protected override void Configure(IContainerBuilder builder)
    {
        builder.RegisterPageSystem(_container);
        builder.RegisterModalSystem(_modalContainer);
        builder.Register<IHttpClient>(_ => new HttpClient(), Lifetime.Singleton);

        var options = builder.RegisterMessagePipe();
        builder.RegisterMessageBroker<MessagePipeTestMessage>(options);
        builder.RegisterEntryPoint<TestEntryPoint>();
    }

    private class TestEntryPoint : IStartable
    {
        private readonly PageEventPublisher _publisher;

        public TestEntryPoint(PageEventPublisher publisher)
        {
            _publisher = publisher;
        }

        public void Start()
        {
            _publisher.SendPushEvent(new TestPageBuilder());
        }
    }
}
```
