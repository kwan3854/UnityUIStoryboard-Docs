# View

{% hint style="warning" %}
View 코드는 반드시 `Page`/`Modal` 마다 하나씩 작성합니다.&#x20;
{% endhint %}

## SerializeField로 레퍼런스 가져오기

```csharp
[SerializeField] private TMPro.TMP_InputField idInputField;
[SerializeField] private TMPro.TMP_InputField passwordInputField;
[SerializeField] private Button signInButton;
```

* ID 입력 필드
* PW 입력 필드
* 로그인 버튼

의 레퍼런스를 가져옵니다.

## UniTask를 이용한 이벤트 노출

```csharp
public IUniTaskAsyncEnumerable<AsyncUnit> OnSignInButtonClickedAsync => signInButton.OnClickAsAsyncEnumerable();
public IUniTaskAsyncEnumerable<string> OnIdInputFieldEditAsync => idInputField.OnValueChangedAsAsyncEnumerable();
public IUniTaskAsyncEnumerable<string> OnPasswordInputFieldEditAsync => passwordInputField.OnValueChangedAsAsyncEnumerable();
```

* IUniTaskAsyncEnumerable 을 이용해서 이벤트를 노출해 줍니다.
  * IUniTaskAsyncEnumerable 을 이용하면 입력 버퍼를 통해 입력을 처리하거나, 입력이 처리되는 동안 중복된 입력을 무시하는 등의 처리가 간편해지고 가독성이 좋은 코드가 작성되는 장점이 있습니다.
* 이것들은 Liftcycle(presenter) 측에서 사용하게 됩니다.

## 기타 Lifecycle 측에서 사용할 메서드

```csharp
// 뷰의 초기화에 사용됩니다. Lifecycle 측으로부터 모델을 입력받아 view의 초기 표현에 사용됩니다.
public void SetView(SignInModalModel model)

// 로그인 버튼의 활성화 여부를 조절하는데 사용됩니다.
public void SetSignInButtonInteractable(bool isInteractable)

// 현재 뷰의 ID/PW 입력 정보를 반환합니다.
public LogInInfo GetCurrentInput()
```

## 완성된 코드

```csharp
public class SignInModalView : ModalViewBase
    {
        [SerializeField] private TMPro.TMP_InputField idInputField;
        [SerializeField] private TMPro.TMP_InputField passwordInputField;
        [SerializeField] private Button signInButton;
    
        public IUniTaskAsyncEnumerable<AsyncUnit> OnSignInButtonClickedAsync => signInButton.OnClickAsAsyncEnumerable();
        public IUniTaskAsyncEnumerable<string> OnIdInputFieldEditAsync => idInputField.OnValueChangedAsAsyncEnumerable();
        public IUniTaskAsyncEnumerable<string> OnPasswordInputFieldEditAsync => passwordInputField.OnValueChangedAsAsyncEnumerable();
        
        public void SetView(SignInModalModel model)
        {
            // 예시에서는 작성하지 않았습니다만,
            // 뷰의 초기화 정보를 받아 화면에 뿌려주는 역할을 하게 됩니다.
            // 예) ID/PW의 PlaceHolder text, 안내 메시지 등등... 을 구현하면 괜찮겠네요.
        }

        public void SetSignInButtonInteractable(bool isInteractable)
        {
            signInButton.interactable = isInteractable;
        }

        public LogInInfo GetCurrentInput()
        {
            return new LogInInfo(idInputField.text, passwordInputField.text);
        }
    }

    public class LogInInfo
    {
        public string ID { get; private set; }
        public string Password { get; private set; }
        
        public LogInInfo(string id, string password)
        {
            ID = id;
            Password = password;
        }
    }
```
