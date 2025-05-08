import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseById, getStagesForCourse, getLinksForCourse, getProgressForStage, mockUser } from '@/lib/mock-data';
import type { Stage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Map, Lock, ArrowRightCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StageMapPageProps {
  params: {
    courseId: string;
  };
}

export default function StageMapPage({ params }: StageMapPageProps) {
  const course = getCourseById(params.courseId);
  
  if (!course) {
    notFound();
  }

  const stages = getStagesForCourse(params.courseId);
  const links = getLinksForCourse(params.courseId);

  const stageMap = stages.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {} as Record<string, Stage>);

  // Determine map dimensions
  const STAGE_WIDTH = 180; // Approximate width of a stage card
  const STAGE_HEIGHT = 130; // Approximate height of a stage card
  const PADDING = 50; // Padding around the map

  const mapWidth = stages.length > 0 
    ? Math.max(...stages.map(s => s.position.x + STAGE_WIDTH)) + PADDING
    : PADDING * 2;
  const mapHeight = stages.length > 0
    ? Math.max(...stages.map(s => s.position.y + STAGE_HEIGHT)) + PADDING
    : PADDING * 2;

  // Logic for the main "Start/Continue Learning" button
  const allStagesCompleted = stages.every(s => getProgressForStage(mockUser.id, s.id));
  
  let currentStagesInfo = stages.map(stage => {
    const isCompleted = !!getProgressForStage(mockUser.id, stage.id);
    let isAccessible = false;
    if (stage.order === 1) {
        isAccessible = true;
    } else {
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
    buttonTargetStageId = stages[0].id;
    buttonText = "Review First Stage";
  } else if (currentStagesInfo.length > 0) {
    buttonTargetStageId = currentStagesInfo[0].id;
    buttonText = currentStagesInfo[0].order === 1 && !currentStagesInfo[0].isCompleted && stages.filter(s => s.isCompleted).length === 0 
                  ? "Start Learning" 
                  : "Continue Learning";
  } else if (stages.length > 0) { // No current stages, but not all completed
    // Fallback to the first stage if it exists and is not completed (should be caught by currentStagesInfo if accessible)
    // Or if all are done this case is already handled. This implies a broken graph or all initial paths are somehow locked.
    // Default to reviewing the course or first stage.
    buttonTargetStageId = stages[0].id;
    buttonText = "Review Course";
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{course.title}</h1>
              <CardDescription className="text-lg text-muted-foreground">{course.description}</CardDescription>
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
                      isFromCompleted ? "stroke-primary" : "stroke-border"
                    )}
                    strokeWidth="3"
                    strokeDasharray={isFromCompleted ? "none" : "6,4"}
                  />
                );
              })}
            </svg>

            {stages.map(stage => {
              const { isCompleted, isAccessible, isCurrent } = currentStagesInfo.find(s => s.id === stage.id) || 
                { 
                  isCompleted: !!getProgressForStage(mockUser.id, stage.id), 
                  isAccessible: stage.order === 1 || links.some(l => l.to_stage_id === stage.id && !!getProgressForStage(mockUser.id, l.from_stage_id)),
                  isCurrent: (stage.order === 1 || links.some(l => l.to_stage_id === stage.id && !!getProgressForStage(mockUser.id, l.from_stage_id))) && !getProgressForStage(mockUser.id, stage.id)
                };

              let cardClass = 'bg-card hover:shadow-md';
              let badgeText = `Stage ${stage.order}`;
              let icon = <Lock className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />;

              if (isCompleted) {
                cardClass = 'bg-green-100 dark:bg-green-800 border-green-500 hover:shadow-lg';
                badgeText += " - Completed";
                icon = <CheckCircle2 className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />;
              } else if (isCurrent) {
                cardClass = 'bg-blue-100 dark:bg-blue-800 border-primary hover:shadow-lg animate-pulse-slow';
                badgeText += " - Current";
                icon = <ArrowRightCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />;
              } else { // Locked or not yet accessible but not current
                cardClass = 'bg-muted/30 dark:bg-muted/50 border-muted hover:shadow-sm opacity-60';
                badgeText += " - Locked";
              }
              
              if (!stage.position) return null; // Should not happen if data is correct

              return (
                <Card
                  key={stage.id}
                  className={cn(
                    "absolute transition-all duration-300 ease-in-out shadow-md",
                    cardClass
                  )}
                  style={{
                    left: `${stage.position.x}px`,
                    top: `${stage.position.y}px`,
                    width: `${STAGE_WIDTH}px`,
                    height: `${STAGE_HEIGHT}px`,
                    zIndex: 10, 
                  }}
                >
                  <CardContent className="p-3 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start mb-1">
                        {icon}
                        <h3 className="text-base font-medium leading-tight break-words">
                          {stage.title}
                        </h3>
                      </div>
                       <Badge 
                        variant={isCompleted ? "default" : isCurrent ? "default": "outline"} 
                        className={cn(
                            "text-xs whitespace-nowrap",
                            isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : "",
                            isCurrent ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "",
                            !isCompleted && !isCurrent ? "border-muted-foreground text-muted-foreground" : ""
                        )}
                      >
                        {badgeText}
                      </Badge>
                    </div>
                    <Button 
                        asChild 
                        variant={isCompleted ? "outline" : "default"} 
                        size="sm" 
                        className="mt-2 w-full"
                        disabled={!isAccessible && !isCompleted}
                      >
                      <Link href={`/courses/${course.id}/stages/${stage.id}`}>
                        {isCompleted ? 'Review' : isCurrent ? 'Start' : 'View'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No stages defined for this course yet.</p>
        )}
      </section>
    </div>
  );
}
