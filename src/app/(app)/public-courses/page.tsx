
import { CourseCard } from '@/components/core/course-card';
import { getPublicCourses, mockUserProgress, mockUser } from '@/lib/mock-data';
import type { Course } from '@/lib/types';
import { getStagesForCourse } from '@/lib/mock-data';
import { FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PublicCoursesPage() {
  const publicCourses = getPublicCourses();
  const coursesWithProgress = publicCourses.map(course => {
    const stages = getStagesForCourse(course.id);
    const completedStagesCount = stages.filter(stage =>
      mockUserProgress.some(p => p.user_id === mockUser.id && p.stage_id === stage.id)
    ).length;
    return {
      ...course,
      totalStages: stages.length,
      completedStages: completedStagesCount,
    };
  });

  return (
    <div className="space-y-8">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">公開コース</h1>
          <p className="text-lg text-muted-foreground mt-1">
            誰でも参加できるコースを探して、新しいスキルを学びましょう。
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/courses/new?target=public">
            <FilePlus2 className="mr-2 h-5 w-5" />
            公開コースを作成
          </Link>
        </Button>
      </section>

      <section>
        {coursesWithProgress.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coursesWithProgress.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">現在受講可能な公開コースはありません。</p>
            <p className="text-md text-muted-foreground mt-2">コースを作成して学習コミュニティを始めましょう！</p>
          </div>
        )}
      </section>
    </div>
  );
}
