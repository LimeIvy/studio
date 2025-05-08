
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUser, getUserTeams, getTeamCoursesForUser, getStagesForCourse, mockUserProgress } from '@/lib/mock-data';
import type { Team, Course } from '@/lib/types';
import { Users, PlusCircle, Eye, Settings, ArrowRight, BookOpen } from 'lucide-react';
import { CourseCard } from '@/components/core/course-card';

export default function TeamHubPage() {
  const currentUser = mockUser;
  const userTeams = getUserTeams(currentUser.id);

  return (
    <div className="space-y-10">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">チームハブ</h1>
          <p className="text-lg text-muted-foreground mt-1">
            所属するチームのコースやアクティビティを確認・管理します。
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/teams/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            新しいチームを作成
          </Link>
        </Button>
      </section>

      {userTeams.length === 0 ? (
        <section className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground">まだどのチームにも所属していません</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            新しいチームを作成するか、既存のチームからの招待をお待ちください。
          </p>
        </section>
      ) : (
        userTeams.map(team => {
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
            <section key={team.id} className="space-y-6">
              <Card className="shadow-lg border-border">
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <CardTitle className="text-2xl text-primary">{team.name}</CardTitle>
                      <CardDescription className="mt-1">{team.description || 'このチームには説明がありません。'}</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                       <Button variant="outline" asChild>
                        <Link href={`/teams/${team.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> チーム詳細
                        </Link>
                      </Button>
                      {canManageTeam && (
                        <Button variant="secondary" asChild>
                          <Link href={`/teams/${team.id}/settings`}>
                            <Settings className="mr-2 h-4 w-4" /> チーム管理
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground">チームコース</h3>
                    {canCreateCourseForTeam && (
                      <Button asChild>
                        <Link href={`/courses/new?teamId=${team.id}`}>
                          <PlusCircle className="mr-2 h-4 w-4" /> このチームにコースを追加
                        </Link>
                      </Button>
                    )}
                  </div>
                  {coursesWithProgress.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {coursesWithProgress.map((course: Course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-md text-muted-foreground">このチームにはまだコースがありません。</p>
                      {canCreateCourseForTeam && (
                         <p className="text-sm text-muted-foreground mt-1">上のボタンから新しいコースを追加できます。</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          );
        })
      )}
    </div>
  );
}
