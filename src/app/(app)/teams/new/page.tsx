
"use client";
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, PlusCircle } from 'lucide-react';
import { mockUser, mockTeams } from '@/lib/mock-data'; // For simulating data storage
import { useToast } from '@/hooks/use-toast';

const teamFormSchema = z.object({
  name: z.string().min(3, { message: "チーム名は3文字以上で入力してください。" }).max(50, { message: "チーム名は50文字以内で入力してください。"}),
  description: z.string().max(200, { message: "説明は200文字以内で入力してください。"}).optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function CreateTeamPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<TeamFormValues> = (data) => {
    // Simulate saving the team
    const newTeam = {
      id: `team-${Date.now().toString()}`, // Simple unique ID
      leaderId: mockUser.id,
      members: [{ userId: mockUser.id, role: 'leader' as const }],
      created_at: new Date().toISOString(),
      ...data,
    };

    // This is where you'd call an API to save the team
    // For mock, just add to local array (won't persist across reloads)
    mockTeams.push(newTeam);
    console.log("New team created (mock):", newTeam);

    toast({
      title: "チーム作成成功！",
      description: `チーム「${data.name}」が作成されました。`,
    });

    router.push(`/teams/${newTeam.id}`); // Navigate to the new team's page
  };

  return (
    <div className="max-w-xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        戻る
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">新しいチームを作成</CardTitle>
          </div>
          <CardDescription>チーム名と説明を入力して、コラボレーションを始めましょう。</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>チーム名</FormLabel>
                    <FormControl>
                      <Input placeholder="例: Acme大学 AI研究グループ" {...field} />
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
                    <FormLabel>チーム説明 (任意)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="チームの目的や活動内容などを記述します。" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? '作成中...' : 'チームを作成'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
