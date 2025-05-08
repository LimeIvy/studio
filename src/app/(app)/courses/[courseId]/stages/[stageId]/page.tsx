
"use client";
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getCourseById, getStageById, getStagesForCourse, mockUser, getProgressForStage, fetchStageContent } from '@/lib/mock-data';
import type { Stage } from '@/lib/types';
import { MarkdownDisplay } from '@/components/core/markdown-display';
import { CompletionButton } from '@/components/core/completion-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, FileText, FileType } from 'lucide-react';
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
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }
    if (!stageContent) {
      return <p>コンテンツを読み込めませんでした。</p>;
    }

    if (stage.fileType === 'md') {
      return <MarkdownDisplay content={stageContent} />;
    }
    if (stage.fileType === 'pdf') {
      // For a real app, you might use a library like react-pdf or a more robust embedding solution.
      // This is a simplified example. Direct iframe embedding might have cross-origin issues
      // if the PDF is not served from the same domain or with appropriate CORS headers.
      // For mock data, we can display a message or a link.
      // If filePath is a public URL:
      // return <iframe src={stage.filePath} width="100%" height="600px" title={stage.title} />;
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <FileType className="h-6 w-6 text-primary" />
            <span>PDFドキュメント: {stage.title}</span>
          </div>
          <p className="text-muted-foreground">
            このステージのコンテンツはPDF形式です。
            {stage.markdownContent && <span className="block mt-2">概要: {stage.markdownContent}</span>}
          </p>
          <Button asChild variant="outline">
            {/* In a real app, filePath might be a direct URL or need processing */}
            <a href={`/mock-pdfs/${stage.filePath}`} target="_blank" rel="noopener noreferrer">
              PDFを開く (新規タブ)
              <FileText className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            注意: これはモック実装です。実際のアプリケーションでは、PDFはここに埋め込まれるか、より統合された方法で表示されます。
            上記のリンクは、PDFが `/public/mock-pdfs/` ディレクトリに配置されていることを前提としています。
          </p>
        </div>
      );
    }
    return <p>不明なファイル形式です。</p>;
  };


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
            ステージ {stage.order}: {stage.title}
          </li>
        </ol>
      </nav>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 border-b">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">{stage.title}</CardTitle>
          <p className="text-sm text-muted-foreground">コース: {course.title} - ステージ {stage.order} ({stage.fileType.toUpperCase()})</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8 min-h-[300px]">
          {renderContent()}
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

