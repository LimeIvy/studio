import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react"; // Using Chrome icon as a generic browser/Google icon
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
          <CardTitle className="text-2xl font-bold">Welcome to CourseFlow</CardTitle>
          <CardDescription>Sign in to access your courses and track your progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* This button would trigger Supabase Google Auth */}
          <Button variant="outline" className="w-full h-12 text-base" asChild>
            {/* In a real app, this Link would be replaced with an onClick handler for Google Sign-In */}
            <Link href="/"> 
              <Chrome className="mr-2 h-5 w-5" />
              Sign in with Google
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            This app uses Google login restricted by domain for Terminal members.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
