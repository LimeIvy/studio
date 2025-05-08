
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRightLeft, BookOpen, FileText, ListChecks, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const stats = [
    { title: "コース管理", description: "既存のコースを追加、編集、または削除します。", count: 3, icon: BookOpen, link: "#", linkText: "コース一覧" },
    { title: "ステージ管理", description: "コース内のステージを追加、編集、または削除します。マークダウンやPDFファイルをアップロードします。", count: 12, icon: FileText, link: "#", linkText: "ステージ一覧" },
    { title: "ステージリンク管理", description: "ビジュアルエディタを使用してステージ間のフローを定義します。", count: 9, icon: ArrowRightLeft, link: "#", linkText: "リンクを編集" },
  ];

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">管理ダッシュボード</h1>
            <p className="text-lg text-muted-foreground mt-1">コース、ステージ、およびそれらの接続を効率的に管理します。</p>
          </div>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> 新規コースを追加
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{stat.title}</CardTitle>
              </div>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                現在 <strong className="text-foreground font-semibold">{stat.count}</strong> {stat.title.includes("コース") ? "コース" : stat.title.includes("ステージ管理") ? "ステージ" : "リンク"}が利用可能です。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={stat.link}>
                  <ListChecks className="mr-2 h-4 w-4" />
                  {stat.linkText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
      
      <section>
        <Card className="shadow-md border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">最近のアクティビティ</CardTitle>
            </div>
            <CardDescription>最近の変更と完了の概要、およびシステムログ。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed border-border rounded-md p-8 text-center">
              <p className="text-muted-foreground">管理者のアクティビティログはここに表示されます。</p>
              <p className="text-xs text-muted-foreground mt-1">(この機能は現在開発中です)</p>
            </div>
            {/* Placeholder for activity feed items */}
            {/* Example: 
            <ul className="space-y-3 mt-4">
              <li className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">ユーザー「管理者A」がコース「Unity入門」を更新しました - 3分前</li>
              <li className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">ステージ「Ruby基本構文」に新しいPDFが追加されました - 1時間前</li>
            </ul> 
            */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
