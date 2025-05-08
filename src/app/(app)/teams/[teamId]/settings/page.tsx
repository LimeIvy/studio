
"use client";
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTeamById, mockUser } from '@/lib/mock-data';
import { ArrowLeft, Save, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeamSettingsPage() {
  const params = useParams() as { teamId: string };
  const router = useRouter();
  const { toast } = useToast();
  const team = getTeamById(params.teamId);

  if (!team) {
    notFound();
  }

  // Basic permission check - in a real app, this would be more robust
  if (team.leaderId !== mockUser.id) {
    toast({
      title: "アクセス権限がありません",
      description: "このチームの設定を編集する権限がありません。",
      variant: "destructive",
    });
    router.push(`/teams/${team.id}`); // Redirect if not leader
    return null; 
  }

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('teamName') as string;
    const description = formData.get('teamDescription') as string;
    
    // Simulate saving changes
    console.log("Saving team settings (mock):", { teamId: team.id, name, description });
    // Update mock data (would be API call)
    team.name = name;
    team.description = description;

    toast({
      title: "設定保存成功",
      description: `チーム「${name}」の設定が更新されました。`,
    });
  };

  const handleDeleteTeam = () => {
     if(confirm(`本当にチーム「${team.name}」を削除しますか？この操作は元に戻せません。`)){
        // Simulate deleting team
        console.log("Deleting team (mock):", team.id);
        // Remove from mock data (would be API call)
        // mockTeams = mockTeams.filter(t => t.id !== team.id); // This won't work directly with const array
        toast({
          title: "チーム削除 (シミュレーション)",
          description: `チーム「${team.name}」が削除されました。実際にはデータは削除されていません。`,
          variant: "destructive"
        });
        router.push('/team-hub');
     }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" onClick={() => router.push(`/teams/${team.id}`)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        チーム詳細へ戻る
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">チーム設定: {team.name}</CardTitle>
          </div>
          <CardDescription>チーム名、説明、メンバー管理などを行います。</CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveChanges}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="teamName">チーム名</Label>
              <Input id="teamName" name="teamName" defaultValue={team.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="teamDescription">チーム説明</Label>
              <Textarea id="teamDescription" name="teamDescription" defaultValue={team.description} className="mt-1" rows={3} />
            </div>
            
            {/* Placeholder for member management */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-foreground">メンバー管理</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">メンバーの追加、削除、役割変更を行います。(この機能は現在開発中です)</p>
                <Button variant="outline" disabled>メンバーを管理</Button>
            </div>

          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-3">
            <Button type="submit" size="lg">
              <Save className="mr-2 h-5 w-5" />
              変更を保存
            </Button>
             <Button type="button" variant="destructive" size="lg" onClick={handleDeleteTeam}>
                <Trash2 className="mr-2 h-5 w-5" />
                チームを削除
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
