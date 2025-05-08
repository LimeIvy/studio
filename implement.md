# 実装要件

このドキュメントでは、データベース、認証、ストレージ、そしてStripeベースの支払いシステムに焦点を当て、アプリケーションのバックエンド要件の概要を説明します。

## 1. データベース要件 (Supabase PostgreSQL)

### エンティティ
*   **Users (ユーザー)**:
    *   `id` (UUID, 主キー - Supabase AuthのユーザーIDと連携)
    *   `name` (文字列, null許容)
    *   `email` (文字列, null許容, ユニークインデックス - Supabase Authから取得)
    *   `avatarUrl` (文字列, null許容)
    *   `stripeCustomerId` (文字列, null許容, Stripe顧客ID連携用)
    *   `activeSubscriptionId` (文字列, null許容, StripeサブスクリプションID連携用)
    *   `subscriptionStatus` (文字列, null許容, 例: 'active', 'canceled', 'past_due')
    *   *その他のメタデータ (例: 登録日 - Supabase Authが管理)*
*   **Courses (コース)**:
    *   `id` (UUID, 主キー)
    *   `title` (文字列)
    *   `description` (文字列)
    *   `createdAt` (タイムスタンプ)
    *   `imageUrl` (文字列, null許容 - Supabase Storageのパス)
    *   `mode` (列挙型: `public`, `team`)
    *   `price` (整数, null許容 - 公開コースのみ、Stripe Price IDと連携することも検討)
    *   `stripeProductId` (文字列, null許容 - 公開コースのStripe Product ID)
    *   `creatorId` (UUID, Usersへの外部キー)
    *   `teamId` (UUID, Teamsへの外部キー, null許容 - チームコースのみ)
    *   `isPublished` (ブール値)
*   **Stages (ステージ)**:
    *   `id` (UUID, 主キー)
    *   `courseId` (UUID, Coursesへの外部キー)
    *   `title` (文字列)
    *   `order` (整数)
    *   `fileType` (列挙型: `md`, `pdf`)
    *   `filePath` (文字列, null許容 - `md`の場合は直接コンテンツ、`pdf`の場合はSupabase Storageのパス)
    *   `markdownContent` (テキスト, null許容 - `md`ファイルタイプの場合のコンテンツ)
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
*   **Subscriptions (サブスクリプション)**: (Stripeとの連携情報を格納)
    *   `id` (UUID, 主キー, Stripe Subscription IDと一致させる)
    *   `userId` (UUID, Usersへの外部キー)
    *   `status` (文字列, Stripe Subscription Status)
    *   `priceId` (文字列, Stripe Price ID)
    *   `currentPeriodEnd` (タイムスタンプ)
    *   `createdAt` (タイムスタンプ)
    *   `updatedAt` (タイムスタンプ)

### リレーションシップ
*   1対多: `Users` と `Courses` (creator)
*   1対多: `Users` と `TeamMembers`
*   1対多: `Courses` と `Stages`
*   1対多: `Stages` と `StageLinks` (fromStageId と toStageId)
*   1対多: `Users` と `UserProgress`
*   1対多: `Stages` と `UserProgress`
*   1対多: `Teams` と `TeamMembers`
*   1対多: `Teams` と `Courses` (teamId)
*   1対1: `Users` と `Subscriptions` (ユーザーごとにアクティブなチームサブスクリプションは1つと仮定)

### データベース技術
*   **Supabase PostgreSQL** を使用します。
    *   Supabaseの組み込み機能 (RLS - Row Level Security) を活用して、データアクセス制御を実装します。

## 2. 認証要件 (Supabase Authentication)

*   **Supabase Authentication** を使用してユーザー認証を管理します。
    *   メールアドレスとパスワードによる認証。
    *   (オプション) Google, GitHubなどのソーシャルログイン。
*   ユーザー登録、ログイン、ログアウト、パスワードリセットなどの基本的な認証フローを実装します。
*   認証されたユーザー情報は、Supabaseの`auth.users`テーブルに格納され、アプリケーションの`Users`テーブル (公開スキーマの`profiles`テーブルなど) と`id`で連携します。

## 3. ストレージ要件 (Supabase Storage)

*   **Supabase Storage** を使用してファイルストレージを管理します。
    *   **コースカバー画像**: `Courses.imageUrl` に保存されるパスは、Supabase Storage内の画像ファイルを指します。公開バケットまたは署名付きURLを利用します。
    *   **ステージファイル (PDF)**: `Stages.fileType === 'pdf'` の場合、`Stages.filePath` はSupabase Storage内のPDFファイルを指します。アクセス制御されたバケット（例: 認証済みユーザーのみ、またはコース購入者/チームメンバーのみアクセス可能）を使用します。
    *   **ステージファイル (Markdown)**: `Stages.fileType === 'md'` の場合、コンテンツは`Stages.markdownContent`に直接保存するか、オプションとして`.md`ファイルをSupabase Storageに保存し`Stages.filePath`で参照することも可能です。
*   ファイルのアップロード、ダウンロード、削除処理を実装します。
*   Supabase Storageのポリシーを活用して、ファイルへのアクセス権限を適切に管理します (例: ユーザー自身のアップロードしたファイル、チームメンバー限定のファイルなど)。

## 4. Stripe支払いシステム

### 支払い階層

*   **スタンダードティア (公開コース)**:
    *   ユーザーが個別の公開コースを購入できるようにします。
    *   バックエンドで処理する必要があるもの:
        *   価格付きの各公開コースに対するStripe「Product」および「Price」の作成。`Courses`テーブルに`stripeProductId`を保存。
        *   ユーザーがコースを購入しようとしたときのStripe「Checkout Session」の作成。
        *   支払い成功時の購入処理 (Supabase上でユーザーにコースへのアクセス権付与。`UserCourseAccess`のような中間テーブルも検討可)。
*   **チームティア (チーム機能)**:
    *   チーム関連機能 (チーム作成、チームコース作成など) を有効にします。
    *   Stripe Subscriptionsを利用します。
        *   チームサブスクリプション用のStripe「Product」および「Price」(例: 月単位、年単位) の作成。
        *   サブスクリプション登録のためのStripe「Checkout Session」の作成。
        *   定期的な支払いの管理。
        *   サブスクリプションキャンセルの処理。
        *   支払い成功後、Supabaseの`Users`テーブルまたは`Subscriptions`テーブルにサブスクリプション情報を記録し、ユーザーのチーム機能利用権限を更新。

### Stripe Webhook

*   非同期イベントを処理するためにStripe Webhookを実装します (Supabase Functionsでエンドポイントを作成することを推奨):
    *   `checkout.session.completed`:
        *   公開コース購入の場合: 購入処理を行い、Supabaseデータベースでユーザーにコースアクセス権を付与。
        *   チームサブスクリプションの場合: Supabaseの`Subscriptions`テーブルにレコードを作成/更新し、`Users`テーブルの`subscriptionStatus`などを更新。
    *   `invoice.payment_succeeded`: 定期的なサブスクリプション支払いの確認。Supabaseの`Subscriptions`テーブルの`currentPeriodEnd`などを更新。
    *   `customer.subscription.updated`: サブスクリプションの変更 (アップグレード、ダウングレードなど) を処理。Supabaseの`Subscriptions`テーブルを更新。
    *   `customer.subscription.deleted`: サブスクリプションキャンセルの処理。Supabaseの`Subscriptions`テーブルのステータスを更新し、関連するチーム機能を無効化。

### バックエンドロジック (Supabase Functionsを推奨)

1.  **公開コース購入**:
    *   ユーザーが購入を開始。
    *   バックエンド (Supabase Function) が特定のコースのStripe Product IDとPrice IDに対するStripe Checkout Sessionを作成。
    *   ユーザーは支払いを完了するためにStripeにリダイレクト。
    *   支払い成功時 (Webhook経由):
        *   Supabaseデータベースでユーザーにコースへのアクセス権を付与 (例: `UserProgress`に最初のステージのレコード作成準備、あるいは専用のアクセステーブル更新)。
2.  **チームサブスクリプション**:
    *   ユーザーがチームサブスクリプションを開始。
    *   バックエンド (Supabase Function) がチームサブスクリプションProduct/Priceに対するStripe Checkout Sessionを作成。
    *   ユーザーはサブスクリプション設定を完了するためにStripeにリダイレクト。
    *   サブスクリプション成功時 (Webhook経由):
        *   Supabaseの`Users`テーブルに`stripeCustomerId`を保存。
        *   Supabaseの`Subscriptions`テーブルにレコードを作成/更新。
        *   ユーザーのチーム関連機能 (チーム作成、チームハブアクセス) を有効化。
3.  **サブスクリプションキャンセル/変更**:
    *   ユーザーがStripeまたはアプリケーション経由でサブスクリプションを操作。
    *   StripeがWebhook (例: `customer.subscription.deleted`, `customer.subscription.updated`) を送信。
    *   バックエンド (Supabase Function):
        *   Supabaseの`Subscriptions`テーブルと`Users`テーブルの関連情報を更新。
        *   必要に応じてチーム関連機能へのアクセス権限を変更。
4.  **アクセス制御**:
    *   アプリケーションロジック (Supabase RLSポリシーと併用) で以下を確認:
        *   アクセスを許可する前に、ユーザーが特定の公開コースを購入したかどうか (または無料コースか)。
        *   チーム関連機能を利用する前に、ユーザーがアクティブなチームサブスクリプションを持っているかどうか (`Users.subscriptionStatus` または `Subscriptions`テーブルを確認)。

### Stripe APIキー

*   Stripe APIキーをSupabaseの環境変数 (Secrets) に安全に保存します。

### 重要な考慮事項

*   **セキュリティ**: Stripe APIキーとWebhookを安全に処理します。Supabase Functionsのエンドポイントを保護し、Webhook署名を検証します。
*   **エラー処理**: 支払い失敗とWebhook処理のための堅牢なエラー処理を実装します。
*   **スケーラビリティ**: SupabaseとStripeはスケーラブルなサービスですが、関数やデータベースクエリの設計に注意します。
*   **テスト**: 本番環境にデプロイする前に、StripeのテストモードとSupabaseのステージング環境 (または開発環境) で支払いシステムを徹底的にテストします。
*   **コンプライアンス**: StripeがPCI DSS準拠の大部分を処理しますが、アプリケーション側でもセキュアなデータ取り扱いを心がけます。
*   **冪等性**: Webhookハンドラー (Supabase Functions) が冪等であることを確認し、イベントの重複処理を防ぎます。

この `implement.md` は、SupabaseとStripeをバックエンドとして使用するアプリケーションの構築に向けた出発点となります。特定の機能要件や設計判断に応じて、詳細をさらに具体化する必要があります。