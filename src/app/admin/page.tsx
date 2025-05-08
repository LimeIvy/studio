
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRightLeft, BookOpen, FileText, ListChecks, Activity, Users, Globe, Settings } from "lucide-react";
import Link from "next/link";
import { mockCourses, mockTeams } from "@/lib/mock-data"; // Import mock data to count

export default function AdminPage() {
  const publicCoursesCount = mockCourses.filter(c => c.mode === 'public').length;
  const teamCoursesCount = mockCourses.filter(c => c.mode === 'team').length;
  const totalStagesCount = mockCourses.reduce((sum, course) => sum + (course.totalStages || 0), 0); // This is a simplified count
  const teamsCount = mockTeams.length;


  const managementSections = [
    { title: "公開コース管理", description: "公開コースの作成、編集、公開設定を行います。", icon: Globe, link: "/public-courses", linkText: "公開コース一覧", count: publicCoursesCount, itemType: "コース" },
    { title: "チームコース管理", description: "チーム専用コースの作成、編集、チーム割り当てを行います。", icon: Users, link: "/team-hub", linkText: "チームコース一覧", count: teamCoursesCount, itemType: "コース"},
    { title: "チーム管理", description: "チームの作成、メンバー管理、チーム設定を行います。", icon: Settings, link: "/team-hub", linkText: "チーム一覧", count: teamsCount, itemType: "チーム" },
    { title: "全ステージ管理", description: "すべてのコースのステージを追加、編集、または削除します。", icon: FileText, link: "#", linkText: "ステージ一覧 (未実装)", count: totalStagesCount, itemType: "ステージ"},
    { title: "ステージリンク管理", description: "ステージ間のフローを定義します。", icon: ArrowRightLeft, link: "#", linkText: "リンクを編集 (未実装)", count: 0, itemType: "リンク"}, // Placeholder for links count
  ];

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">管理ダッシュボード</h1>
            <p className="text-lg text-muted-foreground mt-1">コース、チーム、ステージ、およびそれらの接続を効率的に管理します。</p>
          </div>
          {/* General "Add New" button could lead to a selection page */}
          <Button size="lg" asChild>
             <Link href="/courses/new/public"> {/* Default to creating public course for simplicity */}
                <PlusCircle className="mr-2 h-5 w-5" /> 新規コンテンツを追加
             </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementSections.map((section) => (
          <Card key={section.title} className="hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <section.icon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                現在 <strong className="text-foreground font-semibold">{section.count}</strong> {section.itemType}が利用可能です。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={section.link}>
                  <ListChecks className="mr-2 h-4 w-4" />
                  {section.linkText}
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
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
