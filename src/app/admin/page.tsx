
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRightLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">管理ダッシュボード</h1>
            <p className="text-lg text-muted-foreground">コース、ステージ、およびそれらの接続を管理します。</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 新規コースを追加
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              コース管理
            </CardTitle>
            <CardDescription>既存のコースを追加、編集、または削除します。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">現在 <strong>3</strong> コース利用可能です。</p>
            <Button variant="outline" className="mt-4 w-full">コース一覧</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              ステージ管理
            </CardTitle>
            <CardDescription>コース内のステージを追加、編集、または削除します。マークダウンファイルをアップロードします。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">現在、全コースで <strong>12</strong> ステージあります。</p>
            <Button variant="outline" className="mt-4 w-full">ステージ一覧</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <ArrowRightLeft className="h-5 w-5 text-primary" />
              ステージリンク管理
            </CardTitle>
            <CardDescription>ビジュアルエディタ（例：React Flow）を使用してステージ間のフローを定義します。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">現在 <strong>9</strong> 個のステージリンクが定義されています。</p>
             <Button variant="outline" className="mt-4 w-full">リンクを編集</Button>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>最近の変更と完了の概要。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">管理者のアクティビティログはここに表示されます。</p>
            {/* Placeholder for activity feed */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
