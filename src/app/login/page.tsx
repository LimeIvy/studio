
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react"; 
import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <LogoIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">CourseFlowへようこそ</CardTitle>
          <CardDescription>サインインしてコースにアクセスし、進捗状況を確認してください。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Button variant="outline" className="w-full h-12 text-base" asChild>
            
            <Link href="/"> 
              <Chrome className="mr-2 h-5 w-5" />
              Googleでサインイン
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            サインインすることにより、利用規約とプライバシーポリシーに同意したことになります。
            このアプリは、ターミナルメンバー向けにドメイン制限されたGoogleログインを使用しています。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
