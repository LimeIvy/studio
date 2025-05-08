
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
  // const params = React.use(Promise.resolve(paramsFromProps)); // Avoid React.use for now due to potential issues in some environments/versions

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
      setModalContent(null); 
    }
  }, [selectedStageForModal]);


  const stageMap = stages.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {} as Record<string, Stage>);

  // Determine map dimensions
  const STAGE_WIDTH = 200;
  const STAGE_HEIGHT = 80;
  const PADDING_X = 50; // Horizontal padding within the SVG
  const PADDING_Y = 50; // Vertical padding within the SVG
  const ROW_SPACING = STAGE_HEIGHT + 40; 
  const COL_SPACING = STAGE_WIDTH + 70; 

  const maxCols = stages.reduce((max, s) => {
    if (!s.position) return max;
    return Math.max(max, Math.floor((s.position.x - PADDING_X) / COL_SPACING) +1);
  },0);


  const maxRows = stages.reduce((max, s) => {
    if (!s.position) return max;
    return Math.max(max, Math.floor((s.position.y - PADDING_Y) / ROW_SPACING) +1);
  }, 0);
  

  const mapWidth = stages.length > 0
    ? PADDING_X * 2 + Math.max(0, maxCols - 1) * COL_SPACING + STAGE_WIDTH
    : PADDING_X * 2 + STAGE_WIDTH; 

  const mapHeight = stages.length > 0
    ? PADDING_Y * 2 + Math.max(0, maxRows -1) * ROW_SPACING + STAGE_HEIGHT
    : PADDING_Y * 2 + STAGE_HEIGHT; 


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
            <div className="w-full overflow-x-auto rounded-lg border bg-card p-4 shadow-sm">
              <div
                className="relative mx-auto" 
                style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
              >
                <svg
                  width={mapWidth}
                  height={mapHeight}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ zIndex: 0 }} 
                  aria-hidden="true"
                >
                  {links.map(link => {
                    const fromStage = stageMap[link.from_stage_id];
                    const toStage = stageMap[link.to_stage_id];
                    if (!fromStage || !toStage || !fromStage.position || !toStage.position) return null;

                    const isFromCompleted = !!getProgressForStage(mockUser.id, fromStage.id);
                    const markerSize = isFromCompleted ? 7 : 5; 
                    const strokeWidth = isFromCompleted ? 2.5 : 2;

                    const x1_center = fromStage.position.x + STAGE_WIDTH / 2;
                    const y1_center = fromStage.position.y + STAGE_HEIGHT / 2;
                    const x2_center = toStage.position.x + STAGE_WIDTH / 2;
                    const y2_center = toStage.position.y + STAGE_HEIGHT / 2;
                    
                    const arrowId = `arrow-${link.id}`;

                    let pathX1 = x1_center;
                    let pathY1 = y1_center;
                    let pathX2 = x2_center;
                    let pathY2 = y2_center;

                    const dx = x2_center - x1_center;
                    const dy = y2_center - y1_center;
                    const angle = Math.atan2(dy, dx);

                    const offsetX = Math.cos(angle) * (STAGE_WIDTH / 2 + 2); // +2 for small gap
                    const offsetY = Math.sin(angle) * (STAGE_HEIGHT / 2 + 2); // +2 for small gap

                    if (Math.abs(dx) > Math.abs(dy)) { // More horizontal
                        pathX1 = x1_center + (dx > 0 ? STAGE_WIDTH / 2 : -STAGE_WIDTH / 2);
                        pathY1 = y1_center + Math.tan(angle) * (pathX1 - x1_center);
                        pathX2 = x2_center - (dx > 0 ? STAGE_WIDTH / 2 : -STAGE_WIDTH / 2);
                        pathY2 = y2_center - Math.tan(angle) * (x2_center - pathX2);
                    } else { // More vertical
                        pathY1 = y1_center + (dy > 0 ? STAGE_HEIGHT / 2 : -STAGE_HEIGHT / 2);
                        pathX1 = x1_center + (pathY1 - y1_center) / Math.tan(angle);
                        pathY2 = y2_center - (dy > 0 ? STAGE_HEIGHT / 2 : -STAGE_HEIGHT / 2);
                        pathX2 = x2_center - (y2_center - pathY2) / Math.tan(angle);
                    }
                    // Clamp end points to be within target card boundaries
                    pathX2 = Math.max(toStage.position.x, Math.min(pathX2, toStage.position.x + STAGE_WIDTH));
                    pathY2 = Math.max(toStage.position.y, Math.min(pathY2, toStage.position.y + STAGE_HEIGHT));


                    let ctrlX1 = pathX1;
                    let ctrlY1 = pathY1;
                    let ctrlX2 = pathX2;
                    let ctrlY2 = pathY2;

                    // Straight line if stages are in the same row or same column (approximately)
                    const isSameRow = Math.abs(y1_center - y2_center) < ROW_SPACING / 2;
                    const isSameCol = Math.abs(x1_center - x2_center) < COL_SPACING / 2;
                    
                    // Specific fix for course-1, stage-1-4 to stage-1-5
                    const isUnity4to5 = fromStage.id === 'stage-1-4' && toStage.id === 'stage-1-5';

                    if (isSameRow || isSameCol || isUnity4to5) {
                      // Use linear path (handled by M pathX1 pathY1 L pathX2 pathY2 as default for simple C)
                      ctrlX1 = (pathX1 + pathX2) / 2;
                      ctrlY1 = (pathY1 + pathY2) / 2;
                      ctrlX2 = ctrlX1;
                      ctrlY2 = ctrlY1;
                    } else { // S-curve for diagonal connections
                        if (Math.abs(dx) > Math.abs(dy)) { // More horizontal S-curve
                            ctrlX1 = pathX1 + dx * 0.4;
                            ctrlY1 = pathY1;
                            ctrlX2 = pathX2 - dx * 0.4;
                            ctrlY2 = pathY2;
                        } else { // More vertical S-curve
                            ctrlX1 = pathX1;
                            ctrlY1 = pathY1 + dy * 0.4;
                            ctrlX2 = pathX2;
                            ctrlY2 = pathY2 - dy * 0.4;
                        }
                    }

                    return (
                      <g key={link.id}>
                         <defs>
                          <marker
                            id={arrowId}
                            markerWidth={markerSize}
                            markerHeight={markerSize}
                            refX={markerSize} 
                            refY={markerSize/2}
                            orient="auto-start-reverse"
                            markerUnits="userSpaceOnUse"
                          >
                            <path d={`M0,0 L${markerSize},${markerSize/2} L0,${markerSize} Z`}
                                  className={cn(isFromCompleted ? "fill-primary" : "fill-border")} />
                          </marker>
                        </defs>
                        <path
                          d={`M ${pathX1} ${pathY1} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${pathX2} ${pathY2}`}
                          className={cn(
                            "transition-all duration-500",
                            isFromCompleted ? "stroke-primary" : "stroke-border"
                          )}
                          strokeWidth={strokeWidth}
                          fill="none"
                          strokeDasharray={isFromCompleted ? "none" : "5,5"}
                          markerEnd={`url(#${arrowId})`}
                        />
                      </g>
                    );
                  })}
                </svg>

                <div style={{ position: 'relative', zIndex: 1, width: `${mapWidth}px`, height: `${mapHeight}px` }}>
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
                    } else if (isAccessible) { // Changed from isCurrent to isAccessible
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
                            zIndex: 10, 
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
                </div> 
              </div>
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

