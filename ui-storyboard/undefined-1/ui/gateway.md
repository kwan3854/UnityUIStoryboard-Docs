# Gateway

* 실제 외부와의 직접 통신을 담당
* 반드시 인터페이스로 구성
* 단순 통신만 하는 역할을 해야하며 절대 **비지니스 로직, 도메인 로직이 들어가면 안됨**.

```csharp
public interface IHttpClientGateway
{
    // Return json object from server using newtonsoft json
    public UniTask<TResponse> RequestAsync<TRequest, TResponse>(string url, TRequest requestData);
}
```

```csharp
public class HttpClientGateway : IHttpClientGateway
{
    public async UniTask<TResponse> RequestAsync<TRequest, TResponse>(string url, TRequest requestData)
    {
        string jsonRequest = JsonConvert.SerializeObject(requestData); // 직렬화
        string jsonResponse = "{}"; // 서버에서 받은 JSON 응답
        await UniTask.Delay(1000); // 서버 통신 대신 1초 대기
        return JsonConvert.DeserializeObject<TResponse>(jsonResponse); // 역직렬화
    }
}
```
