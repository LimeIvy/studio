
import type { Course, Stage, StageLink, UserProgress, User, Team, TeamMember, StageCompletionResult } from './types';

export const mockUser: User = {
  id: 'user-123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  xp: 150, // Initial XP
  level: 2,  // Initial Level based on XP
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
    completedStages: 1, // This should be dynamically calculated or accurately set based on mockUserProgress
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
const COL_SPACING = 270; // STAGE_WIDTH (200) + 70
const ROW_SPACING = 150; // STAGE_HEIGHT (100) + 50; increased from 120 to 150 for more vertical space
const STAGES_PER_ROW = 3; 


const calculatePositions = (stages: Omit<Stage, 'position'>[], courseId: string): Stage[] => {
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
    } as Stage; 
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
    markdownContent: `# Unityとは？\n\nUnityは、リアルタイム3Dコンテンツを作成・運用するための世界をリードするプラットフォームです。ゲーム開発者からアーティスト、建築家、自動車デザイナー、映画制作者まで、さまざまなクリエイターがUnityを利用しています。\n\n## 主な特徴\n- クロスプラットフォーム対応 (PC, モバイル, コンソールなど)\n- 強力なエディタとツール\n- アセットストアによる豊富なリソース\n- アクティブなコミュニティ\n\n## このステージの目標\n- Unityの概要を理解する\n- Unity HubとUnity Editorの役割を知る`,
    order: 1,
    xpAward: 10,
  },
  {
    id: 'stage-1-2',
    course_id: 'course-1',
    title: '最初のプロジェクト作成',
    fileType: 'md',
    filePath: 'unity/02-first-project.md',
    markdownContent: `# 最初のプロジェクト作成\n\nUnity Hubを起動し、新しいプロジェクトを作成しましょう。\n\n## 手順\n1. Unity Hubを開く\n2. 「プロジェクト」タブで「新規作成」をクリック\n3. テンプレートとして「3D」を選択\n4. プロジェクト名（例: MyFirstUnityGame）と保存場所を指定\n5. 「作成」ボタンをクリック\n\nしばらく待つと、Unity Editorが起動し、新しいプロジェクトが開きます。\n\n\`\`\`csharp\n// C#スクリプトの例\nusing UnityEngine;\n\npublic class HelloWorld : MonoBehaviour\n{\n    void Start()\n    {\n        Debug.Log("Hello, Unity World!");\n    }\n}\n\`\`\``,
    order: 2,
    xpAward: 15,
  },
  {
    id: 'stage-1-3',
    course_id: 'course-1',
    title: '基本操作とインターフェース',
    fileType: 'md',
    filePath: 'unity/03-basic-operations.md',
    markdownContent: `# 基本操作とインターフェース\n\nUnity Editorの主要なウィンドウと基本操作に慣れましょう。\n\n## 主要ウィンドウ\n- **Sceneビュー**: ゲームのシーンを視覚的に構築する場所\n- **Gameビュー**: プレイヤーが見るゲーム画面のプレビュー\n- **Hierarchyウィンドウ**: シーン内の全ゲームオブジェクトのリスト\n- **Projectウィンドウ**: プロジェクトのアセット（スクリプト、テクスチャ等）を管理\n- **Inspectorウィンドウ**: 選択したオブジェクトやアセットの詳細設定\n\n_このステージを完了すると、Unityの基本的な使い方が身につきます。_`,
    order: 3,
    xpAward: 10,
  },
  {
    id: 'stage-1-4',
    course_id: 'course-1',
    title: 'ゲームオブジェクトとコンポーネント',
    fileType: 'md',
    filePath: 'unity/04-gameobjects-components.md',
    markdownContent: `# ゲームオブジェクトとコンポーネント\n\nUnityの基本的な構成要素であるゲームオブジェクトとコンポーネントについて学びます。\n\n## ゲームオブジェクト (GameObject)\n- シーン内に配置されるすべての「モノ」の基本単位。\n- 例:キャラクター、ライト、カメラ、地形など。\n- それ自体は空のコンテナのようなもので、機能はコンポーネントによって追加されます。\n\n## コンポーネント (Component)\n- ゲームオブジェクトに機能を追加する部品。\n- 例: Transform (位置・回転・拡縮), Mesh Renderer (見た目), Rigidbody (物理挙動), Script (カスタムロジック)。\n- 1つのゲームオブジェクトに複数のコンポーネントをアタッチできます。\n\n\`\`\`csharp\n// スクリプトもコンポーネントの一種\nusing UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n    public float speed = 5.0f;\n\n    void Update()\n    {\n        float horizontalInput = Input.GetAxis("Horizontal");\n        transform.Translate(Vector3.right * horizontalInput * speed * Time.deltaTime);\n    }\n}\n\`\`\``,
    order: 4,
    xpAward: 20,
  },
  {
    id: 'stage-1-5',
    course_id: 'course-1',
    title: 'プレハブの活用',
    fileType: 'md',
    filePath: 'unity/05-prefabs.md',
    markdownContent: `# プレハブの活用\n\nプレハブ (Prefab) は、再利用可能なゲームオブジェクトのテンプレートです。\n\n## プレハブのメリット\n- **効率化**: 同じ設定のオブジェクトを多数配置する場合に便利。\n- **一括編集**: プレハブ本体を編集すると、シーン内のすべてのインスタンスに反映。\n- **動的生成**: スクリプトからゲーム中にオブジェクトを生成可能。\n\n## 作成方法\n1. HierarchyウィンドウでゲームオブジェクトをProjectウィンドウにドラッグ＆ドロップ。\n2. Projectウィンドウに青い立方体のアイコンで表示されればプレハブ化完了。\n\n## プレハブのインスタンス化\n\`\`\`csharp\nusing UnityEngine;\n\npublic class Spawner : MonoBehaviour\n{\n    public GameObject enemyPrefab; // Inspectorでプレハブをセット\n    public Transform spawnPoint;\n\n    void Start()\n    {\n        Instantiate(enemyPrefab, spawnPoint.position, spawnPoint.rotation);\n    }\n}\n\`\`\``,
    order: 5,
    xpAward: 20,
  },
  {
    id: 'stage-1-6',
    course_id: 'course-1',
    title: 'マテリアルとテクスチャ',
    fileType: 'md',
    filePath: 'unity/06-materials-textures.md',
    markdownContent: `# マテリアルとテクスチャ\n\nオブジェクトの見た目を定義するマテリアルとテクスチャについて学びます。\n\n## テクスチャ (Texture)\n- オブジェクトの表面に貼り付ける画像ファイル (例: .png, .jpg)。\n- 色、模様、細部のディテールなどを表現。\n\n## マテリアル (Material)\n- オブジェクトの表面がどのようにレンダリングされるかを定義するアセット。\n- シェーダー、テクスチャ、色、その他のプロパティ（反射率、滑らかさなど）を組み合わせる。\n- 1つのマテリアルを複数のオブジェクトに適用可能。\n\n### 作成と適用\n1. Projectウィンドウで右クリック > Create > Material。\n2. Inspectorウィンドウでシェーダーを選択し、テクスチャや色を設定。\n3. 作成したマテリアルをシーン内のオブジェクトにドラッグ＆ドロップ。`,
    order: 6,
    xpAward: 15,
  },
  {
    id: 'stage-1-7',
    course_id: 'course-1',
    title: 'ライティングの基礎',
    fileType: 'md',
    filePath: 'unity/07-lighting-basics.md',
    markdownContent: `# ライティングの基礎\n\nシーンの雰囲気を決定づけるライティングについて学びます。\n\n## 主要なライトの種類\n- **Directional Light**: 太陽光のように、シーン全体を均一な方向から照らす。\n- **Point Light**: 電球のように、一点から全方向に光を放つ。\n- **Spot Light**: スポットライトのように、特定の方向を円錐状に照らす。\n- **Area Light** (Baked Only): 面光源。リアルな間接光の表現に。\n\n## ライティング設定\n- **Mode**: Realtime, Baked, Mixed を選択可能。パフォーマンスと品質のトレードオフ。\n- **Intensity**: 光の強さ。\n- **Color**: 光の色。\n- **Shadow Type**: 影の有無や種類 (No Shadows, Hard Shadows, Soft Shadows)。\n\nリアルタイムライティングは動的ですが処理負荷が高く、ベイクドライティングは静的ですが高品質な影や間接光を低負荷で表現できます。`,
    order: 7,
    xpAward: 15,
  },
  {
    id: 'stage-1-8',
    course_id: 'course-1',
    title: 'UIの基本 (Canvas)',
    fileType: 'md',
    filePath: 'unity/08-ui-canvas.md',
    markdownContent: `# UIの基本 (Canvas)\n\nゲームのユーザーインターフェース (UI) を作成するためのCanvasシステムについて学びます。\n\n## Canvas\n- すべてのUI要素を配置する領域。\n- **Render Mode**:\n    - **Screen Space - Overlay**: 画面の一番手前に描画。\n    - **Screen Space - Camera**: 指定したカメラからの距離に基づいて描画。3D空間にUIを配置する際に使用。\n    - **World Space**: シーン内の他の3Dオブジェクトと同様に扱われる。\n\n## UI要素の例\n- **Text / TextMeshPro**: 文字列を表示。\n- **Image**: 画像を表示。\n- **Button**: クリック可能なボタン。\n- **Slider**: スライダー。\n- **Panel**: 他のUI要素をグループ化するための背景。\n\n### 作成方法\nHierarchyウィンドウで右クリック > UI > (作成したいUI要素) を選択。\nCanvasがなければ自動的に作成されます。`,
    order: 8,
    xpAward: 20,
  },
  {
    id: 'stage-1-9',
    course_id: 'course-1',
    title: '物理演算の基礎 (Rigidbody)',
    fileType: 'md',
    filePath: 'unity/09-physics-rigidbody.md',
    markdownContent: `# 物理演算の基礎 (Rigidbody)\n\nオブジェクトに物理的な挙動をさせるための Rigidbody コンポーネントについて学びます。\n\n## Rigidbody\n- オブジェクトに質量、重力、衝突応答などの物理特性を与える。\n- Rigidbody をアタッチしたオブジェクトは、物理エンジンの影響を受けるようになる。\n\n## 主要なプロパティ\n- **Mass**: 質量。重いほど動きにくい。\n- **Drag**: 空気抵抗。大きいほど動きが早く減速する。\n- **Angular Drag**: 回転の空気抵抗。\n- **Use Gravity**: 重力の影響を受けるかどうか。\n- **Is Kinematic**: true の場合、物理エンジンによる制御を受けず、スクリプトから Transform を直接操作して動かす。ただし他の Rigidbody との衝突判定は行う。\n\n##力を加える\n\`\`\`csharp\nusing UnityEngine;\n\npublic class PlayerPhysics : MonoBehaviour\n{\n    public float jumpForce = 10f;\n    private Rigidbody rb;\n\n    void Start()\n    {\n        rb = GetComponent<Rigidbody>();\n    }\n\n    void Update()\n    {\n        if (Input.GetButtonDown("Jump"))\n        {\n            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);\n        }\n    }\n}\n\`\`\`\nForceMode には \`Force\`, \`Acceleration\`, \`Impulse\`, \`VelocityChange\` があります。`,
    order: 9,
    xpAward: 25,
  },
  {
    id: 'stage-1-10',
    course_id: 'course-1',
    title: 'コライダーと衝突判定',
    fileType: 'md',
    filePath: 'unity/10-colliders-collision.md',
    markdownContent: `# コライダーと衝突判定\n\nオブジェクト同士の衝突を検知するためのコライダー (Collider) について学びます。\n\n## コライダー\n- オブジェクトの物理的な形状を定義するコンポーネント。\n- Rigidbody と共に使用されることが多いが、静的なオブジェクトにも使用可能。\n- **種類**: Box Collider, Sphere Collider, Capsule Collider, Mesh Collider など。\n\n## 衝突判定\nRigidbody を持つオブジェクト同士が衝突すると、物理的な応答が発生します。\n衝突イベントをスクリプトで検知するには、以下のメソッドを使用します。\n\`\`\`csharp\nusing UnityEngine;\n\npublic class CollisionDetector : MonoBehaviour\n{\n    // 物理的な衝突が発生した最初のフレームで呼び出される\n    void OnCollisionEnter(Collision collision)\n    {\n        Debug.Log("Collided with: " + collision.gameObject.name);\n        // collision.contacts[0].point で衝突点を取得可能\n    }\n\n    // 衝突が継続している間、毎フレーム呼び出される\n    void OnCollisionStay(Collision collision)\n    {\n        // Debug.Log("Still colliding with: " + collision.gameObject.name);\n    }\n\n    // 衝突が終了したフレームで呼び出される\n    void OnCollisionExit(Collision collision)\n    {\n        Debug.Log("Stopped colliding with: " + collision.gameObject.name);\n    }\n}\n\`\`\`\n## トリガー\nコライダーの \`Is Trigger\` プロパティを true にすると、物理的な衝突応答はせず、接触イベントのみを検知するトリガーになります。\nトリガーイベントは \`OnTriggerEnter\`, \`OnTriggerStay\`, \`OnTriggerExit\` で検知します（引数は \`Collider other\`）。\n少なくとも一方のオブジェクトが Rigidbody を持っている必要があります。`,
    order: 10,
    xpAward: 25,
  },
  {
    id: 'stage-1-11',
    course_id: 'course-1',
    title: 'スクリプト間の連携',
    fileType: 'md',
    filePath: 'unity/11-script-communication.md',
    markdownContent: `# スクリプト間の連携\n\n複数のスクリプト間で情報や機能をやり取りする方法を学びます。\n\n## GetComponent\n他のコンポーネント（スクリプトも含む）への参照を取得する最も一般的な方法です。\n\`\`\`csharp\nusing UnityEngine;\n\n// Health.cs\npublic class Health : MonoBehaviour\n{\n    public int currentHealth = 100;\n\n    public void TakeDamage(int amount)\n    {\n        currentHealth -= amount;\n        Debug.Log(gameObject.name + " took " + amount + " damage. Health: " + currentHealth);\n        if (currentHealth <= 0)\n        {\n            Die();\n        }\n    }\n\n    void Die()\n    {\n        Debug.Log(gameObject.name + " died.");\n        // 死亡処理 (例: Destroy(gameObject);)\n    }\n}\n\n// Attacker.cs\npublic class Attacker : MonoBehaviour\n{\n    public int damageAmount = 25;\n\n    void OnCollisionEnter(Collision collision)\n    {\n        Health targetHealth = collision.gameObject.GetComponent<Health>();\n        if (targetHealth != null) // 相手がHealthコンポーネントを持っているか確認\n        {\n            targetHealth.TakeDamage(damageAmount);\n        }\n    }\n}\n\`\`\`\n\n## public 変数と Inspector\nスクリプト内の public 変数は Inspector ウィンドウに表示され、他のゲームオブジェクトやコンポーネントをドラッグ＆ドロップで設定できます。\n\`\`\`csharp\npublic class GameManager : MonoBehaviour\n{\n    public PlayerController player; // InspectorでPlayerオブジェクトをアサイン\n\n    void Start()\n    {\n        if (player != null)\n        {\n            // player.DoSomething();\n        }\n    }\n}\n\`\`\`\n\n##静的メンバー (Static Members)\nクラスに属し、インスタンス化せずにアクセスできるメンバー。シングルトンパターンなどで利用されます。\n\`\`\`csharp\n// ScoreManager.cs\npublic class ScoreManager : MonoBehaviour\n{\n    public static int score; // 静的変数\n\n    public static void AddScore(int amount) // 静的メソッド\n    {\n        score += amount;\n        Debug.Log("Score: " + score);\n    }\n}\n\n// Enemy.cs\npublic class Enemy : MonoBehaviour\n{\n    void OnDestroy()\n    {\n        ScoreManager.AddScore(10); // 他のスクリプトから直接呼び出し\n    }\n}\n\`\`\``,
    order: 11,
    xpAward: 30,
  },
  {
    id: 'stage-1-12',
    course_id: 'course-1',
    title: 'オーディオの再生 (AudioSource)',
    fileType: 'md',
    filePath: 'unity/12-audio-basics.md',
    markdownContent: `# オーディオの再生 (AudioSource)\n\nゲームに効果音やBGMを追加する方法を学びます。\n\n## 主要コンポーネント\n- **AudioClip**: 音声ファイル (.wav, .mp3, .ogg など)。Projectウィンドウにインポートします。\n- **AudioSource**: シーン内で音を再生するコンポーネント。ゲームオブジェクトにアタッチします。\n- **AudioListener**: シーン内の音を聞くコンポーネント。通常、メインカメラに1つだけアタッチされています。\n\n## AudioSource の主なプロパティ\n- **AudioClip**: 再生する音声クリップ。\n- **Output**: 音声の出力先 (通常は AudioMixer 経由で AudioListener へ)。\n- **Play On Awake**: true の場合、シーン開始時に自動再生。\n- **Loop**: true の場合、繰り返し再生 (BGMなどに)。\n- **Volume**: 音量 (0-1)。\n- **Pitch**: ピッチ (1が通常)。\n- **Spatial Blend**: 2D (0) と 3D (1) のブレンド。3Dにすると音源からの距離や方向で聞こえ方が変わる。\n\n## スクリプトからの再生\n\`\`\`csharp\nusing UnityEngine;\n\npublic class SoundPlayer : MonoBehaviour\n{\n    public AudioClip jumpSound;\n    public AudioClip coinSound;\n    private AudioSource audioSource;\n\n    void Start()\n    {\n        audioSource = GetComponent<AudioSource>();\n        if (audioSource == null) // AudioSourceがなければ追加\n        {\n            audioSource = gameObject.AddComponent<AudioSource>();\n        }\n    }\n\n    public void PlayJumpSound()\n    {\n        if (jumpSound != null)\n        {\n            audioSource.PlayOneShot(jumpSound, 0.7f); // PlayOneShotは重複再生可能、第二引数で音量スケール\n        }\n    }\n\n    public void PlayCoinSound()\n    {\n        if (coinSound != null)\n        {\n            // audioSource.clip = coinSound; // こちらはBGMなど上書きして再生する場合\n            // audioSource.Play();\n            AudioSource.PlayClipAtPoint(coinSound, transform.position); // 指定位置で一時的なAudioSourceを作成して再生\n        }\n    }\n}\n\`\`\``,
    order: 12,
    xpAward: 20,
  },
  {
    id: 'stage-1-13',
    course_id: 'course-1',
    title: '簡単なゲームのビルド',
    fileType: 'md',
    filePath: 'unity/13-building-game.md',
    markdownContent: `# 簡単なゲームのビルド\n\n作成したUnityプロジェクトをスタンドアロンアプリケーションとしてビルドする方法を学びます。\n\n## ビルド設定 (Build Settings)\n1. File > Build Settings を選択。\n2. **Scenes In Build**: ビルドに含めるシーンを追加します。「Add Open Scenes」で現在開いているシーンを追加できます。最初のシーン (インデックス0) が起動時に読み込まれます。\n3. **Platform**: ビルド対象のプラットフォーム (Windows, macOS, Linux, WebGLなど) を選択。必要に応じて「Switch Platform」をクリック。\n4. **Player Settings...**: アイコン、解像度、会社名、製品名などの詳細設定。\n\n## ビルド実行\n1. Build Settings ウィンドウで「Build」をクリック。\n2. ビルドの保存場所とファイル名を指定。\n3. ビルドが開始されます。完了すると指定した場所に実行ファイル（または関連ファイル群）が生成されます。\n\n## WebGLビルドの注意点\n- ビルドに時間がかかることがあります。\n- サーバーにアップロードして実行する必要があります。ローカルファイルシステムから直接index.htmlを開いても動作しない場合があります。\n- パフォーマンスや機能に一部制約があります。\n\nおめでとうございます！これでUnityの基本的な流れを体験しました。\nここからさらに様々な機能を学んで、あなたのアイデアを形にしていきましょう！\n[Unity Learn](https://learn.unity.com/) でさらに多くのチュートリアルやプロジェクトを見つけることができます。`,
    order: 13,
    xpAward: 30,
  },
  {
    id: 'stage-1-14-md',
    course_id: 'course-1',
    title: 'Unity 最適化ガイド',
    order: 14,
    fileType: 'md',
    filePath: 'unity/14-optimization-guide.md',
    markdownContent: '# Unity 最適化ガイド\n\nUnityプロジェクトのパフォーマンスを向上させるための基本的なテクニック。\n\n## プロファイラの使用\n- Unity Profilerを使用してボトルネックを特定します。\n- CPU使用率、GPU使用率、メモリ割り当てなどを確認します。\n\n## ドローコール削減\n- Static Batching: 静的オブジェクトをまとめて描画。\n- Dynamic Batching: 小さな動的オブジェクトをまとめて描画。\n- GPU Instancing: 同じメッシュとマテリアルを多数描画する場合に効果的。\n\n## アセットの最適化\n- テクスチャ: 解像度を適切に設定し、圧縮形式を使用 (Crunch Compressionなど)。\n- モデル: ポリゴン数を削減。LOD (Level of Detail) を使用。\n\n## スクリプトの最適化\n- Update()内の処理を最小限に。\n- GetComponentの呼び出しをキャッシュする。\n- Coroutineや非同期処理を適切に使用する。',
    xpAward: 20,
  },
  {
    id: 'stage-1-15',
    course_id: 'course-1',
    title: 'アニメーション入門',
    order: 15,
    fileType: 'md',
    filePath: 'unity/15-animation-intro.md',
    markdownContent: `# アニメーション入門\n\nUnityのアニメーションシステム（Mecanim）の基本を学びます。\n\n## Animationウィンドウ\n- オブジェクトのプロパティを時間軸に沿って変化させることでアニメーションクリップを作成します。\n- 位置、回転、スケール、マテリアルの色などをアニメーション化できます。\n\n## Animatorコントローラ\n- アニメーションクリップ間の遷移やブレンドを管理します。\n- ステートマシンを使って、キャラクターの待機、歩行、ジャンプなどの状態遷移を定義します。\n\n## Animatorコンポーネント\n- ゲームオブジェクトにAnimatorコントローラをアタッチし、アニメーションを再生します。`,
    xpAward: 25,
  },
  {
    id: 'stage-1-16-md',
    course_id: 'course-1',
    title: 'シェーダーグラフ入門',
    order: 16,
    fileType: 'md',
    filePath: 'unity/16-shader-graph-intro.md',
    markdownContent: `# シェーダーグラフ入門\n\nUnityのシェーダーグラフを使用して、コードを書かずにカスタムシェーダーを作成する基本を学びます。\n\n## シェーダーグラフとは\n- ノードベースのインターフェースで視覚的にシェーダーを作成できるツール。\n- PBR (Physically Based Rendering) シェーダーやUnlitシェーダーを作成可能。\n\n## 基本的な使い方\n1. Create > Shader > (PBR Graph / Unlit Graph) で新しいシェーダーグラフアセットを作成。\n2. 作成したシェーダーグラフをダブルクリックしてエディタを開く。\n3. ノードを追加し、接続してシェーダーロジックを構築。\n4. Save Asset をクリックしてシェーダーを保存。\n5. 作成したシェーダーからマテリアルを作成し、オブジェクトに適用。\n\n## ノードの例\n- **Input**: Texture 2D Asset, Color, Vector1/2/3/4 など\n- **Math**: Add, Subtract, Multiply, Lerp など\n- **UV**: Tiling and Offset, Rotate など\n- **Master Node**: シェーダーの最終的な出力を定義 (PBR Master, Unlit Master)`,
    xpAward: 20,
  },
  {
    id: 'stage-1-17',
    course_id: 'course-1',
    title: 'バージョン管理 (Git)',
    order: 17,
    fileType: 'md',
    filePath: 'unity/17-version-control.md',
    markdownContent: `# バージョン管理 (Git)\n\nUnityプロジェクトでGitを使用する際の基本的な設定とベストプラクティスを学びます。\n\n## .gitignore\n- Unityが生成する一時ファイルやローカル設定ファイルをバージョン管理対象から除外します。\n- GitHubが提供するUnity用の \`.gitignore\` テンプレートが便利です。\n\n## 大規模アセットの管理\n- Git LFS (Large File Storage) を使用して、大きなテクスチャやモデルファイルを効率的に扱います。`,
    xpAward: 15,
  },
  {
    id: 'stage-1-18',
    course_id: 'course-1',
    title: 'デバッグとプロファイリング',
    order: 18,
    fileType: 'md',
    filePath: 'unity/18-debugging-profiling.md',
    markdownContent: `# デバッグとプロファイリング\n\nUnityでのデバッグ方法とパフォーマンス最適化のためのプロファイラツールの使い方を学びます。\n\n## Debug.Log\n- コンソールにメッセージを出力して、変数の値や処理の流れを確認します。\n\n## Profilerウィンドウ\n- CPU使用率、メモリ使用量、レンダリング統計などをリアルタイムで確認し、パフォーマンスのボトルネックを特定します。`,
    xpAward: 20,
  },

  // Ruby入門 Stages (course-2)
  {
    id: 'stage-2-1',
    course_id: 'course-2',
    title: 'Rubyの概要と環境構築',
    fileType: 'md',
    filePath: 'ruby/01-intro-setup.md',
    markdownContent: `# Rubyの概要と環境構築\n\nRubyは、まつもとゆきひろ氏によって開発されたオブジェクト指向スクリプト言語です。\n\n## 特徴\n- シンプルで読みやすい構文\n- 強力なメタプログラミング機能\n- Ruby on Railsなどの有名なフレームワーク\n\n## 環境構築\n- **Windows**: RubyInstallerを使用\n- **macOS**: rbenv や asdf を推奨\n- **Linux**: rbenv や RVM、またはディストリビューションのパッケージマネージャ\n\n[Ruby公式サイト](https://www.ruby-lang.org/)`,
    order: 1,
    xpAward: 10,
  },
  {
    id: 'stage-2-2',
    course_id: 'course-2',
    title: '基本的な構文',
    fileType: 'md',
    filePath: 'ruby/02-basic-syntax.md',
    markdownContent: `# 基本的な構文\n\nRubyの基本的な文法要素を学びましょう。\n\n## 変数と定数\n\`\`\`ruby\nmessage = "Hello, Ruby!" # 変数\nPI = 3.14159            # 定数 (大文字で始まる)\n\`\`\`\n\n## 条件分岐\n\`\`\`ruby\nscore = 85\nif score >= 80\n  puts "Great!"\nelsif score >= 60\n  puts "Good."\nelse\n  puts "Keep trying."\nend\n\`\`\`\n\n## ループ\n\`\`\`ruby\n5.times do |i|\n  puts "Iteration: #{i}"\nend\n\nfruits = ["apple", "banana", "cherry"]\nfruits.each do |fruit|\n  puts fruit\nend\n\`\`\``,
    order: 2,
    xpAward: 15,
  },
  {
    id: 'stage-2-3',
    course_id: 'course-2',
    title: 'メソッドとクラス',
    fileType: 'md',
    filePath: 'ruby/03-methods-classes.md',
    markdownContent: `# メソッドとクラス\n\nRubyは純粋なオブジェクト指向言語です。メソッドとクラスの概念を理解しましょう。\n\n## メソッド定義\n\`\`\`ruby\ndef greet(name)\n  "Hello, #{name}!"\nend\n\nputs greet("Alice") # => Hello, Alice!\n\`\`\`\n\n## クラス定義\n\`\`\`ruby\nclass Dog\n  def initialize(name)\n    @name = name\n  end\n\n  def bark\n    "#{@name} says Woof!"\n  end\nend\n\nmy_dog = Dog.new("Buddy")\nputs my_dog.bark # => Buddy says Woof!\n\`\`\``,
    order: 3,
    xpAward: 20,
  },
   {
    id: 'stage-2-4',
    course_id: 'course-2',
    title: 'ブロックとイテレータ',
    fileType: 'md',
    filePath: 'ruby/04-blocks-iterators.md',
    markdownContent: `# ブロックとイテレータ\n\nRubyの強力な機能であるブロックとイテレータについて学びます。\n\n## ブロック\nブロックは \`do...end\` または \`{...}\` で囲まれたコードの塊です。メソッドに渡して処理をカスタマイズできます。\n\`\`\`ruby\n[1, 2, 3].each do |number|\n  puts number * 2\nend\n# Output:\n# 2\n# 4\n# 6\n\n[1, 2, 3].map { |n| n * n } # => [1, 4, 9]\n\`\`\`\n\n## イテレータ\nイテレータはブロックを受け取り、コレクションの各要素に対してそのブロックを実行するメソッドです。\n\`each\`, \`map\`, \`select\`, \`reject\` などが代表的なイテレータです。\n\n\`\`\`ruby\nnumbers = [1, 2, 3, 4, 5, 6]\neven_numbers = numbers.select { |n| n.even? }\nputs even_numbers.inspect # => [2, 4, 6]\n\`\`\``,
    order: 4,
    xpAward: 25,
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
    xpAward: 10,
  },
  {
    id: 'stage-3-2',
    course_id: 'course-3',
    title: 'Firebaseプロジェクト連携',
    fileType: 'md',
    filePath: 'nextjs-firebase/02-firebase-setup.md',
    markdownContent: '# Firebaseプロジェクト連携\n\nFirebaseプロジェクトを作成し、Next.jsアプリと連携します。',
    order: 2,
    xpAward: 15,
  },
  {
    id: 'stage-3-3',
    course_id: 'course-3',
    title: 'Firestoreデータ操作',
    fileType: 'md',
    filePath: 'nextjs-firebase/03-firestore-crud.md',
    markdownContent: '# Firestoreデータ操作\n\nFirestoreデータベースの基本的なCRUD操作を学びます。',
    order: 3,
    xpAward: 20,
  },
  {
    id: 'stage-3-4',
    course_id: 'course-3',
    title: 'Firebase Authentication',
    fileType: 'md',
    filePath: 'nextjs-firebase/04-firebase-auth.md',
    markdownContent: '# Firebase Authentication\n\nFirebase Authenticationを用いたユーザー認証機能を実装します。',
    order: 4,
    xpAward: 25,
  },
  {
    id: 'stage-3-5',
    course_id: 'course-3',
    title: 'Firebase Hostingデプロイ',
    fileType: 'md',
    filePath: 'nextjs-firebase/05-firebase-hosting.md',
    markdownContent: '# Firebase Hostingデプロイ\n\n作成したアプリケーションをFirebase Hostingにデプロイします。',
    order: 5,
    xpAward: 30,
  },

  // Machine Learning Project Stages (course-4)
  { id: 'stage-4-1', course_id: 'course-4', title: 'プロジェクト概要と目標設定', fileType: 'md', filePath: 'ml-project/01-overview.md', markdownContent: '# プロジェクト概要と目標設定\n\nこの機械学習プロジェクトの全体像と達成目標を明確にします。', order: 1, xpAward: 10 },
  { id: 'stage-4-2', course_id: 'course-4', title: 'データ収集と前処理', fileType: 'md', filePath: 'ml-project/02-data-preprocessing.md', markdownContent: '# データ収集と前処理\n\nモデル学習に必要なデータの収集方法と、クリーニング・整形手順を学びます。', order: 2, xpAward: 20 },
  { id: 'stage-4-3', course_id: 'course-4', title: 'モデル選択と基礎理論', fileType: 'md', filePath: 'ml-project/03-model-selection.md', markdownContent: '# モデル選択と基礎理論\n\nプロジェクトに適した機械学習モデルを選択し、その背景理論を理解します。', order: 3, xpAward: 20 },
  { 
    id: 'stage-4-4-md', 
    course_id: 'course-4', 
    title: 'モデル学習と評価', 
    fileType: 'md', 
    filePath: 'ml-project/04-training-evaluation.md', 
    markdownContent: '# モデル学習と評価\n\n選択したモデルの学習プロセスと、その性能を評価するための主要な指標について解説します。\n\n## 学習プロセス\n- データセットの分割（訓練用、検証用、テスト用）\n- 損失関数と最適化アルゴリズムの選択\n- エポック数、バッチサイズなどの設定\n\n## 評価指標\n- **分類問題**: 正解率、適合率、再現率、F1スコア、混同行列、ROC曲線、AUC\n- **回帰問題**: MSE（平均二乗誤差）、RMSE（二乗平均平方根誤差）、MAE（平均絶対誤差）、R2スコア（決定係数）', 
    order: 4, 
    xpAward: 15 
  },
  { id: 'stage-4-5', course_id: 'course-4', title: 'ハイパーパラメータ調整', fileType: 'md', filePath: 'ml-project/05-hyperparameter-tuning.md', markdownContent: '# ハイパーパラメータ調整\n\nモデルの性能を最大限に引き出すためのハイパーパラメータ調整テクニックを学びます。', order: 5, xpAward: 25 },
  { id: 'stage-4-6', course_id: 'course-4', title: '結果の解釈と報告', fileType: 'md', filePath: 'ml-project/06-results-reporting.md', markdownContent: '# 結果の解釈と報告\n\n学習結果を正しく解釈し、効果的な報告書を作成する方法を身につけます。', order: 6, xpAward: 15 },
  { id: 'stage-4-7', course_id: 'course-4', title: 'デプロイ戦略の検討', fileType: 'md', filePath: 'ml-project/07-deployment-strategy.md', markdownContent: '# デプロイ戦略の検討\n\n完成したモデルを実際の運用環境にデプロイするための戦略を検討します。', order: 7, xpAward: 30 },

];


export const mockStages: Stage[] = [
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-1'), 'course-1'),
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-2'), 'course-2'),
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-3'), 'course-3'),
  ...calculatePositions(rawStages.filter(s => s.course_id === 'course-4'), 'course-4'),
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
  { id: 'link-1-13-14md', from_stage_id: 'stage-1-13', to_stage_id: 'stage-1-14-md' },
  { id: 'link-1-14md-15', from_stage_id: 'stage-1-14-md', to_stage_id: 'stage-1-15' },
  { id: 'link-1-15-16md', from_stage_id: 'stage-1-15', to_stage_id: 'stage-1-16-md' },
  { id: 'link-1-16md-17', from_stage_id: 'stage-1-16-md', to_stage_id: 'stage-1-17' },
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
  { id: 'link-4-3-4md', from_stage_id: 'stage-4-3', to_stage_id: 'stage-4-4-md' },
  { id: 'link-4-4md-5', from_stage_id: 'stage-4-4-md', to_stage_id: 'stage-4-5' },
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

// XP and Level constants
export const XP_PER_LEVEL = 100;

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const getXpForNextLevel = (level: number): number => {
  return level * XP_PER_LEVEL;
};


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


export const completeStage = (userId: string, stageId: string): StageCompletionResult => {
  let progress = getProgressForStage(userId, stageId);
  const stage = getStageById(stageId);
  let xpAwarded = 0;
  let leveledUp = false;
  let oldLevel = mockUser.level;
  let newLevel = mockUser.level;

  if (!stage) {
    throw new Error("Stage not found");
  }

  if (!progress) {
    progress = {
      id: `progress-${mockUserProgress.length + 1}`,
      user_id: userId,
      stage_id: stageId,
      completed_at: new Date().toISOString(),
    };
    mockUserProgress.push(progress);

    // Award XP and update level
    xpAwarded = stage.xpAward;
    mockUser.xp += xpAwarded;
    oldLevel = mockUser.level;
    newLevel = calculateLevel(mockUser.xp);
    if (newLevel > oldLevel) {
      leveledUp = true;
      mockUser.level = newLevel;
    }
  }

  const courseIdForStage = stage.course_id;
  if (courseIdForStage) {
    const course = mockCourses.find(c => c.id === courseIdForStage);
    if (course) {
        const stagesForThisCourse = getStagesForCourse(courseIdForStage);
        const completedCount = stagesForThisCourse.filter(s => !!getProgressForStage(userId, s.id)).length;
        course.completedStages = completedCount;
    }
  }

  return { progress, xpAwarded, leveledUp, newLevel: leveledUp ? newLevel : undefined, oldLevel: leveledUp ? oldLevel : undefined };
};

// Simulate fetching file content. In a real app, this would involve API calls or file system access.
export async function fetchStageContent(stage: Stage): Promise<string> {
  // All stages are now MD
  return stage.markdownContent || `Error: Markdown content not found for ${stage.title}`;
}

// Initialize completedStages for courses based on mockUserProgress
mockCourses.forEach(course => {
  const stages = getStagesForCourse(course.id);
  const completedStagesCount = stages.filter(stage =>
    mockUserProgress.some(p => p.user_id === mockUser.id && p.stage_id === stage.id)
  ).length;
  course.completedStages = completedStagesCount;
  course.totalStages = stages.length;
});

