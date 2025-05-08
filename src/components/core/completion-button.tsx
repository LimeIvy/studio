"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRightCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress } from '@/lib/types';
import { completeStage as apiCompleteStage, getProgressForStage } from '@/lib/mock-data'; // Using mock API
import { mockUser } from '@/lib/mock-data';

interface CompletionButtonProps {
  stageId: string;
  userId: string; // This would typically come from auth context
  onComplete?: (progress: UserProgress) => void;
  nextStageId?: string | null;
  courseId: string;
}

export function CompletionButton({ stageId, userId, onComplete, nextStageId, courseId }: CompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialCompletion = () => {
      const progress = getProgressForStage(userId, stageId);
      setIsCompleted(!!progress);
      setIsLoading(false);
    };
    checkInitialCompletion();
  }, [stageId, userId]);
  

  const handleComplete = async () => {
    if (isCompleted) {
      if (nextStageId) {
        // Navigate to next stage (actual navigation handled by Link in parent)
        console.log("Navigating to next stage:", nextStageId);
      }
      return;
    }

    setIsLoading(true);
    try {
      const progress = apiCompleteStage(userId, stageId); // Mock API call
      setIsCompleted(true);
      if (onComplete) {
        onComplete(progress);
      }
      toast({
        title: "Stage Complete!",
        description: "Congratulations on completing this stage.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to mark stage as complete:", error);
      toast({
        title: "Error",
        description: "Could not mark stage as complete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isCompleted) { // Only show skeleton if not initially completed
    return <Button disabled className="w-full md:w-auto min-w-[200px] h-12 text-lg animate-pulse">Loading...</Button>;
  }

  return (
    <Button 
      onClick={handleComplete} 
      disabled={isLoading && !isCompleted} // disable while loading initial state and not yet completed
      className="w-full md:w-auto min-w-[200px] h-12 text-lg"
      variant={isCompleted ? "default" : "default"} // Use accent for primary action
      aria-live="polite"
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Stage Completed!
          {nextStageId && (
            <span className="ml-2 opacity-80">(Next <ArrowRightCircle className="inline h-4 w-4"/>)</span>
          )}
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" /> Mark as Complete
        </>
      )}
    </Button>
  );
}
