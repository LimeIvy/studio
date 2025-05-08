
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FilePlus2, DollarSign } from 'lucide-react';
import { mockCourses, mockUser, mockTeams, getUserTeams } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import type { CourseMode } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect } from 'react';

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "タイトルは3文字以上で入力してください。" }).max(100, { message: "タイトルは100文字以内で入力してください。"}),
  description: z.string().min(10, { message: "説明は10文字以上で入力してください。" }).max(500, { message: "説明は500文字以内で入力してください。"}),
  imageUrl: z.string().url({ message: "有効な画像URLを入力してください。" }).optional().or(z.literal('')),
  publishTarget: z.string().min(1, { message: "公開先を選択してください。"}), // 'public' or teamId
  price: z.coerce.number().min(0, { message: "価格は0以上である必要があります。"}).optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const userTeams = mockUser.id ? getUserTeams(mockUser.id).filter(team => team.members.some(m => m.userId === mockUser.id && (m.role === 'leader' || m.role === 'editor'))) : [];

  const defaultPublishTarget = React.useMemo(() => {
    const queryTeamId = searchParams.get('teamId');
    if (queryTeamId && userTeams.some(team => team.id === queryTeamId)) {
      return queryTeamId;
    }
    const queryTarget = searchParams.get('target');
    if (queryTarget === 'public') {
      return 'public';
    }
    // Default to 'public' if no specific target, or if user has no teams to pick from.
    return 'public';
  }, [searchParams, userTeams]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      publishTarget: defaultPublishTarget,
      price: defaultPublishTarget === 'public' ? 0 : undefined,
    },
  });

  const watchedPublishTarget = form.watch('publishTarget');

  useEffect(() => {
    if (watchedPublishTarget !== 'public') {
      form.setValue('price', undefined);
    } else if (form.getValues('price') === undefined) {
      form.setValue('price', 0);
    }
  }, [watchedPublishTarget, form]);

  const onSubmit: SubmitHandler<CourseFormValues> = (data) => {
    const isPublicTarget = data.publishTarget === 'public';
    const newCourseMode: CourseMode = isPublicTarget ? 'public' : 'team';
    const newCourseTeamId = isPublicTarget ? undefined : data.publishTarget;

    if (!isPublicTarget && !userTeams.some(team => team.id === newCourseTeamId)) {
        toast({
            title: "エラー",
            description: "無効なチームが選択されました。",
            variant: "destructive",
        });
        return;
    }


    const newCourse = {
      id: `course-${Date.now().toString()}`,
      created_at: new Date().toISOString(),
      creatorId: mockUser.id,
      mode: newCourseMode,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || '',
      price: isPublicTarget ? data.price : undefined,
      teamId: newCourseTeamId,
      isPublished: true, // Default to published when creating via this form
      totalStages: 0,
      completedStages: 0,
    };

    mockCourses.push(newCourse);
    console.log("New course created (mock):", newCourse);

    toast({
      title: "コース作成成功！",
      description: `コース「${data.title}」が作成されました。`,
    });

    if (newCourseMode === 'public') {
      router.push('/public-courses');
    } else if (newCourseMode === 'team' && newCourse.teamId) {
      router.push(`/teams/${newCourse.teamId}`);
    } else {
      // Fallback, should ideally not happen if teamId is correctly set for team mode
      router.push('/team-hub');
    }
  };

  const pageTitle = "新しいコースを作成";
  const pageDescription = "コースの詳細情報を入力し、公開先を選択してください。";

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        戻る
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <FilePlus2 className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">{pageTitle}</CardTitle>
          </div>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>コースタイトル</FormLabel>
                    <FormControl>
                      <Input placeholder="例: Unityゲーム開発マスタークラス" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>コース説明</FormLabel>
                    <FormControl>
                      <Textarea placeholder="このコースで学べること、対象者などを記述します。" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カバー画像URL (任意)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>コースカードに表示される画像のURLです。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公開先</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="公開先を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">一般公開</SelectItem>
                        {userTeams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name} (チーム)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>コースを一般公開するか、特定のチームに限定するか選択します。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedPublishTarget === 'public' && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>価格 (円)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="0" {...field} className="pl-8" 
                           value={field.value ?? ''} // Ensure value is not undefined for input type number
                           onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>無料にする場合は0を入力してください。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                <FilePlus2 className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? '作成中...' : 'コースを作成'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
