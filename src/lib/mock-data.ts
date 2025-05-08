
import type { Course, Stage, StageLink, UserProgress, User } from './types';

export const mockUser: User = {
  id: 'user-123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
};

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Unity入門',
    description: 'Unityの基本を学び、簡単なゲームを作成します。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/unity/600/400',
    totalStages: 8, 
    completedStages: 1,
  },
  {
    id: 'course-2',
    title: 'Ruby入門',
    description: 'Rubyプログラミングの基礎からWebアプリケーション開発まで。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/ruby/600/400',
    totalStages: 4,
    completedStages: 0,
  },
  {
    id: 'course-3',
    title: 'Next.js と Firebase',
    description: 'モダンなWebアプリケーション開発を実践的に学びます。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/nextjs/600/400',
    totalStages: 5,
    completedStages: 3,
  },
];

export const mockStages: Stage[] = [
  // Unity入門 Stages
  {
    id: 'stage-1-1',
    course_id: 'course-1',
    title: 'Unityとは？',
    markdownContent: `
# Unityとは？

Unityは、リアルタイム3Dコンテンツを作成・運用するための世界をリードするプラットフォームです。ゲーム開発者からアーティスト、建築家、自動車デザイナー、映画制作者まで、さまざまなクリエイターがUnityを利用しています。

## 主な特徴
- クロスプラットフォーム対応 (PC, モバイル, コンソールなど)
- 強力なエディタとツール
- アセットストアによる豊富なリソース
- アクティブなコミュニティ

## このステージの目標
- Unityの概要を理解する
- Unity HubとUnity Editorの役割を知る
`,
    order: 1,
    position: { x: 50, y: 50 },
  },
  {
    id: 'stage-1-2',
    course_id: 'course-1',
    title: '最初のプロジェクト作成',
    markdownContent: `
# 最初のプロジェクト作成

Unity Hubを起動し、新しいプロジェクトを作成しましょう。

## 手順
1. Unity Hubを開く
2. 「プロジェクト」タブで「新規作成」をクリック
3. テンプレートとして「3D」を選択
4. プロジェクト名（例: MyFirstUnityGame）と保存場所を指定
5. 「作成」ボタンをクリック

しばらく待つと、Unity Editorが起動し、新しいプロジェクトが開きます。

\`\`\`csharp
// C#スクリプトの例
using UnityEngine;

public class HelloWorld : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Hello, Unity World!");
    }
}
\`\`\`
`,
    order: 2,
    position: { x: 250, y: 50 },
  },
  {
    id: 'stage-1-3',
    course_id: 'course-1',
    title: '基本操作とインターフェース',
    markdownContent: `
# 基本操作とインターフェース

Unity Editorの主要なウィンドウと基本操作に慣れましょう。

## 主要ウィンドウ
- **Sceneビュー**: ゲームのシーンを視覚的に構築する場所
- **Gameビュー**: プレイヤーが見るゲーム画面のプレビュー
- **Hierarchyウィンドウ**: シーン内の全ゲームオブジェクトのリスト
- **Projectウィンドウ**: プロジェクトのアセット（スクリプト、テクスチャ等）を管理
- **Inspectorウィンドウ**: 選択したオブジェクトやアセットの詳細設定

_このステージを完了すると、Unityの基本的な使い方が身につきます。_
`,
    order: 3,
    position: { x: 450, y: 50 },
  },
  {
    id: 'stage-1-4',
    course_id: 'course-1',
    title: 'ゲームオブジェクトとコンポーネント',
    markdownContent: `
# ゲームオブジェクトとコンポーネント

Unityの基本的な構成要素であるゲームオブジェクトとコンポーネントについて学びます。

## ゲームオブジェクト (GameObject)
- シーン内に配置されるすべての「モノ」の基本単位。
- 例:キャラクター、ライト、カメラ、地形など。
- それ自体は空のコンテナのようなもので、機能はコンポーネントによって追加されます。

## コンポーネント (Component)
- ゲームオブジェクトに機能を追加する部品。
- 例: Transform (位置・回転・拡縮), Mesh Renderer (見た目), Rigidbody (物理挙動), Script (カスタムロジック)。
- 1つのゲームオブジェクトに複数のコンポーネントをアタッチできます。

\`\`\`csharp
// スクリプトもコンポーネントの一種
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 5.0f;

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        transform.Translate(Vector3.right * horizontalInput * speed * Time.deltaTime);
    }
}
\`\`\`
`,
    order: 4,
    position: { x: 650, y: 50 },
  },
  {
    id: 'stage-1-5',
    course_id: 'course-1',
    title: 'プレハブの活用',
    markdownContent: `
# プレハブの活用

プレハブ (Prefab) は、再利用可能なゲームオブジェクトのテンプレートです。

## プレハブのメリット
- **効率化**: 同じ設定のオブジェクトを多数配置する場合に便利。
- **一括編集**: プレハブ本体を編集すると、シーン内のすべてのインスタンスに反映。
- **動的生成**: スクリプトからゲーム中にオブジェクトを生成可能。

## 作成方法
1. HierarchyウィンドウでゲームオブジェクトをProjectウィンドウにドラッグ＆ドロップ。
2. Projectウィンドウに青い立方体のアイコンで表示されればプレハブ化完了。

## プレハブのインスタンス化
\`\`\`csharp
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject enemyPrefab; // Inspectorでプレハブをセット
    public Transform spawnPoint;

    void Start()
    {
        Instantiate(enemyPrefab, spawnPoint.position, spawnPoint.rotation);
    }
}
\`\`\`
`,
    order: 5,
    position: { x: 50, y: 200 }, 
  },
  {
    id: 'stage-1-6',
    course_id: 'course-1',
    title: 'マテリアルとテクスチャ',
    markdownContent: `
# マテリアルとテクスチャ

オブジェクトの見た目を定義するマテリアルとテクスチャについて学びます。

## テクスチャ (Texture)
- オブジェクトの表面に貼り付ける画像ファイル (例: .png, .jpg)。
- 色、模様、細部のディテールなどを表現。

## マテリアル (Material)
- オブジェクトの表面がどのようにレンダリングされるかを定義するアセット。
- シェーダー、テクスチャ、色、その他のプロパティ（反射率、滑らかさなど）を組み合わせる。
- 1つのマテリアルを複数のオブジェクトに適用可能。

### 作成と適用
1. Projectウィンドウで右クリック > Create > Material。
2. Inspectorウィンドウでシェーダーを選択し、テクスチャや色を設定。
3. 作成したマテリアルをシーン内のオブジェクトにドラッグ＆ドロップ。
`,
    order: 6,
    position: { x: 250, y: 200 },
  },
  {
    id: 'stage-1-7',
    course_id: 'course-1',
    title: 'ライティングの基礎',
    markdownContent: `
# ライティングの基礎

シーンの雰囲気を決定づけるライティングについて学びます。

## 主要なライトの種類
- **Directional Light**: 太陽光のように、シーン全体を均一な方向から照らす。
- **Point Light**: 電球のように、一点から全方向に光を放つ。
- **Spot Light**: スポットライトのように、特定の方向を円錐状に照らす。
- **Area Light** (Baked Only): 面光源。リアルな間接光の表現に。

## ライティング設定
- **Mode**: Realtime, Baked, Mixed を選択可能。パフォーマンスと品質のトレードオフ。
- **Intensity**: 光の強さ。
- **Color**: 光の色。
- **Shadow Type**: 影の有無や種類 (No Shadows, Hard Shadows, Soft Shadows)。

リアルタイムライティングは動的ですが処理負荷が高く、ベイクドライティングは静的ですが高品質な影や間接光を低負荷で表現できます。
`,
    order: 7,
    position: { x: 450, y: 200 },
  },
  {
    id: 'stage-1-8',
    course_id: 'course-1',
    title: 'UIの基本 (Canvas)',
    markdownContent: `
# UIの基本 (Canvas)

ゲームのユーザーインターフェース (UI) を作成するためのCanvasシステムについて学びます。

## Canvas
- すべてのUI要素を配置する領域。
- **Render Mode**:
    - **Screen Space - Overlay**: 画面の一番手前に描画。
    - **Screen Space - Camera**: 指定したカメラからの距離に基づいて描画。3D空間にUIを配置する際に使用。
    - **World Space**: シーン内の他の3Dオブジェクトと同様に扱われる。

## UI要素の例
- **Text / TextMeshPro**: 文字列を表示。
- **Image**: 画像を表示。
- **Button**: クリック可能なボタン。
- **Slider**: スライダー。
- **Panel**: 他のUI要素をグループ化するための背景。

### 作成方法
Hierarchyウィンドウで右クリック > UI > (作成したいUI要素) を選択。
Canvasがなければ自動的に作成されます。
`,
    order: 8,
    position: { x: 650, y: 200 },
  },

  // Ruby入門 Stages
  {
    id: 'stage-2-1',
    course_id: 'course-2',
    title: 'Rubyの概要と環境構築',
    markdownContent: `
# Rubyの概要と環境構築

Rubyは、まつもとゆきひろ氏によって開発されたオブジェクト指向スクリプト言語です。

## 特徴
- シンプルで読みやすい構文
- 強力なメタプログラミング機能
- Ruby on Railsなどの有名なフレームワーク

## 環境構築
- **Windows**: RubyInstallerを使用
- **macOS**: rbenv や asdf を推奨
- **Linux**: rbenv や RVM、またはディストリビューションのパッケージマネージャ

[Ruby公式サイト](https://www.ruby-lang.org/)
`,
    order: 1,
    position: { x: 50, y: 350 }, 
  },
  {
    id: 'stage-2-2',
    course_id: 'course-2',
    title: '基本的な構文',
    markdownContent: `
# 基本的な構文

Rubyの基本的な文法要素を学びましょう。

## 変数と定数
\`\`\`ruby
message = "Hello, Ruby!" # 変数
PI = 3.14159            # 定数 (大文字で始まる)
\`\`\`

## 条件分岐
\`\`\`ruby
score = 85
if score >= 80
  puts "Great!"
elsif score >= 60
  puts "Good."
else
  puts "Keep trying."
end
\`\`\`

## ループ
\`\`\`ruby
5.times do |i|
  puts "Iteration: #{i}"
end

fruits = ["apple", "banana", "cherry"]
fruits.each do |fruit|
  puts fruit
end
\`\`\`
`,
    order: 2,
    position: { x: 250, y: 350 }, 
  },
  {
    id: 'stage-2-3',
    course_id: 'course-2',
    title: 'メソッドとクラス',
    markdownContent: `
# メソッドとクラス

Rubyは純粋なオブジェクト指向言語です。メソッドとクラスの概念を理解しましょう。

## メソッド定義
\`\`\`ruby
def greet(name)
  "Hello, #{name}!"
end

puts greet("Alice") # => Hello, Alice!
\`\`\`

## クラス定義
\`\`\`ruby
class Dog
  def initialize(name)
    @name = name
  end

  def bark
    "#{@name} says Woof!"
  end
end

my_dog = Dog.new("Buddy")
puts my_dog.bark # => Buddy says Woof!
\`\`\`
`,
    order: 3,
    position: { x: 450, y: 350 }, 
  },
   {
    id: 'stage-2-4',
    course_id: 'course-2',
    title: 'ブロックとイテレータ',
    markdownContent: `
# ブロックとイテレータ

Rubyの強力な機能であるブロックとイテレータについて学びます。

## ブロック
ブロックは \`do...end\` または \`{...}\` で囲まれたコードの塊です。メソッドに渡して処理をカスタマイズできます。
\`\`\`ruby
[1, 2, 3].each do |number|
  puts number * 2
end
# Output:
# 2
# 4
# 6

[1, 2, 3].map { |n| n * n } # => [1, 4, 9]
\`\`\`

## イテレータ
イテレータはブロックを受け取り、コレクションの各要素に対してそのブロックを実行するメソッドです。
\`each\`, \`map\`, \`select\`, \`reject\` などが代表的なイテレータです。

\`\`\`ruby
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = numbers.select { |n| n.even? }
puts even_numbers.inspect # => [2, 4, 6]
\`\`\`
`,
    order: 4,
    position: { x: 650, y: 350 }, 
  },
  // Next.js と Firebase Stages (Placeholder)
  {
    id: 'stage-3-1',
    course_id: 'course-3',
    title: 'Next.jsプロジェクトセットアップ',
    markdownContent: '# Next.jsプロジェクトセットアップ\n\nNext.jsプロジェクトの初期設定方法を学びます。',
    order: 1,
    position: { x: 50, y: 500 },
  },
  {
    id: 'stage-3-2',
    course_id: 'course-3',
    title: 'Firebaseプロジェクト連携',
    markdownContent: '# Firebaseプロジェクト連携\n\nFirebaseプロジェクトを作成し、Next.jsアプリと連携します。',
    order: 2,
    position: { x: 250, y: 500 },
  },
  {
    id: 'stage-3-3',
    course_id: 'course-3',
    title: 'Firestoreデータ操作',
    markdownContent: '# Firestoreデータ操作\n\nFirestoreデータベースの基本的なCRUD操作を学びます。',
    order: 3,
    position: { x: 450, y: 500 },
  },
  {
    id: 'stage-3-4',
    course_id: 'course-3',
    title: 'Firebase Authentication',
    markdownContent: '# Firebase Authentication\n\nFirebase Authenticationを用いたユーザー認証機能を実装します。',
    order: 4,
    position: { x: 650, y: 500 },
  },
  {
    id: 'stage-3-5',
    course_id: 'course-3',
    title: 'Firebase Hostingデプロイ',
    markdownContent: '# Firebase Hostingデプロイ\n\n作成したアプリケーションをFirebase Hostingにデプロイします。',
    order: 5,
    position: { x: 50, y: 650 },
  },
];

export const mockStageLinks: StageLink[] = [
  // Unity Links
  { id: 'link-1-1-2', from_stage_id: 'stage-1-1', to_stage_id: 'stage-1-2' },
  { id: 'link-1-2-3', from_stage_id: 'stage-1-2', to_stage_id: 'stage-1-3' },
  { id: 'link-1-3-4', from_stage_id: 'stage-1-3', to_stage_id: 'stage-1-4' },
  { id: 'link-1-4-5', from_stage_id: 'stage-1-4', to_stage_id: 'stage-1-5' }, // Link to next row
  { id: 'link-1-5-6', from_stage_id: 'stage-1-5', to_stage_id: 'stage-1-6' },
  { id: 'link-1-6-7', from_stage_id: 'stage-1-6', to_stage_id: 'stage-1-7' },
  { id: 'link-1-7-8', from_stage_id: 'stage-1-7', to_stage_id: 'stage-1-8' },

  // Ruby Links
  { id: 'link-2-1-2', from_stage_id: 'stage-2-1', to_stage_id: 'stage-2-2' },
  { id: 'link-2-2-3', from_stage_id: 'stage-2-2', to_stage_id: 'stage-2-3' },
  { id: 'link-2-3-4', from_stage_id: 'stage-2-3', to_stage_id: 'stage-2-4' },
  
  // Next.js and Firebase Links
  { id: 'link-3-1-2', from_stage_id: 'stage-3-1', to_stage_id: 'stage-3-2' },
  { id: 'link-3-2-3', from_stage_id: 'stage-3-2', to_stage_id: 'stage-3-3' },
  { id: 'link-3-3-4', from_stage_id: 'stage-3-3', to_stage_id: 'stage-3-4' },
  { id: 'link-3-4-5', from_stage_id: 'stage-3-4', to_stage_id: 'stage-3-5' },
];

export const mockUserProgress: UserProgress[] = [
  {
    id: 'progress-1',
    user_id: 'user-123',
    stage_id: 'stage-1-1', 
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString(), 
  },
  {
    id: 'progress-2',
    user_id: 'user-123',
    stage_id: 'stage-3-1', 
    completed_at: new Date(Date.now() - 86400000).toISOString(), 
  },
  {
    id: 'progress-3',
    user_id: 'user-123',
    stage_id: 'stage-3-2', 
    completed_at: new Date().toISOString(),
  },
  {
    id: 'progress-4',
    user_id: 'user-123',
    stage_id: 'stage-3-3', 
    completed_at: new Date().toISOString(),
  },
];


export const getCourseById = (courseId: string): Course | undefined =>
  mockCourses.find(course => course.id === courseId);


export const getStagesForCourse = (courseId: string): Stage[] =>
  mockStages.filter(stage => stage.course_id === courseId).sort((a, b) => a.order - b.order);


export const getStageById = (stageId: string): Stage | undefined =>
  mockStages.find(stage => stage.id === stageId);


export const getProgressForStage = (userId: string, stageId: string): UserProgress | undefined =>
  mockUserProgress.find(p => p.user_id === userId && p.stage_id === stageId);


export const getLinksForCourse = (courseId: string): StageLink[] => {
  const courseStagesIds = getStagesForCourse(courseId).map(s => s.id);
  return mockStageLinks.filter(link => courseStagesIds.includes(link.from_stage_id) && courseStagesIds.includes(link.to_stage_id));
};


export const completeStage = (userId: string, stageId: string): UserProgress => {
  let progress = getProgressForStage(userId, stageId);
  if (!progress) {
    progress = {
      id: `progress-${mockUserProgress.length + 1}`,
      user_id: userId,
      stage_id: stageId,
      completed_at: new Date().toISOString(),
    };
    mockUserProgress.push(progress);
  }
  
  const courseIdForStage = mockStages.find(s => s.id === stageId)?.course_id;
  if (courseIdForStage) {
    const course = mockCourses.find(c => c.id === courseIdForStage);
    if (course) {
        const stagesForThisCourse = getStagesForCourse(courseIdForStage);
        const completedCount = stagesForThisCourse.filter(s => !!getProgressForStage(userId, s.id)).length;
        course.completedStages = completedCount;
    }
  }

  return progress;
};
