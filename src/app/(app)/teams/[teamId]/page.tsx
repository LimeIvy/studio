
"use client";
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUser, getTeamById, getTeamCoursesForUser, getStagesForCourse, mockUserProgress } from '@/lib/mock-data';
import type { TeamMember, Course } from '@/lib/types';
import { Users, Settings, PlusCircle, BookOpen, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { CourseCard } from '@/components/core/course-card';
import { Badge } from '@/components/ui/badge';

// Mock function to get user details by ID - in a real app, this would be an API call
const getUserById = (userId: string) => {
  if (userId === mockUser.id) return mockUser;
  // Add other mock users if needed for team display
  const otherUsers: Record<string, { name: string, avatarUrl?: string, email: string }> = {
    'user-456': { name: 'Bob Smith', avatarUrl: 'https://picsum.photos/seed/bob/100/100', email: 'bob@example.com' },
    'user-789': { name: 'Carol White', avatarUrl: 'https://picsum.photos/seed/carol/100/100', email: 'carol@example.com' },
    'user-alpha': { name: 'Alpha Lead', avatarUrl: 'https://picsum.photos/seed/alpha/100/100', email: 'alpha@example.com' },
  };
  return otherUsers[userId] || { name: '不明なユーザー', email: 'unknown@example.com' };
};


export default function TeamDetailsPage() {
  const params = useParams() as { teamId: string };
  const router = useRouter();
  const team = getTeamById(params.teamId);
  
  if (!team) {
    notFound();
  }

  const currentUser = mockUser;
  const teamCourses = getTeamCoursesForUser(currentUser.id).filter(c => c.teamId === team.id);
  
  const coursesWithProgress = teamCourses.map(course => {
    const stages = getStagesForCourse(course.id);
    const completedStagesCount = stages.filter(stage => 
      mockUserProgress.some(p => p.user_id === currentUser.id && p.stage_id === stage.id)
    ).length;
    return {
      ...course,
      totalStages: stages.length,
      completedStages: completedStagesCount,
    };
  });

  const currentUserMemberInfo = team.members.find(m => m.userId === currentUser.id);
  const canManageTeam = currentUserMemberInfo?.role === 'leader';
  const canCreateCourseForTeam = currentUserMemberInfo?.role === 'leader' || currentUserMemberInfo?.role === 'editor';


  return (
    <div className="space-y-8">
       <Button variant="outline" onClick={() => router.push('/team-hub')} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        チームハブへ戻る
      </Button>
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/20 p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold text-foreground">{team.name}</CardTitle>
              </div>
              <CardDescription className="text-md text-muted-foreground">{team.description || 'このチームには説明がありません。'}</CardDescription>
            </div>
            {canManageTeam && (
              <Button asChild size="lg">
                <Link href={`/teams/${team.id}/settings`}>
                  <Settings className="mr-2 h-5 w-5" /> チーム設定
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">チームコース</h2>
              {canCreateCourseForTeam && (
                <Button asChild>
                  <Link href={`/courses/new?teamId=${team.id}`}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 新しいコースを追加
                  </Link>
                </Button>
              )}
            </div>
            {coursesWithProgress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {coursesWithProgress.map((course: Course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-lg bg-card">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-lg text-muted-foreground">このチームにはまだコースがありません。</p>
                {canCreateCourseForTeam && (
                  <p className="text-sm text-muted-foreground mt-1">上のボタンから新しいコースを追加できます。</p>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">チームメンバー ({team.members.length}人)</h2>
            <div className="space-y-3">
              {team.members.map(member => {
                const memberUser = getUserById(member.userId);
                return (
                  <Card key={member.userId} className="p-4 flex items-center justify-between bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={memberUser?.avatarUrl || `https://picsum.photos/seed/${member.userId}/40/40`} alt={memberUser?.name || 'メンバー'} data-ai-hint="user avatar"/>
                        <AvatarFallback>{memberUser?.name?.charAt(0) || 'M'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{memberUser?.name || 'メンバー名不明'}</p>
                        <p className="text-xs text-muted-foreground">{memberUser?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === 'leader' ? 'default' : 'secondary'} className="capitalize">
                        {member.role === 'leader' ? 'リーダー' : member.role === 'editor' ? '編集者' : 'メンバー'}
                      </Badge>
                      {canManageTeam && member.userId !== currentUser.id && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="役割編集 (未実装)">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="削除 (未実装)">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
            {canManageTeam && (
                 <Button variant="outline" className="mt-6 w-full sm:w-auto" disabled> {/* Add disabled for mock */}
                    <PlusCircle className="mr-2 h-4 w-4" /> メンバーを招待 (未実装)
                </Button>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
