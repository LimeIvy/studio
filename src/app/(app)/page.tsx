
import { CourseCard } from '@/components/core/course-card';
import { mockCourses, mockUserProgress, mockUser } from '@/lib/mock-data';
import type { Course } from '@/lib/types';
import { getStagesForCourse } from '@/lib/mock-data';

export default function HomePage() {
  const coursesWithProgress = mockCourses.map(course => {
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
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 sm:text-5xl">CourseFlowへようこそ！</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          下のコースを選択して、学習の旅を始めましょう。インタラクティブなステージと進捗追跡でスキルアップを目指します。
        </p>
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
            <p className="text-xl text-muted-foreground">現在受講可能なコースはありません。</p>
            <p className="text-md text-muted-foreground mt-2">しばらくしてから再度ご確認ください。</p>
          </div>
        )}
      </section>
    </div>
  );
}
