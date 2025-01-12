# Model

### 개념

* Lifecycle에서 생성됩니다.
* 화면 내 실제 데이터를 가지고 있습니다.
* **한 화면에 하나만 작성합니다.&#x20;**<mark style="color:green;">**(예외 있음)**</mark>

### 구현 정책

* 대부분의 통신결과나 마스터 데이터를 기반으로 프로퍼티 형태로 값을 보유합니다.
* Model 내의 업데이트 처리는 모두 Lifecycle에서 호출합니다.
* **1화면 1Model**이 기본입니다.
  * 통신내용이나 복잡도에 따라 Model은 분할 가능합니다.
  * 단, 너무 세분화되면 Model간의 정보 전달을 위해 Lifecycle과의 연동이 필수적이기 때문에 원칙적으로는 1Model을 준수하되, 너무 모델이 비대해졌다는 확실한 판단이 되면 분할하는 것을 원칙으로 합니다.
  * 목록 정보 등 여러 요소를 관리하고 싶다면 Model 안에 Model을 만들기도 합니다.

### 예시 코드

```csharp
public class TestPageModel
{
    public readonly string TestMessage;

    public TestPageModel() {
        // 통신 결과나 마스터 데이터를 기반으로 Model을 구축하기도 한다.
        TestMessage = "Test Page";
    }
}
```
