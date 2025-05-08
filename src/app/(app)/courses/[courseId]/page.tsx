"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams as useNextParams } from 'next/navigation';
import { getCourseById, getStagesForCourse, getLinksForCourse, getProgressForStage, mockUser, fetchStageContent } from '@/lib/mock-data';
import type { Stage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as CourseCardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Map, Lock, ArrowRightCircle, ExternalLink, FileText, FileType } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkdownDisplay } from '@/components/core/markdown-display';
import { Skeleton } from '@/components/ui/skeleton';


interface StageMapPageProps {
  params: { courseId: string };
}


export default function StageMapPage({ params: paramsFromProps }: StageMapPageProps) {
  const params = useNextParams() as { courseId: string };

  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  const stages = getStagesForCourse(params.courseId);
  const links = getLinksForCourse(params.courseId);
  const [selectedStageForModal, setSelectedStageForModal] = useState<Stage | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isLoadingModalContent, setIsLoadingModalContent] = useState(false);


  useEffect(() => {
    if (selectedStageForModal) {
      setIsLoadingModalContent(true);
      fetchStageContent(selectedStageForModal)
        .then(content => {
          setModalContent(content);
          setIsLoadingModalContent(false);
        })
        .catch(error => {
          console.error("Failed to fetch modal content:", error);
          setModalContent("ステージコンテンツの読み込みに失敗しました。");
          setIsLoadingModalContent(false);
        });
    } else {
      setModalContent(null); // Clear content when modal closes
    }
  }, [selectedStageForModal]);


  const stageMap = stages.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {} as Record<string, Stage>);

  // Determine map dimensions
  const STAGE_WIDTH = 200;
  const STAGE_HEIGHT = 80;
  const PADDING = 50;
  const ROW_SPACING = STAGE_HEIGHT + 40; // Vertical spacing
  const COL_SPACING = STAGE_WIDTH + 70; // Horizontal spacing

  // Calculate dynamic map width and height based on content
  const maxCols = stages.reduce((max, s) => {
    if (!s.position) return max;
    return Math.max(max, Math.floor((s.position.x - PADDING) / COL_SPACING) + 1);
  },1);

  const maxRows = stages.reduce((max, s) => {
    if (!s.position) return max;
    return Math.max(max, Math.floor((s.position.y - PADDING) / ROW_SPACING) + 1);
  }, 1);

  const mapWidth = stages.length > 0
    ? PADDING * 2 + (maxCols - 1) * COL_SPACING + STAGE_WIDTH
    : PADDING * 2;

  const mapHeight = stages.length > 0
    ? PADDING * 2 + (maxRows - 1) * ROW_SPACING + STAGE_HEIGHT
    : PADDING * 2;


  // Logic for the main "Start/Continue Learning" button
  const allStagesCompleted = stages.every(s => !!getProgressForStage(mockUser.id, s.id));

  let currentActiveStagesInfo = stages.map(stage => {
    const isCompleted = !!getProgressForStage(mockUser.id, stage.id);
    let isAccessible = false;
    if (stage.order === 1) {
        isAccessible = true;
    } else {
        const incomingLinks = links.filter(l => l.to_stage_id === stage.id);
        if (incomingLinks.length === 0 && stage.order !==1) {
             const previousStageInOrder = stages.find(s => s.order === stage.order -1);
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
    return { ...stage, isCompleted, isAccessible, isCurrent: isAccessible && !isCompleted };
  }).filter(s => s.isCurrent).sort((a,b) => a.order - b.order);

  let buttonTargetStageId: string | null = null;
  let buttonText = "学習を開始";

  if (allStagesCompleted && stages.length > 0) {
    buttonTargetStageId = stages.sort((a,b) => a.order - b.order)[0].id;
    buttonText = "最初のステージを復習";
  } else if (currentActiveStagesInfo.length > 0) {
    buttonTargetStageId = currentActiveStagesInfo[0].id;
    const firstActiveStage = currentActiveStagesInfo[0];
    const userHasStartedCourse = stages.some(s => !!getProgressForStage(mockUser.id, s.id));
    buttonText = (firstActiveStage.order === 1 && !firstActiveStage.isCompleted && !userHasStartedCourse)
                  ? "学習を開始"
                  : "学習を続ける";
  } else if (stages.length > 0) {
    buttonTargetStageId = stages.sort((a,b) => a.order - b.order)[0].id;
    buttonText = "コースを開始";
  }


  // Modal specific logic
  let modalStageIsCompleted = false;
  let modalStageIsAccessible = false;
  let modalButtonText = 'ステージを見る';
  let modalButtonDisabled = true;
  let modalStatusText = 'ロック中';
  let modalStatusVariant: "default" | "outline" | "secondary" | "destructive" | null | undefined = "outline";


  if (selectedStageForModal) {
      modalStageIsCompleted = !!getProgressForStage(mockUser.id, selectedStageForModal.id);

      if (selectedStageForModal.order === 1) {
          modalStageIsAccessible = true;
      } else {
          const incomingLinksToModalStage = links.filter(l => l.to_stage_id === selectedStageForModal!.id);
          if (incomingLinksToModalStage.length === 0 && selectedStageForModal.order !== 1) {
             const previousStageInOrder = stages.find(s => s.order === selectedStageForModal.order -1);
             if (previousStageInOrder && getProgressForStage(mockUser.id, previousStageInOrder.id)) {
                modalStageIsAccessible = true;
             }
          } else {
            for (const link of incomingLinksToModalStage) {
                if (getProgressForStage(mockUser.id, link.from_stage_id)) {
                    modalStageIsAccessible = true;
                    break;
                }
            }
          }
      }

      if (modalStageIsAccessible) {
          if (modalStageIsCompleted) {
            modalButtonText = "ステージを復習";
            modalStatusText = "完了";
            modalStatusVariant = "default";
          } else {
            modalButtonText = "ステージを開始";
            modalStatusText = "学習可能";
            modalStatusVariant = "default";
          }
          modalButtonDisabled = false;
      } else {
          modalButtonText = "ステージはロック中";
          modalStatusText = "ロック中";
          modalStatusVariant = "outline";
          modalButtonDisabled = true;
      }
  }

 const renderModalContent = () => {
    if (isLoadingModalContent) {
      return (
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }
    if (!modalContent || !selectedStageForModal) {
      return <p>コンテンツを読み込めませんでした。</p>;
    }

    if (selectedStageForModal.fileType === 'md') {
      return <MarkdownDisplay content={modalContent} />;
    }
    if (selectedStageForModal.fileType === 'pdf') {
      return (
         <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <FileType className="h-6 w-6 text-primary" />
            <span>PDFドキュメント: {selectedStageForModal.title}</span>
          </div>
          <p className="text-muted-foreground">
            このステージのコンテンツはPDF形式です。
            {selectedStageForModal.markdownContent && <span className="block mt-2">概要: {selectedStageForModal.markdownContent}</span>}
          </p>
           <Button asChild variant="outline">
            <a href={`/mock-pdfs/${selectedStageForModal.filePath}`} target="_blank" rel="noopener noreferrer">
              PDFを開く (新規タブ)
              <FileText className="ml-2 h-4 w-4" />
            </a>
          </Button>
           <p className="text-xs text-muted-foreground">
            注意: このリンクは、PDFが `/public/mock-pdfs/` ディレクトリに配置されていることを前提としています。
          </p>
        </div>
      );
    }
    return <p>不明なファイル形式です。</p>;
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{course.title}</h1>
              <CourseCardDescription className="text-lg text-muted-foreground">{course.description}</CourseCardDescription>
            </div>
            {buttonTargetStageId && (
              <Button asChild size="lg" className="mt-4 md:mt-0">
                <Link href={`/courses/${course.id}/stages/${buttonTargetStageId}`}>
                  {buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Dialog open={!!selectedStageForModal} onOpenChange={(isOpen) => { if (!isOpen) setSelectedStageForModal(null); }}>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6 flex items-center">
            <Map className="mr-3 h-6 w-6 text-primary" />
            コースマップ
          </h2>
          {stages.length > 0 ? (
            <div
              className="relative rounded-lg border bg-card p-4 shadow-sm overflow-auto"
              style={{ minWidth: '100%', width: `${mapWidth}px`, height: `${mapHeight}px` }}
            >
              <svg
                width={mapWidth}
                height={mapHeight}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ zIndex: 0 }} // SVG layer
                aria-hidden="true"
              >
                {links.map(link => {
                  const fromStage = stageMap[link.from_stage_id];
                  const toStage = stageMap[link.to_stage_id];
                  if (!fromStage || !toStage || !fromStage.position || !toStage.position) return null;

                  const isFromCompleted = !!getProgressForStage(mockUser.id, fromStage.id);

                  const x1 = fromStage.position.x + STAGE_WIDTH / 2;
                  const y1 = fromStage.position.y + STAGE_HEIGHT / 2;
                  const x2 = toStage.position.x + STAGE_WIDTH / 2;
                  const y2 = toStage.position.y + STAGE_HEIGHT / 2;

                  const dx = (x2 - x1);
                  const dy = (y2 - y1);
                  const curveStrength = 0.3;

                  let ctrlX1 = x1 + dx * curveStrength;
                  let ctrlY1 = y1;
                  let ctrlX2 = x2 - dx * curveStrength;
                  let ctrlY2 = y2;

                  if (Math.abs(dx) < STAGE_WIDTH * 0.5 && Math.abs(dy) > STAGE_HEIGHT * 0.5) {
                    ctrlX1 = x1 + dx * 0.5 + Math.sign(dx+0.01) * COL_SPACING * 0.2;
                    ctrlY1 = y1 + dy * 0.4;
                    ctrlX2 = x2 - dx * 0.5 - Math.sign(dx+0.01) * COL_SPACING * 0.2;
                    ctrlY2 = y2 - dy * 0.4;
                  } else {
                    ctrlX1 = x1 + dx * 0.4;
                    ctrlY1 = y1 + dy * 0.1;
                    ctrlX2 = x2 - dx * 0.4;
                    ctrlY2 = y2 - dy * 0.1;
                  }

                  const arrowId = `arrow-${link.id}`;
                  const markerSize = isFromCompleted ? 6 : 4;

                  return (
                    <g key={link.id}>
                       <defs>
                        <marker
                          id={arrowId}
                          markerWidth={markerSize * 1.5}
                          markerHeight={markerSize * 1.5}
                          refX={markerSize * (isFromCompleted ? 0.9 : 0.8) }
                          refY={markerSize * 0.75}
                          orient="auto-start-reverse"
                          markerUnits="userSpaceOnUse"
                        >
                          <path d={`M0,${markerSize/4} L0,${markerSize*0.75} L${markerSize * 0.75},${markerSize/2} Z`}
                                className={cn(isFromCompleted ? "fill-primary" : "fill-border")} />
                        </marker>
                      </defs>
                      <path
                        d={`M ${x1} ${y1} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${x2} ${y2}`}
                        className={cn(
                          "transition-all duration-500",
                          isFromCompleted ? "stroke-primary" : "stroke-border"
                        )}
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray={isFromCompleted ? "none" : "5,5"}
                        markerEnd={`url(#${arrowId})`}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Wrapper for all stage cards to control their stacking context */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {stages.map(stage => {
                  const isCompleted = !!getProgressForStage(mockUser.id, stage.id);
                  let isAccessible = stage.order === 1;
                  if (!isAccessible) {
                    const incomingLinks = links.filter(l => l.to_stage_id === stage.id);
                     if (incomingLinks.length === 0 && stage.order !==1) {
                         const previousStageInOrder = stages.find(s => s.order === stage.order -1);
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
                  const isCurrent = isAccessible && !isCompleted;

                  let cardClass = 'border-border bg-card hover:shadow-md';
                  let icon = <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
                  let statusAriaLabel = 'ロック中';

                  if (isCompleted) {
                    cardClass = 'border-green-500 bg-green-100 dark:bg-green-900/50 hover:shadow-lg';
                    icon = <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />;
                    statusAriaLabel = '完了';
                  } else if (isCurrent) {
                    cardClass = 'border-primary bg-primary/10 dark:bg-primary/20 hover:shadow-lg';
                    icon = <ArrowRightCircle className="h-5 w-5 text-primary flex-shrink-0" />;
                    statusAriaLabel = '学習可能';
                  }

                  if (!stage.position) return null;

                  return (
                    <DialogTrigger asChild key={stage.id} onClick={() => setSelectedStageForModal(stage)}>
                      <Card
                        className={cn(
                          "absolute transition-all duration-300 ease-in-out shadow-md cursor-pointer flex flex-col items-center justify-center text-center",
                          cardClass
                        )}
                        style={{
                          left: `${stage.position.x}px`,
                          top: `${stage.position.y}px`,
                          width: `${STAGE_WIDTH}px`,
                          height: `${STAGE_HEIGHT}px`,
                          // Individual zIndex removed, parent div controls stacking over SVG
                        }}
                        aria-label={`ステージ ${stage.order}: ${stage.title}. ステータス: ${statusAriaLabel}`}
                      >
                        <CardContent className="p-2 flex flex-col justify-center items-center h-full">
                            {icon}
                            <h3 className="text-xs font-medium leading-tight break-words mt-1">
                              ステージ {stage.order}: {stage.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">({stage.fileType.toUpperCase()})</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                  );
                })}
              </div> {/* End of cards wrapper */}
            </div>
          ) : (
            <p className="text-muted-foreground">このコースにはまだステージが定義されていません。</p>
          )}
        </section>

        {selectedStageForModal && (
          <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">ステージ {selectedStageForModal.order}: {selectedStageForModal.title}</DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm text-muted-foreground pt-1">
                   <Badge
                    variant={modalStatusVariant}
                    className={cn(
                        "text-xs",
                        modalStageIsCompleted && "bg-green-600 hover:bg-green-700 text-primary-foreground",
                        modalStageIsAccessible && !modalStageIsCompleted && "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                   >
                    {modalStatusText} ({selectedStageForModal.fileType.toUpperCase()})
                   </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent py-4">
              {renderModalContent()}
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedStageForModal(null)}>閉じる</Button>
              <Button asChild disabled={modalButtonDisabled}>
                <Link href={`/courses/${course.id}/stages/${selectedStageForModal.id}`}>
                  {modalButtonText}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
