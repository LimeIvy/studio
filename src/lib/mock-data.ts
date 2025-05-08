
import type { Course, Stage, StageLink, UserProgress, User, Team, TeamMember } from './types';

export const mockUser: User = {
  id: 'user-123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
};

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Acme大学 研究室',
    description: 'Acme大学の先端技術研究室の学習チームです。',
    leaderId: 'user-123',
    members: [
      { userId: 'user-123', role: 'leader' },
      { userId: 'user-456', role: 'editor' },
      { userId: 'user-789', role: 'member' },
    ],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'team-2',
    name: 'スタートアップ・インキュベーター',
    description: '次世代のイノベーターを育成するプログラム。',
    leaderId: 'user-alpha',
    members: [
      { userId: 'user-alpha', role: 'leader' },
      { userId: 'user-123', role: 'member' }, // mockUser is also a member here
    ],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Unity入門',
    description: 'Unityの基本を学び、簡単なゲームを作成します。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/unity/600/400',
    totalStages: 18, 
    completedStages: 1,
    mode: 'public',
    price: 1000,
    creatorId: 'user-creator-unity',
    isPublished: true,
  },
  {
    id: 'course-2',
    title: 'Ruby入門 (チーム限定)',
    description: 'Rubyプログラミングの基礎からWebアプリケーション開発まで。Acme大学研究室専用。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/ruby/600/400',
    totalStages: 4,
    completedStages: 0,
    mode: 'team',
    teamId: 'team-1',
    creatorId: 'user-123', // Team leader created this
    isPublished: true, // For team courses, published means visible to team
  },
  {
    id: 'course-3',
    title: 'Next.js と Firebase (公開)',
    description: 'モダンなWebアプリケーション開発を実践的に学びます。どなたでも受講可能です。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/nextjs/600/400',
    totalStages: 5,
    completedStages: 3, // Specific to mockUser
    mode: 'public',
    price: 0, // Free public course
    creatorId: 'user-123',
    isPublished: true,
  },
  {
    id: 'course-4',
    title: '機械学習プロジェクト (チーム用)',
    description: 'スタートアップ・インキュベーターのチーム向け実践プロジェクトコース。',
    created_at: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/mlteam/600/400',
    totalStages: 7, // Placeholder
    completedStages: 0,
    mode: 'team',
    teamId: 'team-2',
    creatorId: 'user-alpha',
    isPublished: true,
  }
];

// Positioning constants
const BASE_X = 50;
const BASE_Y = 50;
const COL_SPACING = 270;
const ROW_SPACING = 120;
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


const rawStages: Omit<Stage, 'position'>[] = [
  // Unity入門 Stages (course-1)
  {
    id: 'stage-1-1',
    course_id: 'course-1',
    title: 'Unityとは？',
    fileType: 'md',
    filePath: 'unity/01-intro.md',
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
  },
  {
    id: 'stage-1-2',
    course_id: 'course-1',
    title: '最初のプロジェクト作成',
    fileType: 'md',
    filePath: 'unity/02-first-project.md',
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
    fileType: 'md',
    filePath: 'unity/03-basic-operations.md',
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
    fileType: 'md',
    filePath: 'unity/04-gameobjects-components.md',
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
    fileType: 'md',
    filePath: 'unity/05-prefabs.md',
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
    fileType: 'md',
    filePath: 'unity/06-materials-textures.md',
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
    fileType: 'md',
    filePath: 'unity/07-lighting-basics.md',
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
    fileType: 'md',
    filePath: 'unity/08-ui-canvas.md',
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
    fileType: 'md',
    filePath: 'unity/09-physics-rigidbody.md',
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
    fileType: 'md',
    filePath: 'unity/10-colliders-collision.md',
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
    fileType: 'md',
    filePath: 'unity/11-script-communication.md',
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
    fileType: 'md',
    filePath: 'unity/12-audio-basics.md',
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
    fileType: 'md',
    filePath: 'unity/13-building-game.md',
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
  {
    id: 'stage-1-14-pdf',
    course_id: 'course-1',
    title: 'Unity PDF ガイド',
    order: 14,
    fileType: 'pdf',
    filePath: 'references/unity_optimization_guide.pdf',
    markdownContent: 'このステージでは、パフォーマンス最適化に関するPDF資料を参照します。実際のファイルは提供されませんが、アプリケーションはPDFファイルを表示する機能を示します。',
  },
  {
    id: 'stage-1-15',
    course_id: 'course-1',
    title: 'アニメーション入門',
    order: 15,
    fileType: 'md',
    filePath: 'unity/15-animation-intro.md',
    markdownContent: `
# アニメーション入門

Unityのアニメーションシステム（Mecanim）の基本を学びます。

## Animationウィンドウ
- オブジェクトのプロパティを時間軸に沿って変化させることでアニメーションクリップを作成します。
- 位置、回転、スケール、マテリアルの色などをアニメーション化できます。

## Animatorコントローラ
- アニメーションクリップ間の遷移やブレンドを管理します。
- ステートマシンを使って、キャラクターの待機、歩行、ジャンプなどの状態遷移を定義します。

## Animatorコンポーネント
- ゲームオブジェクトにAnimatorコントローラをアタッチし、アニメーションを再生します。
`,
  },
  {
    id: 'stage-1-16-pdf',
    course_id: 'course-1',
    title: 'シェーダーグラフ資料 (PDF)',
    order: 16,
    fileType: 'pdf',
    filePath: 'references/shader_graph_cookbook.pdf',
    markdownContent: 'Unityのシェーダーグラフに関する詳細なPDF資料です。カスタムシェーダー作成の基礎について解説します。',
  },
  {
    id: 'stage-1-17',
    course_id: 'course-1',
    title: 'バージョン管理 (Git)',
    order: 17,
    fileType: 'md',
    filePath: 'unity/17-version-control.md',
    markdownContent: `
# バージョン管理 (Git)

UnityプロジェクトでGitを使用する際の基本的な設定とベストプラクティスを学びます。

## .gitignore
- Unityが生成する一時ファイルやローカル設定ファイルをバージョン管理対象から除外します。
- GitHubが提供するUnity用の \`.gitignore\` テンプレートが便利です。

## 大規模アセットの管理
- Git LFS (Large File Storage) を使用して、大きなテクスチャやモデルファイルを効率的に扱います。
`,
  },
  {
    id: 'stage-1-18',
    course_id: 'course-1',
    title: 'デバッグとプロファイリング',
    order: 18,
    fileType: 'md',
    filePath: 'unity/18-debugging-profiling.md',
    markdownContent: `
# デバッグとプロファイリング

Unityでのデバッグ方法とパフォーマンス最適化のためのプロファイラツールの使い方を学びます。

## Debug.Log
- コンソールにメッセージを出力して、変数の値や処理の流れを確認します。

## Profilerウィンドウ
- CPU使用率、メモリ使用量、レンダリング統計などをリアルタイムで確認し、パフォーマンスのボトルネックを特定します。
`,
  },

  // Ruby入門 Stages (course-2)
  {
    id: 'stage-2-1',
    course_id: 'course-2',
    title: 'Rubyの概要と環境構築',
    fileType: 'md',
    filePath: 'ruby/01-intro-setup.md',
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
    fileType: 'md',
    filePath: 'ruby/02-basic-syntax.md',
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
    fileType: 'md',
    filePath: 'ruby/03-methods-classes.md',
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
    fileType: 'md',
    filePath: 'ruby/04-blocks-iterators.md',
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
  // Next.js と Firebase Stages (course-3)
  {
    id: 'stage-3-1',
    course_id: 'course-3',
    title: 'Next.jsプロジェクトセットアップ',
    fileType: 'md',
    filePath: 'nextjs-firebase/01-nextjs-setup.md',
    markdownContent: '# Next.jsプロジェクトセットアップ\n\nNext.jsプロジェクトの初期設定方法を学びます。',
    order: 1,
  },
  {
    id: 'stage-3-2',
    course_id: 'course-3',
    title: 'Firebaseプロジェクト連携',
    fileType: 'md',
    filePath: 'nextjs-firebase/02-firebase-setup.md',
    markdownContent: '# Firebaseプロジェクト連携\n\nFirebaseプロジェクトを作成し、Next.jsアプリと連携します。',
    order: 2,
  },
  {
    id: 'stage-3-3',
    course_id: 'course-3',
    title: 'Firestoreデータ操作',
    fileType: 'md',
    filePath: 'nextjs-firebase/03-firestore-crud.md',
    markdownContent: '# Firestoreデータ操作\n\nFirestoreデータベースの基本的なCRUD操作を学びます。',
    order: 3,
  },
  {
    id: 'stage-3-4',
    course_id: 'course-3',
    title: 'Firebase Authentication',
    fileType: 'md',
    filePath: 'nextjs-firebase/04-firebase-auth.md',
    markdownContent: '# Firebase Authentication\n\nFirebase Authenticationを用いたユーザー認証機能を実装します。',
    order: 4,
  },
  {
    id: 'stage-3-5',
    course_id: 'course-3',
    title: 'Firebase Hostingデプロイ',
    fileType: 'md',
    filePath: 'nextjs-firebase/05-firebase-hosting.md',
    markdownContent: '# Firebase Hostingデプロイ\n\n作成したアプリケーションをFirebase Hostingにデプロイします。',
    order: 5,
  },

  // Machine Learning Project Stages (course-4)
  { id: 'stage-4-1', course_id: 'course-4', title: 'プロジェクト概要と目標設定', fileType: 'md', filePath: 'ml-project/01-overview.md', markdownContent: '# プロジェクト概要と目標設定\n\nこの機械学習プロジェクトの全体像と達成目標を明確にします。', order: 1 },
  { id: 'stage-4-2', course_id: 'course-4', title: 'データ収集と前処理', fileType: 'md', filePath: 'ml-project/02-data-preprocessing.md', markdownContent: '# データ収集と前処理\n\nモデル学習に必要なデータの収集方法と、クリーニング・整形手順を学びます。', order: 2 },
  { id: 'stage-4-3', course_id: 'course-4', title: 'モデル選択と基礎理論', fileType: 'md', filePath: 'ml-project/03-model-selection.md', markdownContent: '# モデル選択と基礎理論\n\nプロジェクトに適した機械学習モデルを選択し、その背景理論を理解します。', order: 3 },
  { id: 'stage-4-4', course_id: 'course-4', title: 'モデル学習と評価 (PDF)', fileType: 'pdf', filePath: 'references/ml_training_evaluation.pdf', markdownContent: 'モデルの学習プロセスと、その性能を評価するための指標について解説したPDF資料です。', order: 4 },
  { id: 'stage-4-5', course_id: 'course-4', title: 'ハイパーパラメータ調整', fileType: 'md', filePath: 'ml-project/05-hyperparameter-tuning.md', markdownContent: '# ハイパーパラメータ調整\n\nモデルの性能を最大限に引き出すためのハイパーパラメータ調整テクニックを学びます。', order: 5 },
  { id: 'stage-4-6', course_id: 'course-4', title: '結果の解釈と報告', fileType: 'md', filePath: 'ml-project/06-results-reporting.md', markdownContent: '# 結果の解釈と報告\n\n学習結果を正しく解釈し、効果的な報告書を作成する方法を身につけます。', order: 6 },
  { id: 'stage-4-7', course_id: 'course-4', title: 'デプロイ戦略の検討', fileType: 'md', filePath: 'ml-project/07-deployment-strategy.md', markdownContent: '# デプロイ戦略の検討\n\n完成したモデルを実際の運用環境にデプロイするための戦略を検討します。', order: 7 },

];


export const mockStages: Stage[] = [
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-1') as Stage[], 'course-1'),
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-2') as Stage[], 'course-2'),
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-3') as Stage[], 'course-3'),
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-4') as Stage[], 'course-4'),
];


export const mockStageLinks: StageLink[] = [
  // Unity Links
  { id: 'link-1-1-2', from_stage_id: 'stage-1-1', to_stage_id: 'stage-1-2' },
  { id: 'link-1-2-3', from_stage_id: 'stage-1-2', to_stage_id: 'stage-1-3' },
  { id: 'link-1-3-4', from_stage_id: 'stage-1-3', to_stage_id: 'stage-1-4' },
  { id: 'link-1-4-5', from_stage_id: 'stage-1-4', to_stage_id: 'stage-1-5' },
  { id: 'link-1-5-6', from_stage_id: 'stage-1-5', to_stage_id: 'stage-1-6' },
  { id: 'link-1-6-7', from_stage_id: 'stage-1-6', to_stage_id: 'stage-1-7' },
  { id: 'link-1-7-8', from_stage_id: 'stage-1-7', to_stage_id: 'stage-1-8' },
  { id: 'link-1-8-9', from_stage_id: 'stage-1-8', to_stage_id: 'stage-1-9' },
  { id: 'link-1-9-10', from_stage_id: 'stage-1-9', to_stage_id: 'stage-1-10' },
  { id: 'link-1-10-11', from_stage_id: 'stage-1-10', to_stage_id: 'stage-1-11' },
  { id: 'link-1-11-12', from_stage_id: 'stage-1-11', to_stage_id: 'stage-1-12' },
  { id: 'link-1-12-13', from_stage_id: 'stage-1-12', to_stage_id: 'stage-1-13' },
  { id: 'link-1-13-14pdf', from_stage_id: 'stage-1-13', to_stage_id: 'stage-1-14-pdf' },
  { id: 'link-1-14pdf-15', from_stage_id: 'stage-1-14-pdf', to_stage_id: 'stage-1-15' },
  { id: 'link-1-15-16pdf', from_stage_id: 'stage-1-15', to_stage_id: 'stage-1-16-pdf' },
  { id: 'link-1-16pdf-17', from_stage_id: 'stage-1-16-pdf', to_stage_id: 'stage-1-17' },
  { id: 'link-1-17-18', from_stage_id: 'stage-1-17', to_stage_id: 'stage-1-18' },

  // Ruby Links
  { id: 'link-2-1-2', from_stage_id: 'stage-2-1', to_stage_id: 'stage-2-2' },
  { id: 'link-2-2-3', from_stage_id: 'stage-2-2', to_stage_id: 'stage-2-3' },
  { id: 'link-2-3-4', from_stage_id: 'stage-2-3', to_stage_id: 'stage-2-4' },

  // Next.js and Firebase Links
  { id: 'link-3-1-2', from_stage_id: 'stage-3-1', to_stage_id: 'stage-3-2' },
  { id: 'link-3-2-3', from_stage_id: 'stage-3-2', to_stage_id: 'stage-3-3' },
  { id: 'link-3-3-4', from_stage_id: 'stage-3-3', to_stage_id: 'stage-3-4' },
  { id: 'link-3-4-5', from_stage_id: 'stage-3-4', to_stage_id: 'stage-3-5' },

  // Machine Learning Project Links
  { id: 'link-4-1-2', from_stage_id: 'stage-4-1', to_stage_id: 'stage-4-2' },
  { id: 'link-4-2-3', from_stage_id: 'stage-4-2', to_stage_id: 'stage-4-3' },
  { id: 'link-4-3-4pdf', from_stage_id: 'stage-4-3', to_stage_id: 'stage-4-4-pdf' },
  { id: 'link-4-4pdf-5', from_stage_id: 'stage-4-4-pdf', to_stage_id: 'stage-4-5' },
  { id: 'link-4-5-6', from_stage_id: 'stage-4-5', to_stage_id: 'stage-4-6' },
  { id: 'link-4-6-7', from_stage_id: 'stage-4-6', to_stage_id: 'stage-4-7' },
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

export const getPublicCourses = (): Course[] =>
  mockCourses.filter(course => course.mode === 'public' && course.isPublished);

export const getTeamCoursesForUser = (userId: string): Course[] => {
  const userTeams = mockTeams.filter(team => team.members.some(m => m.userId === userId));
  return mockCourses.filter(course =>
    course.mode === 'team' &&
    course.teamId &&
    userTeams.some(team => team.id === course.teamId) &&
    course.isPublished // or some team-specific visibility logic
  );
};

export const getTeamById = (teamId: string): Team | undefined =>
  mockTeams.find(team => team.id === teamId);

export const getUserTeams = (userId: string): Team[] =>
  mockTeams.filter(team => team.members.some(member => member.userId === userId));

export const canUserManageCourse = (userId: string, course: Course): boolean => {
  if (course.mode === 'public') {
    return course.creatorId === userId;
  }
  if (course.mode === 'team' && course.teamId) {
    const team = getTeamById(course.teamId);
    if (!team) return false;
    const member = team.members.find(m => m.userId === userId);
    return !!member && (member.role === 'leader' || member.role === 'editor');
  }
  return false;
};


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

// Simulate fetching file content. In a real app, this would involve API calls or file system access.
export async function fetchStageContent(stage: Stage): Promise<string> {
  if (stage.fileType === 'md') {
    // For mock data, we already have markdownContent.
    // In a real app, you might fetch from stage.filePath here.
    // e.g., const response = await fetch(`/api/content?path=${stage.filePath}`);
    // const data = await response.text();
    // return data;
    return stage.markdownContent || `Error: Markdown content not found for ${stage.title}`;
  }
  if (stage.fileType === 'pdf') {
    // For PDF, we might return a message or a URL to an embeddable viewer.
    // For this example, we'll return a simple message or the optional markdownContent if it's a description.
    return stage.markdownContent || `PDF Document: ${stage.title}. Path: ${stage.filePath}. (PDF viewer would be embedded here).`;
  }
  return `Error: Unsupported file type for stage ${stage.title}`;
}
