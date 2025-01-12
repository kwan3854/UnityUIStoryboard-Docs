# View

### 개념

* MVP 의 V에 해당하는 View.
* **한 화면에 하나만 작성합니다.** <mark style="color:green;">(예외 있음)</mark>

### 구현 정책

* ScreenSystem의 PageViewBase, ModalViewBase 를 상속받아 구현.
* Lifecycle에서 Model을 받아 화면을 구축한다.
* 각 버튼 등의 UI 요소는 SerializeField로 참조를 가져온다.
* 각 버튼의 이벤트는 IObservable로 공개한다.
* 목록 등 동적으로 늘어나는 View의 부분은 이 View 내에서 생성한다.
  * 즉, View가 View를 가지는 구조
  * 이벤트도 브릿지처럼 되어버리지만, 이벤트 관리가 용이하기 때문에 허용.
  * 다만, View의 역할을 다음 두 가지 역할로 한정함으로서 각 처리 간의 복잡성을 피할 수 있다.
    * Model을 받아서 화면 UI를 구축하는 것
    * 이벤트를 발동시키는 것
* UI애니메이션은 Animator나 Timeline 등의 비스크립트 데이터에 의지함으로서 스크립트 작성량을 줄인다.
* 애니메이션이 끝날 때까지 UniTask를 사용하여 기다린다.
* 1화면 1View가 원칙
  * 위의 이유들로 View는 비대해져도 큰 문제가 되지 않기 때문.
*   프로젝트에 따라서는 Model을 직접 View에 전달하지 않고 인터페이스를 통해 전달할 수도 있다. (아래의 경우에 인터페이스화 함을 추천)

    * View나 Model이 여러 화면에서 재사용되는 경우



### 예시 코드

```csharp
public class TestPageView : PageViewBase
{
    [SerializeField] private TextMeshProUGUI _messageText;
    [SerializeField] private Button _nextPageButton;
    [SerializeField] private Button _nextModalButton;
    
    // 버튼은 클릭 이벤트만 공개한다
    public IObservable<Unit> OnClickPage => _nextPageButton.OnClickAsObservable();
    public IObservable<Unit> OnClickModal => _nextModalButton.OnClickAsObservable();

    // Model을 받아 화면 구성하기
    public void SetView(TestPageModel model)
    {
        _messageText.SetText(model.TestMessage);
    }
}
```

* 버튼의 이벤트 처리는 UniRx가 아닌 UniTask의 IUniTaskAyncEnumerable과 ForEachAwaitAsync를 사용하여 구현할 수도 있음.
  * UniTask로 구현할 경우 버튼이 눌렸을 때 통신 처리 등의 비동기 처리가 완료될 때 까지 다음 처리를 하지 않는 등 블로킹에 준하는 처리를 쉽게 구현 가능.
  * UniTask를 사용할 경우 UniTask Tracker로 디버깅이 더 쉬워지기도 함.
  * UniRx/UniTask 중 어느 것을 사용할 것인가는 개발자의 기술이나 지식에 따라 크게 달라짐. (편한 쪽을 선택하면 된다.)

### 참고: UniTask를 이용한 버튼 처리 샘플

```csharp
// View
public IUniTaskAsyncEnumerable<AsyncUnit> OnClickAsync => _button.OnClickAsAsyncEnumerable();

// Presenter
_view.OnClickAsync.ForEachAwaitAsync(async _ =>
{
    // 비동기 처리, 특히 통신 처리 및 화면 전환 처리
    // await ~~
    // 함수 내 처리가 완료될 때까지 다음 처리가 실행되지 않는다.
});
```
