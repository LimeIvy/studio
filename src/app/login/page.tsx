
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Github, Mail } from "lucide-react"; 
import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 selection:bg-primary selection:text-primary-foreground">
      <Card className="w-full max-w-md shadow-2xl border-border overflow-hidden">
        <CardHeader className="text-center bg-muted/30 p-8">
          <Link href="/" className="flex justify-center mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <LogoIcon className="h-14 w-14 text-primary transition-transform hover:scale-110" />
          </Link>
          <CardTitle className="text-3xl font-bold text-foreground">CourseFlowへようこそ</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-1">サインインして学習の旅を始めましょう。</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" placeholder="your@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" type="password" placeholder="********" className="mt-1" />
            </div>
          </div>

          <Button className="w-full h-12 text-base font-semibold" asChild>
            <Link href="/">
              <Mail className="mr-2 h-5 w-5" />
              メールアドレスでサインイン
            </Link>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full h-12 text-base" asChild>
              <Link href="/"> 
                <Chrome className="mr-2 h-5 w-5" />
                Google
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-12 text-base" asChild>
              <Link href="/"> 
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Link>
            </Button>
          </div>

        </CardContent>
        <CardFooter className="bg-muted/30 p-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center w-full">
            サインインすることにより、当社の<Link href="#" className="underline hover:text-primary">利用規約</Link>と<Link href="#" className="underline hover:text-primary">プライバシーポリシー</Link>に同意したことになります。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
