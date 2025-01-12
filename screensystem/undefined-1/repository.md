# Repository

### 개념

* Repository는 주로 영속화할 데이터를 관리합니다.
* 여러 화면에 걸쳐 획득, 갱신됩니다.

### 언제 사용하나요?

* 예를들어 사용자 이름이나 통신 관련 정보 등은 Repository 에 포함시켜 처리합니다.
* 대부분 로그인 시 서버로부터 받아 그 타이밍에 Repository를 생성합니다.
* 싱글톤으로 관리할 수도 있지만, 타이틀화면으로 돌아가 로그인 정보를 파기하고 싶을 때 등, Repository가 파기/재생성 될 수 있으므로 적절한 LifetimeScope로 관리하도록 합니다.

### 예시 코드

```csharp
public class UserRepository
{
    public string Id { get; private set; } // 유저 ID
    public string Name { get; private set; } // 유저명

    // 로그인 시 생성하여 사용자 정보 초기화
    public void SetUser(string id, string name)
    {
        Id = id;
        Name = name;
    }
}
```
