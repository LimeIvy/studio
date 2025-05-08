
"use client";
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getCourseById, getStageById, getStagesForCourse, mockUser, getProgressForStage, fetchStageContent } from '@/lib/mock-data';
import type { Stage } from '@/lib/types';
import { MarkdownDisplay } from '@/components/core/markdown-display';
import { CompletionButton } from '@/components/core/completion-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, FileText, FileType, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface StagePageProps {
  // Params will be accessed via the useParams hook
}

export default function StagePage({}: StagePageProps) {
  const routeParams = useParams() as { courseId: string; stageId: string };


  const course = getCourseById(routeParams.courseId);
  const stage = getStageById(routeParams.stageId);

  const [stageContent, setStageContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    if (stage) {
      setIsLoadingContent(true);
      fetchStageContent(stage)
        .then(content => {
          setStageContent(content);
          setIsLoadingContent(false);
        })
        .catch(error => {
          console.error("Failed to fetch stage content:", error);
          setStageContent("ステージコンテンツの読み込みに失敗しました。");
          setIsLoadingContent(false);
        });
    }
  }, [stage]);

  if (!course || !stage || stage.course_id !== course.id) {
    notFound();
  }

  const courseStages = getStagesForCourse(routeParams.courseId);
  const currentIndex = courseStages.findIndex(s => s.id === stage.id);
  const prevStage = currentIndex > 0 ? courseStages[currentIndex - 1] : null;
  const nextStage = currentIndex < courseStages.length - 1 ? courseStages[currentIndex + 1] : null;
  const isCompleted = !!getProgressForStage(mockUser.id, stage.id);

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

    if (stage.fileType === 'md') {
      return <MarkdownDisplay content={stageContent} />;
    }
    if (stage.fileType === 'pdf') {
      return (
        <div className="space-y-6 p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-3 text-xl font-semibold text-foreground">
            <FileType className="h-7 w-7 text-primary" />
            <span>PDFドキュメント: {stage.title}</span>
          </div>
          <CardDescription>
            このステージのコンテンツはPDF形式です。下のボタンからPDFを開いてください。
            {stage.markdownContent && <span className="block mt-3 text-sm">概要: {stage.markdownContent}</span>}
          </CardDescription>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <a href={`/mock-pdfs/${stage.filePath}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <FileText className="mr-2 h-5 w-5" />
              PDFを開く (新規タブ)
            </a>
          </Button>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            注意: このリンクは、PDFが `/public/mock-pdfs/` ディレクトリに配置されていることを前提としています。
          </p>
        </div>
      );
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
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stage.title}</CardTitle>
          <CardDescription className="text-sm pt-1">コース: {course.title} - ステージ {stage.order} ({stage.fileType.toUpperCase()})</CardDescription>
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
              nextStageId={nextStage?.id}
              courseId={course.id}
            />
          </div>

          <div className="flex w-full sm:w-auto justify-end">
             {nextStage && isCompleted ? (
              <Button variant="default" asChild className="flex-1 sm:flex-none">
                <Link href={`/courses/${course.id}/stages/${nextStage.id}`}>
                  次のステージ <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : !nextStage && isCompleted ? (
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
