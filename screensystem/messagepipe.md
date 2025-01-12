# MessagePipe를 이용한 화면 간 메시징

A 화면의 업데이트 결과를 동시에 열려 있는 B 화면에도 반영하고 싶은 경우가 있습니다.

예를 들어, 캐릭터 강화를 했을 때, 한 화면 앞의 상태 화면에도 데이터 업데이트를 반영해야 합니다. 이는 MessagePipe를 이용한 메시징을 통해 구현할 수 있습니다.

원본 화면에서는 업데이트 알림을 보내고, 반영하고 싶은 화면에서 각각 알림을 받아 알림 내용을 바탕으로 각자 화면에 반영하는 방식입니다.

***

### 다음은 메시징 구현을 위한 일련의 클래스와 흐름입니다.

#### 메시지 클래스

메시지로 통지할 내용을 클래스로 분류해 둡니다.

```csharp
public class MessagePipeTestMessage
{
    // 변경 내용을 정의해 둡니다.
    public readonly int Count;
    
    public MessagePipeTestMessage(int count)
    {
        Count = count;
    }
}
```

#### RootLifetimeScope

RootLifetimeScope 등의 상위 LifetimeScope에서 알림 처리를 등록합니다.

```csharp
protected override void Configure(IContainerBuilder builder)
{
    var options = builder.RegisterMessagePipe();
    builder.RegisterMessageBroker<MessagePipeTestMessage>(options);
}
```

#### 메시지 Publisher

알림을 발행하는 측은 업데이트 시 Publisher를 사용하여 알림을 보냅니다.

```csharp
private readonly IPublisher<MessagePipeTestMessage> _testMessagePublisher;

_testMessagePublisher.Publish(new MessagePipeTestMessage(_parameter.ModalCount));
```

#### 메시지 Subscriber

알림을 구독하는 측에서는 Subscribe를 사용하여 메시지 수신 시 업데이트 처리를 설명합니다.

```csharp
private ISubscriber<MessagePipeTestMessage> _testMessageSubscriber;

_testMessageSubscriber.Subscribe(m =>
{
    // 받은 업데이트 내용을 바탕으로 Model과 View에 반영합니다.
    _view.UpdateModalCount(m.Count);
}).AddTo(_disposeCancellationTokenSource.Token);
```

***

위와 같이 LifetimeScope에 등록, 발행 측 처리, 구독 측 처리를 생성하여 메시징이 이루어지고, 여러 화면의 업데이트가 이루어지고 있습니다. MessagePipe는 인게임과 상관없이 메시징을 구현할 수 있는 유용한 라이브러리이기 때문에 적극 활용합니다.
