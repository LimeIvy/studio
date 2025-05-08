
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
    totalStages: 13, 
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

// Positioning constants
const BASE_X = 50;
const BASE_Y = 50;
const COL_SPACING = 250; // STAGE_WIDTH (180) + 70
const ROW_SPACING = 170; // STAGE_HEIGHT (100) + 70
const STAGES_PER_ROW = 4;

const calculatePositions = (stages: Stage[], courseId: string): Stage[] => {
  const courseStages = stages
    .filter(s => s.course_id === courseId)
    .sort((a, b) => a.order - b.order);

  return courseStages.map((stage, index) => {
    const row = Math.floor(index / STAGES_PER_ROW);
    const col = index % STAGES_PER_ROW;
    return {
      ...stage,
      position: {
        x: BASE_X + col * COL_SPACING,
        y: BASE_Y + row * ROW_SPACING,
      },
    };
  });
};


const rawStages: Stage[] = [
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
    // position will be calculated
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
  },
  {
    id: 'stage-1-9',
    course_id: 'course-1',
    title: '物理演算の基礎 (Rigidbody)',
    markdownContent: `
# 物理演算の基礎 (Rigidbody)

オブジェクトに物理的な挙動をさせるための Rigidbody コンポーネントについて学びます。

## Rigidbody
- オブジェクトに質量、重力、衝突応答などの物理特性を与える。
- Rigidbody をアタッチしたオブジェクトは、物理エンジンの影響を受けるようになる。

## 主要なプロパティ
- **Mass**: 質量。重いほど動きにくい。
- **Drag**: 空気抵抗。大きいほど動きが早く減速する。
- **Angular Drag**: 回転の空気抵抗。
- **Use Gravity**: 重力の影響を受けるかどうか。
- **Is Kinematic**: true の場合、物理エンジンによる制御を受けず、スクリプトから Transform を直接操作して動かす。ただし他の Rigidbody との衝突判定は行う。

##力を加える
\`\`\`csharp
using UnityEngine;

public class PlayerPhysics : MonoBehaviour
{
    public float jumpForce = 10f;
    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        if (Input.GetButtonDown("Jump"))
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        }
    }
}
\`\`\`
ForceMode には \`Force\`, \`Acceleration\`, \`Impulse\`, \`VelocityChange\` があります。
`,
    order: 9,
  },
  {
    id: 'stage-1-10',
    course_id: 'course-1',
    title: 'コライダーと衝突判定',
    markdownContent: `
# コライダーと衝突判定

オブジェクト同士の衝突を検知するためのコライダー (Collider) について学びます。

## コライダー
- オブジェクトの物理的な形状を定義するコンポーネント。
- Rigidbody と共に使用されることが多いが、静的なオブジェクトにも使用可能。
- **種類**: Box Collider, Sphere Collider, Capsule Collider, Mesh Collider など。

## 衝突判定
Rigidbody を持つオブジェクト同士が衝突すると、物理的な応答が発生します。
衝突イベントをスクリプトで検知するには、以下のメソッドを使用します。
\`\`\`csharp
using UnityEngine;

public class CollisionDetector : MonoBehaviour
{
    // 物理的な衝突が発生した最初のフレームで呼び出される
    void OnCollisionEnter(Collision collision)
    {
        Debug.Log("Collided with: " + collision.gameObject.name);
        // collision.contacts[0].point で衝突点を取得可能
    }

    // 衝突が継続している間、毎フレーム呼び出される
    void OnCollisionStay(Collision collision)
    {
        // Debug.Log("Still colliding with: " + collision.gameObject.name);
    }

    // 衝突が終了したフレームで呼び出される
    void OnCollisionExit(Collision collision)
    {
        Debug.Log("Stopped colliding with: " + collision.gameObject.name);
    }
}
\`\`\`
## トリガー
コライダーの \`Is Trigger\` プロパティを true にすると、物理的な衝突応答はせず、接触イベントのみを検知するトリガーになります。
トリガーイベントは \`OnTriggerEnter\`, \`OnTriggerStay\`, \`OnTriggerExit\` で検知します（引数は \`Collider other\`）。
少なくとも一方のオブジェクトが Rigidbody を持っている必要があります。
`,
    order: 10,
  },
  {
    id: 'stage-1-11',
    course_id: 'course-1',
    title: 'スクリプト間の連携',
    markdownContent: `
# スクリプト間の連携

複数のスクリプト間で情報や機能をやり取りする方法を学びます。

## GetComponent
他のコンポーネント（スクリプトも含む）への参照を取得する最も一般的な方法です。
\`\`\`csharp
using UnityEngine;

// Health.cs
public class Health : MonoBehaviour
{
    public int currentHealth = 100;

    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        Debug.Log(gameObject.name + " took " + amount + " damage. Health: " + currentHealth);
        if (currentHealth <= 0)
        {
            Die();
        }
    }

    void Die()
    {
        Debug.Log(gameObject.name + " died.");
        // 死亡処理 (例: Destroy(gameObject);)
    }
}

// Attacker.cs
public class Attacker : MonoBehaviour
{
    public int damageAmount = 25;

    void OnCollisionEnter(Collision collision)
    {
        Health targetHealth = collision.gameObject.GetComponent<Health>();
        if (targetHealth != null) // 相手がHealthコンポーネントを持っているか確認
        {
            targetHealth.TakeDamage(damageAmount);
        }
    }
}
\`\`\`

## public 変数と Inspector
スクリプト内の public 変数は Inspector ウィンドウに表示され、他のゲームオブジェクトやコンポーネントをドラッグ＆ドロップで設定できます。
\`\`\`csharp
public class GameManager : MonoBehaviour
{
    public PlayerController player; // InspectorでPlayerオブジェクトをアサイン

    void Start()
    {
        if (player != null)
        {
            // player.DoSomething();
        }
    }
}
\`\`\`

##静的メンバー (Static Members)
クラスに属し、インスタンス化せずにアクセスできるメンバー。シングルトンパターンなどで利用されます。
\`\`\`csharp
// ScoreManager.cs
public class ScoreManager : MonoBehaviour
{
    public static int score; // 静的変数

    public static void AddScore(int amount) // 静的メソッド
    {
        score += amount;
        Debug.Log("Score: " + score);
    }
}

// Enemy.cs
public class Enemy : MonoBehaviour
{
    void OnDestroy()
    {
        ScoreManager.AddScore(10); // 他のスクリプトから直接呼び出し
    }
}
\`\`\`
`,
    order: 11,
  },
  {
    id: 'stage-1-12',
    course_id: 'course-1',
    title: 'オーディオの再生 (AudioSource)',
    markdownContent: `
# オーディオの再生 (AudioSource)

ゲームに効果音やBGMを追加する方法を学びます。

## 主要コンポーネント
- **AudioClip**: 音声ファイル (.wav, .mp3, .ogg など)。Projectウィンドウにインポートします。
- **AudioSource**: シーン内で音を再生するコンポーネント。ゲームオブジェクトにアタッチします。
- **AudioListener**: シーン内の音を聞くコンポーネント。通常、メインカメラに1つだけアタッチされています。

## AudioSource の主なプロパティ
- **AudioClip**: 再生する音声クリップ。
- **Output**: 音声の出力先 (通常は AudioMixer 経由で AudioListener へ)。
- **Play On Awake**: true の場合、シーン開始時に自動再生。
- **Loop**: true の場合、繰り返し再生 (BGMなどに)。
- **Volume**: 音量 (0-1)。
- **Pitch**: ピッチ (1が通常)。
- **Spatial Blend**: 2D (0) と 3D (1) のブレンド。3Dにすると音源からの距離や方向で聞こえ方が変わる。

## スクリプトからの再生
\`\`\`csharp
using UnityEngine;

public class SoundPlayer : MonoBehaviour
{
    public AudioClip jumpSound;
    public AudioClip coinSound;
    private AudioSource audioSource;

    void Start()
    {
        audioSource = GetComponent<AudioSource>();
        if (audioSource == null) // AudioSourceがなければ追加
        {
            audioSource = gameObject.AddComponent<AudioSource>();
        }
    }

    public void PlayJumpSound()
    {
        if (jumpSound != null)
        {
            audioSource.PlayOneShot(jumpSound, 0.7f); // PlayOneShotは重複再生可能、第二引数で音量スケール
        }
    }

    public void PlayCoinSound()
    {
        if (coinSound != null)
        {
            // audioSource.clip = coinSound; // こちらはBGMなど上書きして再生する場合
            // audioSource.Play();
            AudioSource.PlayClipAtPoint(coinSound, transform.position); // 指定位置で一時的なAudioSourceを作成して再生
        }
    }
}
\`\`\`
`,
    order: 12,
  },
  {
    id: 'stage-1-13',
    course_id: 'course-1',
    title: '簡単なゲームのビルド',
    markdownContent: `
# 簡単なゲームのビルド

作成したUnityプロジェクトをスタンドアロンアプリケーションとしてビルドする方法を学びます。

## ビルド設定 (Build Settings)
1. File > Build Settings を選択。
2. **Scenes In Build**: ビルドに含めるシーンを追加します。「Add Open Scenes」で現在開いているシーンを追加できます。最初のシーン (インデックス0) が起動時に読み込まれます。
3. **Platform**: ビルド対象のプラットフォーム (Windows, macOS, Linux, WebGLなど) を選択。必要に応じて「Switch Platform」をクリック。
4. **Player Settings...**: アイコン、解像度、会社名、製品名などの詳細設定。

## ビルド実行
1. Build Settings ウィンドウで「Build」をクリック。
2. ビルドの保存場所とファイル名を指定。
3. ビルドが開始されます。完了すると指定した場所に実行ファイル（または関連ファイル群）が生成されます。

## WebGLビルドの注意点
- ビルドに時間がかかることがあります。
- サーバーにアップロードして実行する必要があります。ローカルファイルシステムから直接index.htmlを開いても動作しない場合があります。
- パフォーマンスや機能に一部制約があります。

おめでとうございます！これでUnityの基本的な流れを体験しました。
ここからさらに様々な機能を学んで、あなたのアイデアを形にしていきましょう！
[Unity Learn](https://learn.unity.com/) でさらに多くのチュートリアルやプロジェクトを見つけることができます。
`,
    order: 13,
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
  },
  // Next.js と Firebase Stages (Placeholder)
  {
    id: 'stage-3-1',
    course_id: 'course-3',
    title: 'Next.jsプロジェクトセットアップ',
    markdownContent: '# Next.jsプロジェクトセットアップ\n\nNext.jsプロジェクトの初期設定方法を学びます。',
    order: 1,
  },
  {
    id: 'stage-3-2',
    course_id: 'course-3',
    title: 'Firebaseプロジェクト連携',
    markdownContent: '# Firebaseプロジェクト連携\n\nFirebaseプロジェクトを作成し、Next.jsアプリと連携します。',
    order: 2,
  },
  {
    id: 'stage-3-3',
    course_id: 'course-3',
    title: 'Firestoreデータ操作',
    markdownContent: '# Firestoreデータ操作\n\nFirestoreデータベースの基本的なCRUD操作を学びます。',
    order: 3,
  },
  {
    id: 'stage-3-4',
    course_id: 'course-3',
    title: 'Firebase Authentication',
    markdownContent: '# Firebase Authentication\n\nFirebase Authenticationを用いたユーザー認証機能を実装します。',
    order: 4,
  },
  {
    id: 'stage-3-5',
    course_id: 'course-3',
    title: 'Firebase Hostingデプロイ',
    markdownContent: '# Firebase Hostingデプロイ\n\n作成したアプリケーションをFirebase Hostingにデプロイします。',
    order: 5,
  },
];


export const mockStages: Stage[] = [
  ...calculatePositions(rawStages, 'course-1'),
  ...calculatePositions(rawStages, 'course-2'),
  ...calculatePositions(rawStages, 'course-3'),
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
  { id: 'link-1-8-9', from_stage_id: 'stage-1-8', to_stage_id: 'stage-1-9' },
  { id: 'link-1-9-10', from_stage_id: 'stage-1-9', to_stage_id: 'stage-1-10' },
  { id: 'link-1-10-11', from_stage_id: 'stage-1-10', to_stage_id: 'stage-1-11' },
  { id: 'link-1-11-12', from_stage_id: 'stage-1-11', to_stage_id: 'stage-1-12' },
  { id: 'link-1-12-13', from_stage_id: 'stage-1-12', to_stage_id: 'stage-1-13' },

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
