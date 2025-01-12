# LifetimeScope

### 개념

* VContainer 특유의 단위입니다.
* **1화면에 대해 하나만 작성합니다.&#x20;**<mark style="color:red;">**(예외 없음)**</mark>

### 용도

* 화면안에서의 클래스 의존관계를 지정합니다.
* View를 Presenter(Lifecycle)에 건내줍니다.

### 구현방법

* LifetimeScope 혹은, LifetimeScopeWithParameter를 상속받아 구현합니다.
* SerializeField 를 통해 pageView를 받아서 사용합니다.
* 통신등의 Mock 정보또한 추가합니다.

### 예시 코드

```csharp
public class TestLifetimeScope : LifetimeScope
{
    [SerializeField] private TestView _view;

    protected override void Configure(IContainerBuilder builder)
    {
        base.Configure(builder);
        builder.RegisterComponent(_view); // View 등록
        builder.Register<TestPageLifecycle>(Lifetime.Singleton);  // 화면별 Lifecycle 등록
        builder.Register<TestUseCase>(Lifetime.Singleton); // 통신의 UseCase 등록
        AddMockInDebug(builder);  // 통신 Mock 플러그인 삽입
    }
}
```
