
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, FilePlus2, DollarSign, Globe, Users } from 'lucide-react';
import { mockCourses, mockUser, mockTeams } from '@/lib/mock-data'; // For simulating data storage
import { useToast } from '@/hooks/use-toast';
import type { CourseMode } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "タイトルは3文字以上で入力してください。" }).max(100, { message: "タイトルは100文字以内で入力してください。"}),
  description: z.string().min(10, { message: "説明は10文字以上で入力してください。" }).max(500, { message: "説明は500文字以内で入力してください。"}),
  imageUrl: z.string().url({ message: "有効な画像URLを入力してください。" }).optional().or(z.literal('')),
  price: z.coerce.number().min(0, { message: "価格は0以上である必要があります。"}).optional(),
  isPublished: z.boolean().default(true),
  teamId: z.string().optional(), // Only for team mode
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const params = useParams() as { mode: CourseMode, teamId?: string }; // teamId will come from a different route for team course creation potentially
  const { toast } = useToast();

  const mode: CourseMode = params.mode === 'team' ? 'team' : 'public';
  const specificTeamId = params.mode === 'team' ? params.teamId : undefined; // if creating for a specific team

  const userTeams = mockUser.id ? mockTeams.filter(team => team.members.some(m => m.userId === mockUser.id && (m.role === 'leader' || m.role === 'editor'))) : [];


  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: mode === 'public' ? 0 : undefined, // Default to 0 for public, undefined for team
      isPublished: true,
      teamId: mode === 'team' ? specificTeamId || (userTeams.length > 0 ? userTeams[0].id : undefined) : undefined,
    },
  });

  const onSubmit: SubmitHandler<CourseFormValues> = (data) => {
    // Simulate saving the course
    const newCourse = {
      id: `course-${Date.now().toString()}`, // Simple unique ID
      created_at: new Date().toISOString(),
      creatorId: mockUser.id,
      mode: mode,
      ...data,
      price: mode === 'public' ? data.price : undefined, // Ensure price is only for public
      teamId: mode === 'team' ? data.teamId : undefined, // Ensure teamId is only for team
      totalStages: 0, // Initial values
      completedStages: 0,
    };

    // This is where you'd call an API to save the course
    // For mock, just add to local array (won't persist across reloads)
    mockCourses.push(newCourse); 
    console.log("New course created (mock):", newCourse);

    toast({
      title: "コース作成成功！",
      description: `コース「${data.title}」が作成されました。`,
    });

    if (mode === 'public') {
      router.push('/public-courses');
    } else if (mode === 'team' && newCourse.teamId) {
      router.push(`/teams/${newCourse.teamId}`);
    } else {
      router.push('/team-hub');
    }
  };

  const pageTitle = mode === 'public' ? "新しい公開コースを作成" : "新しいチームコースを作成";
  const pageDescription = mode === 'public'
    ? "コースの詳細を入力して、誰でも学べる新しい知識を共有しましょう。"
    : "チームメンバー限定の新しいコースを作成します。";

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        戻る
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            {mode === 'public' ? <Globe className="h-7 w-7 text-primary" /> : <Users className="h-7 w-7 text-primary" />}
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
              {mode === 'public' && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>価格 (円)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="0" {...field} className="pl-8" />
                        </div>
                      </FormControl>
                      <FormDescription>無料にする場合は0を入力してください。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {mode === 'team' && (
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>対象チーム</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!specificTeamId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="コースを作成するチームを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userTeams.map(team => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                           {userTeams.length === 0 && <SelectItem value="no-team" disabled>作成権限のあるチームがありません</SelectItem>}
                        </SelectContent>
                      </Select>
                      <FormDescription>このコースはこのチームメンバーのみがアクセスできます。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
                    <div className="space-y-0.5">
                      <FormLabel>{mode === 'public' ? '公開する' : 'チームに公開する'}</FormLabel>
                      <FormDescription>
                        {mode === 'public' 
                          ? 'オンにすると、コースが一般に公開されます。' 
                          : 'オンにすると、選択したチームのメンバーがコースを利用できるようになります。'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || (mode === 'team' && !form.watch('teamId'))}>
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
