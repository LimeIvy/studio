# 実装要件

このドキュメントでは、データベースとStripeベースの支払いシステムに焦点を当て、アプリケーションのバックエンド要件の概要を説明します。

## 1. データベース要件

### エンティティ
*   **Users (ユーザー)**:
    *   `id` (UUID, 主キー)
    *   `name` (文字列, null許容)
    *   `email` (文字列, null許容, ユニークインデックス)
    *   `avatarUrl` (文字列, null許容)
    *   *その他の標準的なユーザーフィールド (例: パスワードハッシュ, 登録日)*
*   **Courses (コース)**:
    *   `id` (UUID, 主キー)
    *   `title` (文字列)
    *   `description` (文字列)
    *   `createdAt` (タイムスタンプ)
    *   `imageUrl` (文字列, null許容)
    *   `mode` (列挙型: `public`, `team`)
    *   `price` (整数, null許容 - 公開コースのみ)
    *   `creatorId` (UUID, Usersへの外部キー)
    *   `teamId` (UUID, Teamsへの外部キー, null許容 - チームコースのみ)
    *   `isPublished` (ブール値)
*   **Stages (ステージ)**:
    *   `id` (UUID, 主キー)
    *   `courseId` (UUID, Coursesへの外部キー)
    *   `title` (文字列)
    *   `order` (整数)
    *   `fileType` (列挙型: `md`, `pdf`)
    *   `filePath` (文字列)
    *   `markdownContent` (テキスト, null許容)
*   **StageLinks (ステージリンク)**:
    *   `id` (UUID, 主キー)
    *   `fromStageId` (UUID, Stagesへの外部キー)
    *   `toStageId` (UUID, Stagesへの外部キー)
*   **UserProgress (ユーザー進捗)**:
    *   `id` (UUID, 主キー)
    *   `userId` (UUID, Usersへの外部キー)
    *   `stageId` (UUID, Stagesへの外部キー)
    *   `completedAt` (タイムスタンプ)
*   **Teams (チーム)**:
    *   `id` (UUID, 主キー)
    *   `name` (文字列)
    *   `description` (文字列, null許容)
    *   `leaderId` (UUID, Usersへの外部キー)
    *   `createdAt` (タイムスタンプ)
*   **TeamMembers (チームメンバー)**:
    *   `teamId` (UUID, Teamsへの外部キー, 複合主キーの一部)
    *   `userId` (UUID, Usersへの外部キー, 複合主キーの一部)
    *   `role` (列挙型: `leader`, `editor`, `member`)

### リレーションシップ
*   1対多: `Users` と `Courses` (creator)
*   1対多: `Users` と `TeamMembers`
*   1対多: `Courses` と `Stages`
*   1対多: `Stages` と `StageLinks` (fromStageId と toStageId)
*   1対多: `Users` と `UserProgress`
*   1対多: `Stages` と `UserProgress`
*   1対多: `Teams` と `TeamMembers`
*   1対多: `Teams` と `Courses` (teamId)

### データベース技術
*   リレーショナルデータにはPostgreSQLまたはMySQLの使用を検討してください。
*   Firebaseを使用しているため、Firebase Firestoreも選択肢の一つです。

## 2. Stripe支払いシステム

### 支払い階層

*   **スタンダードティア (公開コース)**:
    *   ユーザーが個別の公開コースを購入できるようにします。
    *   バックエンドで処理する必要があるもの:
        *   価格付きの各公開コースに対するStripe「Product」の作成。
        *   ユーザーがコースを購入しようとしたときのStripe「Checkout Session」の作成。
        *   支払い成功時の購入処理 (コースへのアクセス権付与)。
*   **チームティア (チーム機能)**:
    *   チーム関連機能 (チーム作成、チームコース作成など) を有効にします。
    *   Stripe Subscriptionsを利用します。
        *   チームサブスクリプション用のStripe「Product」の作成。
        *   異なる請求間隔 (例: 月単位, 年単位) のためのStripe「Price」の作成。
        *   サブスクリプション登録のためのStripe「Checkout Session」の作成。
        *   定期的な支払いの管理。
        *   サブスクリプションキャンセルの処理。

### Stripe Webhook

*   非同期イベントを処理するためにStripe Webhookを実装します:
    *   `checkout.session.completed`: 公開コース購入の処理またはチームサブスクリプション設定の開始。
    *   `invoice.payment_succeeded`: 定期的なサブスクリプション支払いの確認。
    *   `customer.subscription.deleted`: サブスクリプションキャンセルの処理 (チーム機能の無効化)。

### バックエンドロジック

1.  **公開コース購入**:
    *   ユーザーが購入を開始します。
    *   バックエンドが特定のコース「Product」に対するStripe Checkout Sessionを作成します。
    *   ユーザーは支払いを完了するためにStripeにリダイレクトされます。
    *   支払い成功時 (Webhook経由):
        *   データベースでユーザーにコースへのアクセス権を付与します。
2.  **チームサブスクリプション**:
    *   ユーザーがチームサブスクリプションを開始します。
    *   バックエンドがチームサブスクリプション「Product」に対するStripe Checkout Sessionを作成します。
    *   ユーザーはサブスクリプション設定を完了するためにStripeにリダイレクトされます。
    *   サブスクリプション成功時 (Webhook経由):
        *   データベースでユーザー/関連アカウントのチーム関連機能を有効にします (`Subscription`レコードを作成)。
        *   このユーザーに他の購入に使用できるクレジットなどの追加の権限を付与する必要がある場合は、ここで割り当てます。
3.  **サブスクリプションキャンセル**:
    *   ユーザーがStripeまたはアプリケーション経由でサブスクリプションをキャンセルします。
    *   Stripeが `customer.subscription.deleted` Webhookを送信します。
    *   バックエンド:
        *   データベースでチーム関連機能を無効にします。
        *   ユーザーのチーム作成、チームコース作成などを無効にします。
4.  **アクセス制御**:
    *   アプリケーションロジックで以下を確認します:
        *   アクセスを許可する前に、ユーザーが特定の公開コースを購入したかどうか。
        *   チーム関連機能を有効にする前に、ユーザーがアクティブなチームサブスクリプションを持っているかどうか。

### Stripe APIキー

*   Stripe APIキーをバックエンドの環境変数に安全に保存します。

### 重要な考慮事項

*   **セキュリティ**: Stripe APIキーとWebhookを安全に処理します。改ざんを防ぐためにWebhook署名を検証します。
*   **エラー処理**: 支払い失敗とWebhook処理のための堅牢なエラー処理を実装します。
*   **スケーラビリティ**: ユーザーベースとコース提供の増加に合わせて支払いシステムを設計します。
*   **テスト**: 本番環境にデプロイする前に、ステージング環境で支払いシステムを徹底的にテストします。
*   **コンプライアンス**: 実装がPCI DSS標準に準拠していることを確認します。
*   **冪等性**: イベントの重複処理を防ぐために、Webhookハンドラーが冪等であることを確認します。

この `implement.md` は、必要なバックエンド機能を実装するための出発点となります。特定のニーズや技術選択に基づいて適応させる必要があります。
