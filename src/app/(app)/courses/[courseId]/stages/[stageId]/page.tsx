
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseById, getStageById, getStagesForCourse, mockUser, getProgressForStage } from '@/lib/mock-data';
import { MarkdownDisplay } from '@/components/core/markdown-display';
import { CompletionButton } from '@/components/core/completion-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface StagePageProps {
  params: {
    courseId: string;
    stageId: string;
  };
}

export default function StagePage({ params }: StagePageProps) {
  const course = getCourseById(params.courseId);
  const stage = getStageById(params.stageId);
  
  if (!course || !stage || stage.course_id !== course.id) {
    notFound();
  }

  const courseStages = getStagesForCourse(params.courseId);
  const currentIndex = courseStages.findIndex(s => s.id === stage.id);
  const prevStage = currentIndex > 0 ? courseStages[currentIndex - 1] : null;
  const nextStage = currentIndex < courseStages.length - 1 ? courseStages[currentIndex + 1] : null;
  const isCompleted = !!getProgressForStage(mockUser.id, stage.id);

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors flex items-center">
              <Home className="h-4 w-4 mr-1.5" /> コース一覧
            </Link>
          </li>
          <li><span className="mx-1">/</span></li>
          <li>
            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
              {course.title}
            </Link>
          </li>
          <li><span className="mx-1">/</span></li>
          <li className="font-medium text-foreground" aria-current="page">
            {stage.title}
          </li>
        </ol>
      </nav>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 border-b">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">{stage.title}</CardTitle>
          <p className="text-sm text-muted-foreground">コース: {course.title} - ステージ {stage.order}</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <MarkdownDisplay content={stage.markdownContent} />
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            {prevStage && (
              <Button variant="outline" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}/stages/${prevStage.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> 前へ
                </Link>
              </Button>
            )}
             {!prevStage && <div className="flex-1 sm:flex-none"/> /* Spacer */}
          </div>
          
          <div className="my-4 sm:my-0">
            <CompletionButton 
              stageId={stage.id} 
              userId={mockUser.id} 
              nextStageId={nextStage?.id}
              courseId={course.id}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
             {nextStage && isCompleted && (
              <Button variant="default" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}/stages/${nextStage.id}`}>
                  次へ <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {!nextStage && isCompleted && (
               <Button variant="default" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}`}>
                  コースマップへ戻る
                </Link>
              </Button>
            )}
            {(!nextStage || !isCompleted) && <div className="flex-1 sm:flex-none"/> /* Spacer */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
