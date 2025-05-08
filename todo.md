
# TODOリスト: CourseFlowバックエンド開発

このTODOリストは `implement.md` に基づいて、CourseFlowアプリケーションのバックエンド開発に必要なタスクをまとめたものです。

## 1. Supabase 設定・構築

### 1.1. Supabaseプロジェクトセットアップ
- [ ] Supabaseプロジェクトを作成
- [ ] 環境変数（APIキーなど）を設定

### 1.2. データベース (Supabase PostgreSQL)
- **Users (ユーザー) テーブル作成**
    - [ ] `id` (UUID, PK, Supabase Auth連携)
    - [ ] `name` (文字列, null許容)
    - [ ] `email` (文字列, null許容, unique, Supabase Auth連携)
    - [ ] `avatarUrl` (文字列, null許容)
    - [ ] `stripeCustomerId` (文字列, null許容)
    - [ ] `activeSubscriptionId` (文字列, null許容)
    - [ ] `subscriptionStatus` (文字列, null許容)
    - [ ] `xp` (整数, default 0)
    - [ ] `level` (整数, default 1)
- **Courses (コース) テーブル作成**
    - [ ] `id` (UUID, PK)
    - [ ] `title` (文字列)
    - [ ] `description` (文字列)
    - [ ] `createdAt` (タイムスタンプ)
    - [ ] `imageUrl` (文字列, null許容)
    - [ ] `mode` (列挙型: `public`, `team`)
    - [ ] `price` (整数, null許容)
    - [ ] `stripeProductId` (文字列, null許容)
    - [ ] `creatorId` (UUID, FK to Users)
    - [ ] `teamId` (UUID, FK to Teams, null許容)
    - [ ] `isPublished` (ブール値)
- **Stages (ステージ) テーブル作成**
    - [ ] `id` (UUID, PK)
    - [ ] `courseId` (UUID, FK to Courses)
    - [ ] `title` (文字列)
    - [ ] `order` (整数)
    - [ ] `fileType` (列挙型: `md`)
    - [ ] `filePath` (文字列, null許容) - Storageパス or `markdownContent`を使用
    - [ ] `markdownContent` (テキスト, null許容)
    - [ ] `xpAward` (整数, default 10)
- **StageLinks (ステージリンク) テーブル作成**
    - [ ] `id` (UUID, PK)
    - [ ] `fromStageId` (UUID, FK to Stages)
    - [ ] `toStageId` (UUID, FK to Stages)
- **UserProgress (ユーザー進捗) テーブル作成**
    - [ ] `id` (UUID, PK)
    - [ ] `userId` (UUID, FK to Users)
    - [ ] `stageId` (UUID, FK to Stages)
    - [ ] `completedAt` (タイムスタンプ)
- **Teams (チーム) テーブル作成**
    - [ ] `id` (UUID, PK)
    - [ ] `name` (文字列)
    - [ ] `description` (文字列, null許容)
    - [ ] `leaderId` (UUID, FK to Users)
    - [ ] `createdAt` (タイムスタンプ)
- **TeamMembers (チームメンバー) テーブル作成**
    - [ ] `teamId` (UUID, FK to Teams, Composite PK)
    - [ ] `userId` (UUID, FK to Users, Composite PK)
    - [ ] `role` (列挙型: `leader`, `editor`, `member`)
- **Subscriptions (サブスクリプション) テーブル作成**
    - [ ] `id` (UUID, PK, Stripe Subscription IDと一致)
    - [ ] `userId` (UUID, FK to Users)
    - [ ] `status` (文字列, Stripe Subscription Status)
    - [ ] `priceId` (文字列, Stripe Price ID)
    - [ ] `currentPeriodEnd` (タイムスタンプ)
    - [ ] `createdAt` (タイムスタンプ)
    - [ ] `updatedAt` (タイムスタンプ)
- [ ] テーブルリレーションシップ設定 (外部キー制約など)
- [ ] Row Level Security (RLS) ポリシーの実装
    - [ ] Usersテーブルへのアクセス制御
    - [ ] Coursesテーブルへのアクセス制御 (公開/チーム、購入状況など)
    - [ ] Stagesテーブルへのアクセス制御
    - [ ] Teamsテーブルへのアクセス制御
    - [ ] UserProgressテーブルへのアクセス制御 (ユーザー自身のみ)
    - [ ] Subscriptionsテーブルへのアクセス制御 (ユーザー自身または管理者)

### 1.3. 認証 (Supabase Authentication)
- [ ] メールアドレスとパスワードによる認証設定
- [ ] (オプション) ソーシャルログイン設定 (Google, GitHubなど)
- [ ] ユーザー登録、ログイン、ログアウト、パスワードリセットのフロントエンド連携部分の確認

### 1.4. ストレージ (Supabase Storage)
- [ ] バケット作成: `course-images` (公開または署名付きURL)
- [ ] バケット作成: `stage-files` (Markdownコンテンツ用、アクセス制御あり)
- [ ] ストレージポリシー設定
    - [ ] `course-images` へのアップロード/ダウンロード権限
    - [ ] `stage-files` へのアクセス権限 (コース購入者/チームメンバーなど)
- [ ] ファイルアップロード/ダウンロード/削除処理のバックエンドロジック (Supabase Functions)

## 2. Stripe支払いシステム連携

### 2.1. Stripe設定
- [ ] Stripeアカウント設定
- [ ] Stripe APIキーをSupabase Secretsに保存
- [ ] Stripe ProductとPriceの作成
    - [ ] 各公開コースのProductとPrice (1回払い)
    - [ ] チームサブスクリプションのProductとPrice (月単位、年単位など)

### 2.2. Stripe Webhook (Supabase Functions)
- [ ] Webhookエンドポイントの作成 (Supabase Function)
- [ ] Webhook署名の検証ロジック実装
- **Webhookハンドラー実装**
    - [ ] `checkout.session.completed`
        - [ ] 公開コース購入: `UserProgress`更新またはアクセステーブル更新、`Courses.price`が0でない場合
        - [ ] チームサブスクリプション開始: `Subscriptions`テーブル作成/更新、`Users.stripeCustomerId`, `Users.activeSubscriptionId`, `Users.subscriptionStatus`更新
    - [ ] `invoice.payment_succeeded`
        - [ ] 定期サブスクリプション支払い: `Subscriptions.currentPeriodEnd`更新
    - [ ] `customer.subscription.updated`
        - [ ] サブスクリプション変更: `Subscriptions`テーブル更新
    - [ ] `customer.subscription.deleted`
        - [ ] サブスクリプションキャンセル: `Subscriptions.status`更新、`Users.activeSubscriptionId`, `Users.subscriptionStatus`更新、チーム機能無効化
- [ ] Webhookハンドラーの冪等性確保

### 2.3. バックエンドロジック (Supabase Functions)
- **公開コース購入フロー**
    - [ ] 購入開始API (Stripe Checkout Session作成)
    - [ ] フロントエンドからのリクエストに応じてCheckout Session IDを返す
- **チームサブスクリプションフロー**
    - [ ] サブスクリプション開始API (Stripe Checkout Session作成)
    - [ ] フロントエンドからのリクエストに応じてCheckout Session IDを返す
- **サブスクリプション管理API (オプション)**
    - [ ] StripeカスタマーポータルへのリダイレクトAPI
- **アクセス制御ロジック**
    - [ ] 公開コースアクセス可否判定 (購入済みか、または無料コースか)
    - [ ] チーム機能利用可否判定 (`Users.subscriptionStatus` または `Subscriptions`テーブル確認)
- **経験値とレベル管理ロジック**
    - [ ] ステージ完了時に`UserProgress`作成/更新
    - [ ] `Users.xp` を `Stages.xpAward` に基づいて加算
    - [ ] `Users.level` を `Users.xp` に基づいて更新

## 3. フロントエンド連携・調整
- [ ] 認証状態に応じたUI表示制御
- [ ] 購入ボタン/サブスクリプションボタンの実装
- [ ] Stripe Checkoutへのリダイレクト処理
- [ ] コースアクセス制御のUI反映
- [ ] チーム機能の表示/非表示制御 (サブスクリプション状態による)
- [ ] ユーザープロファイルでのXPとレベル表示

## 4. テストとデプロイ
- [ ] Stripeテストモードでの支払いフローテスト
- [ ] Supabase開発環境での機能テスト
- [ ] エラーハンドリングのテスト
- [ ] セキュリティテスト (RLS、Webhook保護など)
- [ ] 本番環境へのデプロイ準備

## 5. ドキュメント
- [ ] APIエンドポイントのドキュメント作成 (必要な場合)
- [ ] 運用手順のドキュメント作成 (Stripe設定、Supabase管理など)

---

このTODOリストは初期のものです。開発の進行に応じてタスクの追加、変更、詳細化を行ってください。
期限や担当者を設定すると、より効果的なプロジェクト管理が可能です。
