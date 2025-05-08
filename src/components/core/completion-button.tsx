
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRightCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress } from '@/lib/types';
import { completeStage as apiCompleteStage, getProgressForStage } from '@/lib/mock-data'; 
import { mockUser } from '@/lib/mock-data';

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
        
        console.log("次のステージへ移動:", nextStageId);
      }
      return;
    }

    setIsLoading(true);
    try {
      const progress = apiCompleteStage(userId, stageId); 
      setIsCompleted(true);
      if (onComplete) {
        onComplete(progress);
      }
      toast({
        title: "ステージ完了！",
        description: "このステージのクリアおめでとうございます。",
        variant: "default",
      });
    } catch (error) {
      console.error("ステージ完了マーク付け失敗:", error);
      toast({
        title: "エラー",
        description: "ステージを完了としてマークできませんでした。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isCompleted) { 
    return <Button disabled className="w-full md:w-auto min-w-[200px] h-12 text-lg animate-pulse">読み込み中...</Button>;
  }

  return (
    <Button 
      onClick={handleComplete} 
      disabled={isLoading && !isCompleted} 
      className="w-full md:w-auto min-w-[200px] h-12 text-lg"
      variant={isCompleted ? "default" : "default"} 
      aria-live="polite"
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          ステージ完了！
          {nextStageId && (
            <span className="ml-2 opacity-80">(次へ <ArrowRightCircle className="inline h-4 w-4"/>)</span>
          )}
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" /> 完了としてマーク
        </>
      )}
    </Button>
  );
}
