
"use client";
import Link from 'next/link';
import { notFound, useParams as useNextParams } from 'next/navigation';
import { getCourseById, getStageById, getStagesForCourse, mockUser, getProgressForStage, fetchStageContent, getLinksForCourse } from '@/lib/mock-data';
import type { Stage, StageCompletionResult } from '@/lib/types';
import { MarkdownDisplay } from '@/components/core/markdown-display';
import { CompletionButton } from '@/components/core/completion-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronRight, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';


interface StagePageProps {
  params: { courseId: string; stageId: string };
}

export default function StagePage({ params: paramsFromProps }: StagePageProps) {
  const routeParams = useNextParams() as { courseId: string; stageId: string };
  
  const course = getCourseById(routeParams.courseId);
  const stage = getStageById(routeParams.stageId);

  const [stageContent, setStageContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isStageCompleted, setIsStageCompleted] = useState(() => 
    stage ? !!getProgressForStage(mockUser.id, stage.id) : false
  );
  
  const [currentUserXp, setCurrentUserXp] = useState(mockUser.xp);
  const [currentUserLevel, setCurrentUserLevel] = useState(mockUser.level);


  // Check if stage is accessible
  useEffect(() => {
    if (stage && course) {
      const stagesForCourse = getStagesForCourse(course.id);
      const linksForCourse = getLinksForCourse(course.id);
      let isAccessible = stage.order === 1;
      if (!isAccessible) {
        const incomingLinks = linksForCourse.filter(l => l.to_stage_id === stage.id);
        if (incomingLinks.length === 0 && stage.order !== 1) {
          const previousStageInOrder = stagesForCourse.find(s => s.order === stage.order - 1);
          if (previousStageInOrder && getProgressForStage(mockUser.id, previousStageInOrder.id)) {
            isAccessible = true;
          }
        } else {
          for (const link of incomingLinks) {
            if (getProgressForStage(mockUser.id, link.from_stage_id)) {
              isAccessible = true;
              break;
            }
          }
        }
      }
      if (!isAccessible) {
        notFound(); // Or redirect to course page with a message
      }
    }
  }, [stage, course]);


  useEffect(() => {
    if (stage) {
      setIsLoadingContent(true);
      fetchStageContent(stage)
        .then(content => {
          setStageContent(content);
          setIsLoadingContent(false);
        })
        .catch(error => {
          console.error("ステージコンテンツの読み込みに失敗しました:", error);
          setStageContent("ステージコンテンツの読み込みに失敗しました。");
          setIsLoadingContent(false);
        });
      
      const progress = getProgressForStage(mockUser.id, stage.id);
      setIsStageCompleted(!!progress);
      setCurrentUserXp(mockUser.xp);
      setCurrentUserLevel(mockUser.level);
    }
  }, [stage]); 

  if (!course || !stage || stage.course_id !== course.id) {
    notFound();
  }

  const courseStages = getStagesForCourse(routeParams.courseId);
  const currentIndex = courseStages.findIndex(s => s.id === stage.id);
  const prevStage = currentIndex > 0 ? courseStages[currentIndex - 1] : null;
  const nextStage = currentIndex < courseStages.length - 1 ? courseStages[currentIndex + 1] : null;

  const handleStageCompletion = (result: StageCompletionResult) => {
    if (result.progress.stage_id === stage.id) {
      setIsStageCompleted(true);
      setCurrentUserXp(mockUser.xp); 
      setCurrentUserLevel(mockUser.level);
    }
  };

  const renderContent = () => {
    if (isLoadingContent) {
      return (
        <div className="space-y-4 p-2">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full mt-4" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }
    if (!stageContent) {
      return <p className="text-destructive text-center p-4">コンテンツを読み込めませんでした。</p>;
    }

    // Only MD files are supported now
    if (stage.fileType === 'md') {
      return <MarkdownDisplay content={stageContent} />;
    }
   
    return <p className="text-destructive text-center p-4">不明なファイル形式です。</p>;
  };


  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors flex items-center">
              <Home className="h-4 w-4 mr-1" /> ホーム
            </Link>
          </li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li>
            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[150px] sm:max-w-xs md:max-w-sm" title={course.title}>
              {course.title}
            </Link>
          </li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="font-medium text-foreground line-clamp-1 max-w-[150px] sm:max-w-xs md:max-w-sm" aria-current="page" title={stage.title}>
            {stage.title}
          </li>
        </ol>
      </nav>

      <Card className="shadow-xl overflow-hidden border-border">
        <CardHeader className="bg-muted/50 p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stage.title}</CardTitle>
              <CardDescription className="text-sm pt-1">コース: {course.title} - ステージ {stage.order} ({stage.fileType.toUpperCase()})</CardDescription>
            </div>
            {isStageCompleted && ( // Show XP award only if stage is completed
                 <Badge variant="outline" className="mt-2 sm:mt-0 text-base px-3 py-1.5 border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 dark:bg-green-500/20">
                    <Zap className="mr-2 h-5 w-5 text-green-600 dark:text-green-500" />
                    {stage.xpAward} XP獲得済
                </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 min-h-[300px] bg-background">
          {renderContent()}
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex w-full sm:w-auto">
            {prevStage ? (
              <Button variant="outline" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}/stages/${prevStage.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> 前のステージ
                </Link>
              </Button>
            ) : <div className="flex-1 sm:flex-none"/> /* Spacer */}
          </div>
          
          <div className="my-2 sm:my-0 w-full sm:w-auto flex justify-center">
            <CompletionButton 
              stageId={stage.id} 
              userId={mockUser.id} 
              onComplete={handleStageCompletion}
              courseId={course.id}
            />
          </div>

          <div className="flex w-full sm:w-auto justify-end">
             {nextStage && isStageCompleted ? (
              <Button variant="default" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}/stages/${nextStage.id}`}>
                  次のステージ <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : !nextStage && isStageCompleted ? (
               <Button variant="default" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}`}>
                  コースマップへ戻る
                </Link>
              </Button>
            ) : <div className="flex-1 sm:flex-none"/> /* Spacer */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

