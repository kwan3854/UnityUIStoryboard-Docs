# LifetimeScope

{% hint style="warning" %}
주의: `Page`나 `Modal`의 프리펩에 붙이는 `LifetimeScope` 컴포넌트는 `Auto Run`을 반드시 disable 해야 한다.(WithParameter의 경우에 디펜던시가 리졸브 될 때 순서 문제가 발생할 수 있음)
{% endhint %}

```csharp
public class SignInModalLifetimeScope : VContainer.Unity.LifetimeScope
{
    [SerializeField] private SignInModalView view;

    protected override void Configure(IContainerBuilder builder)
    {
        base.Configure(builder);
    
        builder.RegisterComponent(view);
        builder.Register<SignInModalLifecycle>(Lifetime.Singleton);
        // builder.Register<SignInUseCase>(Lifetime.Singleton).AsImplementedInterfaces();
        builder.Register<MockSignInUseCase>(Lifetime.Singleton).AsImplementedInterfaces();
    }
}
```

* `RegisterComponent` 로 view 등록
* Lifecycle 등록
* UseCase 등록
