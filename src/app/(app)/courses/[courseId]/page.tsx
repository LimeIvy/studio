import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseById, getStagesForCourse, getLinksForCourse, getProgressForStage, mockUser } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Circle, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StageMapPageProps {
  params: {
    courseId: string;
  };
}

// This is a server component
export default function StageMapPage({ params }: StageMapPageProps) {
  const course = getCourseById(params.courseId);
  
  if (!course) {
    notFound();
  }

  const stages = getStagesForCourse(params.courseId);
  const links = getLinksForCourse(params.courseId); // We'll use this later for actual flow chart

  // For simplicity, we'll find the first uncompleted stage or the first stage if all are completed
  let startStageId = stages[0]?.id;
  for (const stage of stages) {
    const progress = getProgressForStage(mockUser.id, stage.id);
    if (!progress) {
      startStageId = stage.id;
      break;
    }
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
            {startStageId && (
              <Button asChild size="lg" className="mt-4 md:mt-0">
                <Link href={`/courses/${course.id}/stages/${startStageId}`}>
                  {stages.every(s => getProgressForStage(mockUser.id, s.id)) ? "Review First Stage" : "Start Learning"}
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
          Course Stages
        </h2>
        {stages.length > 0 ? (
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isCompleted = !!getProgressForStage(mockUser.id, stage.id);
              const nextStage = stages[index + 1];
              return (
                <Card key={stage.id} className={`transition-all duration-300 ease-in-out hover:shadow-md ${isCompleted ? 'bg-secondary/30 border-green-500/50' : 'bg-card'}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center mb-1">
                           {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 mr-2 text-muted-foreground" />
                          )}
                          <h3 className="text-xl font-medium">{stage.title}</h3>
                        </div>
                        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                          Stage {stage.order} {isCompleted ? " - Completed" : ""}
                        </Badge>
                      </div>
                      <Button asChild variant="outline" size="sm" className="mt-2 sm:mt-0 w-full sm:w-auto">
                        <Link href={`/courses/${course.id}/stages/${stage.id}`}>
                          {isCompleted ? 'Review Stage' : 'View Stage'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    {/* Placeholder for "connected from/to" info, useful for flowchart */}
                    {/* For now, just simple connections for list view */}
                    {index < stages.length -1 && (
                       <div className="mt-4 pl-7">
                          <svg width="20" height="30" viewBox="0 0 20 30" className="text-muted-foreground/50">
                            <path d="M10 0 V30 M0 20 L10 30 L20 20" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                       </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No stages defined for this course yet.</p>
        )}
      </section>
      {/* Placeholder for React Flow visualization - to be implemented later */}
      {/* <div className="mt-12 p-4 border rounded-lg bg-muted/20 h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Interactive stage map (flowchart) will be displayed here.</p>
      </div> */}
    </div>
  );
}
