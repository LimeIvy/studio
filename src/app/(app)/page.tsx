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
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome to CourseFlow!</h1>
        <p className="text-lg text-muted-foreground">
          Select a course below to start your learning journey.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Available Courses</h2>
        {coursesWithProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithProgress.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No courses available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
