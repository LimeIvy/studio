
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRightCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress } from '@/lib/types';
import { completeStage as apiCompleteStage, getProgressForStage } from '@/lib/mock-data'; 
import { mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CompletionButtonProps {
  stageId: string;
  userId: string; 
  onComplete?: (progress: UserProgress) => void;
  nextStageId?: string | null;
  courseId: string;
}

export function CompletionButton({ stageId, userId, onComplete, nextStageId, courseId }: CompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialCompletion = () => {
      setIsLoading(true);
      const progress = getProgressForStage(userId, stageId);
      setIsCompleted(!!progress);
      setIsLoading(false);
    };
    checkInitialCompletion();
  }, [stageId, userId]);
  

  const handleComplete = async () => {
    if (isCompleted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      const progress = apiCompleteStage(userId, stageId); 
      setIsCompleted(true);
      if (onComplete) {
        onComplete(progress);
      }
      toast({
        title: "ステージ完了！ 🎉",
        description: "おめでとうございます！このステージをクリアしました。",
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      console.error("ステージ完了マーク付け失敗:", error);
      toast({
        title: "エラーが発生しました",
        description: "ステージを完了としてマークできませんでした。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) { 
    return (
      <Button disabled className="w-full sm:w-auto min-w-[220px] h-12 text-lg animate-pulse bg-muted hover:bg-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        読み込み中...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleComplete} 
      disabled={isCompleted || isSubmitting}
      className={cn(
        "w-full sm:w-auto min-w-[220px] h-12 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105",
        isCompleted ? "bg-green-600 hover:bg-green-700 text-primary-foreground focus:ring-green-500" : "bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary",
        isSubmitting && "opacity-75 cursor-not-allowed"
      )}
      aria-live="polite"
      aria-busy={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          処理中...
        </>
      ) : isCompleted ? (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          ステージ完了！
          {nextStageId && (
            <span className="ml-1.5 opacity-90 flex items-center text-sm">
              (次へ<ArrowRightCircle className="inline h-4 w-4 ml-1"/>)
            </span>
          )}
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          完了としてマーク
        </>
      )}
    </Button>
  );
}
