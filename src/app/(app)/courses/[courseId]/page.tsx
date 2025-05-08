
"use client";
import React, { useState } from 'react'; // React must be imported to use React.use
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseById, getStagesForCourse, getLinksForCourse, getProgressForStage, mockUser } from '@/lib/mock-data';
import type { Stage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as CourseCardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Map, Lock, ArrowRightCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkdownDisplay } from '@/components/core/markdown-display';

// This interface describes the shape of the resolved params
interface ResolvedPageParams {
  courseId: string;
}

// This interface describes the props Next.js passes to the page component
interface StageMapPageServerProps {
  params: Promise<ResolvedPageParams>; // params is a Promise
}

export default function StageMapPage({ params: paramsPromise }: StageMapPageServerProps) {
  // Unwrap the promise using React.use()
  // This hook can be used in Client Components.
  const params = React.use(paramsPromise);

  // Now 'params' is of type ResolvedPageParams, i.e., { courseId: string }
  const course = getCourseById(params.courseId);
  
  if (!course) {
    notFound();
  }

  const stages = getStagesForCourse(params.courseId);
  const links = getLinksForCourse(params.courseId);
  const [selectedStageForModal, setSelectedStageForModal] = useState<Stage | null>(null);

  const stageMap = stages.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {} as Record<string, Stage>);

  // Determine map dimensions
  const STAGE_WIDTH = 180; 
  const STAGE_HEIGHT = 100; // Reduced height for simpler card
  const PADDING = 50; 

  const mapWidth = stages.length > 0 
    ? Math.max(...stages.map(s => s.position.x + STAGE_WIDTH)) + PADDING
    : PADDING * 2;
  const mapHeight = stages.length > 0
    ? Math.max(...stages.map(s => s.position.y + STAGE_HEIGHT)) + PADDING * 2 // Added more bottom padding
    : PADDING * 2;
  
  // Logic for the main "Start/Continue Learning" button
  const allStagesCompleted = stages.every(s => !!getProgressForStage(mockUser.id, s.id));
  
  let currentActiveStagesInfo = stages.map(stage => {
    const isCompleted = !!getProgressForStage(mockUser.id, stage.id);
    let isAccessible = false;
    if (stage.order === 1) { // The first stage is always accessible
        isAccessible = true;
    } else {
        // A stage is accessible if any of its prerequisite stages are completed
        const incomingLinks = links.filter(l => l.to_stage_id === stage.id);
        for (const link of incomingLinks) {
            if (getProgressForStage(mockUser.id, link.from_stage_id)) {
                isAccessible = true;
                break;
            }
        }
    }
    return { ...stage, isCompleted, isAccessible, isCurrent: isAccessible && !isCompleted };
  }).filter(s => s.isCurrent).sort((a,b) => a.order - b.order);

  let buttonTargetStageId: string | null = null;
  let buttonText = "Start Learning";

  if (allStagesCompleted && stages.length > 0) {
    buttonTargetStageId = stages[0].id; // Review first stage if all completed
    buttonText = "Review First Stage";
  } else if (currentActiveStagesInfo.length > 0) {
    buttonTargetStageId = currentActiveStagesInfo[0].id;
    const firstActiveStage = currentActiveStagesInfo[0]; // This object has .isCompleted
    // Check if any stage has been completed to determine if user "started" the course
    const userHasStartedCourse = stages.some(s => !!getProgressForStage(mockUser.id, s.id)); // Corrected logic
    buttonText = (firstActiveStage.order === 1 && !firstActiveStage.isCompleted && !userHasStartedCourse)
                  ? "Start Learning" 
                  : "Continue Learning";
  } else if (stages.length > 0) { 
    // If no current active stages (e.g. a gap in the map or all done), default to first stage
    buttonTargetStageId = stages[0].id; // Fallback to first stage
    buttonText = "Review Course";
  }


  // Modal specific logic
  let modalStageIsCompleted = false;
  let modalStageIsAccessible = false;
  let modalButtonText = 'View Stage';
  let modalButtonDisabled = true;

  if (selectedStageForModal) {
      modalStageIsCompleted = !!getProgressForStage(mockUser.id, selectedStageForModal.id);
      
      if (selectedStageForModal.order === 1) { // First stage always accessible
          modalStageIsAccessible = true;
      } else {
          // A stage is accessible if any of its prerequisite stages are completed
          const incomingLinksToModalStage = links.filter(l => l.to_stage_id === selectedStageForModal!.id);
          for (const link of incomingLinksToModalStage) {
              if (getProgressForStage(mockUser.id, link.from_stage_id)) {
                  modalStageIsAccessible = true;
                  break;
              }
          }
      }

      if (modalStageIsAccessible) {
          modalButtonText = modalStageIsCompleted ? "Review Stage" : "Start Stage";
          modalButtonDisabled = false;
      } else {
          modalButtonText = "Stage Locked"; // Text for locked stages
          modalButtonDisabled = true;
      }
  }


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

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6 flex items-center">
          <Map className="mr-3 h-6 w-6 text-primary" />
          Course Map
        </h2>
        {stages.length > 0 ? (
          <div 
            className="relative rounded-lg border bg-card p-4 shadow-sm overflow-auto" 
            style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
          >
            <svg 
              width={mapWidth} 
              height={mapHeight} 
              className="absolute top-0 left-0 pointer-events-none"
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

                return (
                  <line
                    key={link.id}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={cn(
                      "transition-all duration-500",
                      isFromCompleted ? "stroke-primary" : "stroke-border" // Line color based on source completion
                    )}
                    strokeWidth="3"
                    strokeDasharray={isFromCompleted ? "none" : "6,4"} // Dashed if source not completed
                  />
                );
              })}
            </svg>

            {stages.map(stage => {
              const isCompleted = !!getProgressForStage(mockUser.id, stage.id);
              let isAccessible = stage.order === 1; // First stage always accessible
              if (!isAccessible) {
                // Check if any prerequisite stage is completed
                const incomingLinks = links.filter(l => l.to_stage_id === stage.id);
                for (const link of incomingLinks) {
                    if (getProgressForStage(mockUser.id, link.from_stage_id)) {
                        isAccessible = true;
                        break;
                    }
                }
              }
              const isCurrent = isAccessible && !isCompleted;

              // Define card appearance based on state
              let cardClass = 'bg-card hover:shadow-md';
              let icon = <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />; // Default to locked

              if (isCompleted) {
                cardClass = 'bg-green-100 dark:bg-green-800/70 border-green-500 hover:shadow-lg';
                icon = <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />;
              } else if (isCurrent) {
                cardClass = 'bg-blue-100 dark:bg-blue-800/70 border-primary hover:shadow-lg animate-pulse-slow';
                icon = <ArrowRightCircle className="h-5 w-5 text-primary flex-shrink-0" />;
              } else { // Locked (not completed and not current/accessible)
                cardClass = 'bg-muted border-border hover:shadow-md'; // No semi-transparent for locked, just muted
              }
              
              if (!stage.position) return null;

              return (
                <DialogTrigger asChild key={stage.id} onClick={() => setSelectedStageForModal(stage)}>
                  <Card
                    className={cn(
                      "absolute transition-all duration-300 ease-in-out shadow-md cursor-pointer",
                      cardClass
                    )}
                    style={{
                      left: `${stage.position.x}px`,
                      top: `${stage.position.y}px`,
                      width: `${STAGE_WIDTH}px`,
                      height: `${STAGE_HEIGHT}px`,
                      zIndex: 10, // Ensure cards are above lines
                    }}
                    aria-label={`Stage ${stage.order}: ${stage.title}. Status: ${isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'}`}
                  >
                    <CardContent className="p-3 flex flex-col justify-center items-center h-full text-center">
                        {icon}
                        <h3 className="text-sm font-medium leading-tight break-words mt-1">
                          Stage {stage.order}: {stage.title}
                        </h3>
                    </CardContent>
                  </Card>
                </DialogTrigger>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No stages defined for this course yet.</p>
        )}
      </section>

      {selectedStageForModal && (
        <Dialog open={!!selectedStageForModal} onOpenChange={(isOpen) => !isOpen && setSelectedStageForModal(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">Stage {selectedStageForModal.order}: {selectedStageForModal.title}</DialogTitle>
              <DialogDescription>
                {modalStageIsCompleted ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Completed</Badge>
                ) : modalStageIsAccessible ? (
                    <Badge variant="default" className="bg-primary hover:bg-primary/90">Current</Badge>
                ) : (
                    <Badge variant="outline">Locked</Badge>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <MarkdownDisplay content={selectedStageForModal.markdownContent} />
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedStageForModal(null)}>Close</Button>
              <Button asChild disabled={modalButtonDisabled}>
                <Link href={`/courses/${course.id}/stages/${selectedStageForModal.id}`}>
                  {modalButtonText}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
