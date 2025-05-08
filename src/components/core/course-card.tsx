
import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const progressPercentage = course.totalStages && course.totalStages > 0 
    ? Math.round(((course.completedStages ?? 0) / course.totalStages) * 100)
    : 0;
  
  const isCompleted = progressPercentage === 100;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl border-border group">
      <CardHeader className="p-0 relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <Image
            src={course.imageUrl || `https://picsum.photos/seed/${course.id}/400/225`}
            alt={course.title}
            width={400}
            height={225}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="course theme"
          />
        </div>
        {isCompleted && (
          <Badge variant="default" className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-primary-foreground shadow-md">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            完了済
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-5 flex-grow flex flex-col">
        <CardTitle className="text-lg font-semibold mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {course.description}
        </CardDescription>
        
        {course.totalStages !== undefined && (
          <div className="mt-auto space-y-1.5">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-medium">進捗: {course.completedStages ?? 0} / {course.totalStages} ステージ</span>
              <span className="font-semibold text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`${progressPercentage}% 完了`} className="w-full h-2.5 rounded-full [&>div]:bg-primary" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-0 border-t border-border mt-auto bg-muted/30">
        <Button asChild className="w-full" variant={isCompleted ? "secondary" : "default"}>
          <Link href={`/courses/${course.id}`} className="font-semibold">
            {isCompleted ? (
              <>
                <BookOpen className="mr-2 h-4.5 w-4.5" /> コースを復習
              </>
            ) : (course.completedStages ?? 0) > 0 ? (
              <>
                <ArrowRight className="mr-2 h-4.5 w-4.5" /> 学習を続ける
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4.5 w-4.5" /> 学習を開始
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
