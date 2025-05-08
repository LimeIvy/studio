
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
    totalStages: 3,
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
    position: { x: 50, y: 150 },
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
    position: { x: 250, y: 150 },
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
    position: { x: 450, y: 150 },
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
    position: { x: 650, y: 150 },
  },
];

export const mockStageLinks: StageLink[] = [
  // Unity
  { id: 'link-1-1-2', from_stage_id: 'stage-1-1', to_stage_id: 'stage-1-2' },
  { id: 'link-1-2-3', from_stage_id: 'stage-1-2', to_stage_id: 'stage-1-3' },
  // Ruby
  { id: 'link-2-1-2', from_stage_id: 'stage-2-1', to_stage_id: 'stage-2-2' },
  { id: 'link-2-2-3', from_stage_id: 'stage-2-2', to_stage_id: 'stage-2-3' },
  { id: 'link-2-3-4', from_stage_id: 'stage-2-3', to_stage_id: 'stage-2-4' },
];

export const mockUserProgress: UserProgress[] = [
  {
    id: 'progress-1',
    user_id: 'user-123',
    stage_id: 'stage-1-1', // Unity - Stage 1
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'progress-2',
    user_id: 'user-123',
    stage_id: 'stage-3-1', // Placeholder for Next.js course if added
    completed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'progress-3',
    user_id: 'user-123',
    stage_id: 'stage-3-2', // Placeholder
    completed_at: new Date().toISOString(),
  },
  {
    id: 'progress-4',
    user_id: 'user-123',
    stage_id: 'stage-3-3', // Placeholder
    completed_at: new Date().toISOString(),
  },
];

// Helper function to get course by ID
export const getCourseById = (courseId: string): Course | undefined =>
  mockCourses.find(course => course.id === courseId);

// Helper function to get stages for a course
export const getStagesForCourse = (courseId: string): Stage[] =>
  mockStages.filter(stage => stage.course_id === courseId).sort((a, b) => a.order - b.order);

// Helper function to get a specific stage
export const getStageById = (stageId: string): Stage | undefined =>
  mockStages.find(stage => stage.id === stageId);

// Helper function to get progress for a user and stage
export const getProgressForStage = (userId: string, stageId: string): UserProgress | undefined =>
  mockUserProgress.find(p => p.user_id === userId && p.stage_id === stageId);

// Helper function to get all links for a course
export const getLinksForCourse = (courseId: string): StageLink[] => {
  const courseStages = getStagesForCourse(courseId).map(s => s.id);
  return mockStageLinks.filter(link => courseStages.includes(link.from_stage_id) && courseStages.includes(link.to_stage_id));
};

// Helper function to simulate marking a stage complete
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
  return progress;
};

