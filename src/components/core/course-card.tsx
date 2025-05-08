import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const progressPercentage = course.totalStages && course.totalStages > 0 
    ? ((course.completedStages ?? 0) / course.totalStages) * 100 
    : 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        {course.imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={course.imageUrl}
              alt={course.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="course theme"
            />
          </div>
        )}
         {!course.imageUrl && (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {course.description}
        </CardDescription>
        
        {course.totalStages !== undefined && (
          <div className="mt-auto">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{course.completedStages ?? 0} / {course.totalStages} stages</span>
            </div>
            <Progress value={progressPercentage} className="w-full h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/courses/${course.id}`}>
            {progressPercentage === 100 ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Review Course
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" /> Start Learning
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
