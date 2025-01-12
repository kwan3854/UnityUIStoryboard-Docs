# UseCase

### 개념

* 주로 **생성자와 실행 함수 1개**만 가진 클래스입니다.
* 받은 데이터에 대해 부작용(side effect)를 가하지 않는 클래스입니다.
* 정적 함수로 만들 수도 있지만 DI와의 궁합이 좋기 때문에 일반 클래스로 분류했습니다.

### 언제 UseCase를 사용하나요?

* 통신 처리
* 공통 처리로 여러 화면에서 사용되는 처리
* Lifecycle로 작성하면 비대화되어 가독성이 떨어지는 경우

특히 통신처리는 여러 화면에서 호출되는 경우가 많고, 처리 내용도 비대해지기 쉽기 때문에 UseCase로 분류해서 사용합니다.

#### 이럴 때 UseCase를 사용하도록 하세요.

예를 들어 캐릭터 정보 획득 통신은 인게임 전환 시, 편성 화면, 강화 화면 등 여러 화면에서 호출됩니다. 같은 처리를 여러곳에서 하게되므로 UseCase로 묶어 하나의 클래스로 관리하도록 합니다.

#### Lifecycle 대신 전부다 UseCase로 처리하면 안되나요?

통신 이외에도 모든 처리를 UseCase화 할 수도 있지만, 한 번만 사용하는 일회성 UseCase가 계속 늘어나게 됩니다. 이렇게 되면 가독성이 떨어지고 개발 효율도 떨어질 수 있습니다.

다른 공통적인 처리에서 2\~3회 이상 중복 사용되는 것이 확인되면 그 때 마다 UseCase화 하여 정리하도록 하는 방식을 추구합니다.

### 예시 코드

아래는 통신의 UseCase 샘플입니다. 통신을 하고 결과는 받는 것 뿐만 아니라, 통신 중 UI 표시, 에러 처리 등도 포함해서 작성합니다. 사용자(Lifecycle 등)는 DoConnect를 호출하는 것만으로 오류 처리까지 포함한 통신 처리를 할 수 있습니다.

```csharp
public class TestUseCase
{
    private readonly IHttpClient _httpClient; // 통신 실행 클래스
    private readonly NetworkErrorUseCase _networkErrorUseCase; // 통신 오류에 따른 화면 전환 등의 오류 대책
    private readonly NetworkLoadingController _loadingController; // 통신 중 표시

    [Inject]
    public HomePageUseCase(IHttpClient httpClient, NetworkErrorUseCase networkErrorUseCase, NetworkLoadingController loadingController)
    {
        _httpClient = httpClient;
        _networkErrorUseCase = networkErrorUseCase;
        _loadingController = loadingController;
    }

    // DoConnect를 호출하고 실행하기
    public async UniTask<TestPageLifecycle.NetworkParameter> DoConnect(CancellationToken cancellationToken) => await DoConnectInternal(cancellationToken, 0);

    // DoConnect 내부 처리
    // 오류 발생 시 이전까지의 재시도 횟수를 받아 재귀 처리한다.
    private async UniTask<TestPageLifecycle.NetworkParameter> DoConnectInternal(CancellationToken cancellationToken, int retryCount)
    {
        // 통신 중... 의 UI를 표시하고 통신을 시작합니다.
        _loadingController.Activate();
        var connection = await _httpClient.Call<TestConnectResponse>(new TestConnectRequest(), cancellationToken);
        _loadingController.InActivate();

        // 실패 시 처리
        if (!connection.result.IsSuccess())
        {
            // 예를 들어, 유지보수 중에는 유지보수 표시를 하고 제목으로 되돌립니다.
            if (connection.response?.status.IsInMaintenanceMode ?? false)
            {
                await _networkErrorUseCase.ShowMaintenanceToTitle(connection.response?.status.error);
                return null;
            }
            
            // 오류 발생 시 재시도 여부를 선택하게 한다.
            // 재시도에는 최대 횟수가 설정되어 있으며, 이를 초과하면 강제로 타이틀을 되돌릴 수 있다.
            var isRetry = await _networkErrorUseCase.ShowErrorWithRetry(retryCount);
            if (isRetry)
            {
                retryCount++;
                return await DoConnectInternal(cancellationToken, retryCount);
            }
            return null;
        }

        // 통신에 성공하면 응답을 반환합니다.
        return new TestPageLifecycle.NetworkParameter()
        {
            TestConnectResponse = result.response
        };
    }
}
```

