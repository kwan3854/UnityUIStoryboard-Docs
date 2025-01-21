# Lifecycle (presenter)

## 큰 개념

* WillPushEnterAsync 에서 view에서 보이는 부분을 초기화한다.&#x20;
  * 화면이 전환되는 애니메이션 도중에도 빈 화면이 나오거나 잘못된 수치등이 표시되는 일이 없도록하기 위함이다.
  * View에 표시되어야 할 내용은 기본적으로 Model에서 모두 받아와서 Presenter에서 View와 연결시킨다.
  * Model의 데이터 값들은 기본적으로 모두 reactive하게 존재한다.
* DidPushEnter 에서 view의 인터렉티브한 behaviour를 정의한다.
  * DidPushEnter는 모든 전환 애니메이션이 끝난 후 발생한다.
  * 모든 전환 애니메이션이 끝난 후 버튼 이벤트 등의 모든 사용자 액션 처리를 등록하는 이유는:
    * 전환 도중에 사용자가 입력이 가능하면 예기치 못한 상황이 너무 많이 발생한다.
    * 사용자 입장에서는 전환 도중에 버튼 클릭등의 인터렉션이 가능하냐 여부는 중요하지 않다.
    * 사용자 입장에서는 전환 애니메이션 도중에 빈화면이나 덜 완성된 화면이 표시되는 등의 상황이 더 신경쓰이는 부분인데, 이는 WillPushEnterAsync에서 모두 처리하기 때문에 괜찮다.&#x20;

## 완성된 코드

```csharp
[AssetName("MainUI/Modal/SignInModal.prefab")]
public class SignInModalLifecycle : LifecycleModalBase
{
    private string _currentId = string.Empty;
    private string _currentPassword = string.Empty;
    
    private readonly SignInModalView _view;
    private readonly ModalManager _modalManager;
    private readonly ISignInUseCase _signInUseCase;
    private readonly PageEventPublisher _pageEventPublisher;

    [Inject]
    public SignInModalLifecycle(SignInModalView view, ModalManager modalManager, ISignInUseCase signInUseCase, PageEventPublisher pageEventPublisher) : base(view)
    {
        _view = view;
        _modalManager = modalManager;
        _signInUseCase = signInUseCase;
        _pageEventPublisher = pageEventPublisher;
    }

    protected override UniTask WillPushEnterAsync(CancellationToken cancellationToken)
    {
        base.WillPushEnterAsync(cancellationToken);

        var model = new SignInModalModel();
        _view.SetView(model);
        return UniTask.CompletedTask;
    }

    public override void DidPushEnter()
    {
        base.DidPushEnter();
        
        var currentId = string.Empty;
        var currentPassword = string.Empty;
        
        // Disable the sign-in button
        _view.SetSignInButtonInteractable(false);
        
        // ID input event processing
        _view.OnIdInputFieldEditAsync
            .ForEachAwaitAsync(async id =>
            {
                currentId = id;
                UpdateButtonState(currentId, currentPassword);

                await UniTask.CompletedTask;
            })
            .AttachExternalCancellation(ExitCancellationToken)
            .Forget();

        // Password input event processing
        _view.OnPasswordInputFieldEditAsync
            .ForEachAwaitAsync(async password =>
            {
                currentPassword = password;
                UpdateButtonState(currentId, currentPassword);
                
                await UniTask.CompletedTask;
            })
            .AttachExternalCancellation(ExitCancellationToken)
            .Forget();
        
        _view.OnSignInButtonClickedAsync
            .ForEachAwaitAsync(async _ => await OnSignInButtonClicked())
            .AttachExternalCancellation(ExitCancellationToken)
            .Forget();
    }

    // If both id and password are not empty, enable the sign-in button
    private void UpdateButtonState(string id, string password)
    {
        bool isInteractable = !string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(password);
        _view.SetSignInButtonInteractable(isInteractable);
    }

    // When the sign-in button is clicked, send a sign-in request
    private async UniTask OnSignInButtonClicked()
    {
        var logInInfo = _view.GetCurrentInput();
        var response = await _signInUseCase.SignIn(new ISignInUseCase.SignInRequestData(logInInfo.ID, logInInfo.Password));
            
        // If the sign-in is successful, close the modal
        if (response.IsSuccess)
        {
            _pageEventPublisher.SendPushEvent(new EntryPageBuilder(true, true));
            await _modalManager.Pop(true, ExitCancellationToken);
        }
    }
}
```
