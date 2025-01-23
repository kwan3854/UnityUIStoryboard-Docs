# 전체 구조 도표

{% hint style="success" %}
**MVP와 MVVM의 하이브리드 방식을 사용합니다.** MVRP라는 것도 있습니다만, 딱 잘라서 MVRP라고 하기에도 정확한 표현이 아닌 구조를 취하고 있습니다.
{% endhint %}

```mermaid
flowchart TB
    %% Onion Architecture Subgraph
    subgraph 'Onion Architecture'
      direction TB
      CoreDomain[(Core Domain)]
      UseCases((IUseCase - UseCase Layer))
      Repository((IRepository - Repository Layer))
      Gateway((IGateway - Gateway Layer))
    end

    %% UI Subgraph
    subgraph UI_MVRP_Stack['UI MVRP Stack']
      direction TB
      Presenter(Presenter / Lifecycle)
      ViewModel(ViewModel)
      View(View)
    end

    %% Core Domain is the base for the entire architecture, including UI
    CoreDomain -.-> UI_MVRP_Stack

    %% Connections between layers
    CoreDomain --> UseCases
    UseCases --> Repository
    Repository --> Gateway
    
    Presenter --> UseCases
    Presenter --> ViewModel
    Presenter --> View

    %% Notes and Dependency Injection
    classDef interface fill:#f0f0f0,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5,color:#333,font-style:italic;

    %% Apply interface style
    class UseCases,Repository,Gateway interface

    %% Dependency Injection Explanation
    subgraph DependencyInjection["DI (VContainer)"]
      note1[All connections are managed via DI container using VContainer.]
    end
    CoreDomain -.-> DependencyInjection
    UseCases -.-> DependencyInjection
    Repository -.-> DependencyInjection
    Gateway -.-> DependencyInjection
    UI_MVRP_Stack -.-> DependencyInjection
```

