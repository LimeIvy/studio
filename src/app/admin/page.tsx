import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRightLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage courses, stages, and their connections.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Manage Courses
            </CardTitle>
            <CardDescription>Add, edit, or delete existing courses.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently <strong>3</strong> courses available.</p>
            <Button variant="outline" className="mt-4 w-full">View Courses</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Manage Stages
            </CardTitle>
            <CardDescription>Add, edit, or delete stages within courses. Upload Markdown files.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently <strong>12</strong> stages across all courses.</p>
            <Button variant="outline" className="mt-4 w-full">View Stages</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <ArrowRightLeft className="h-5 w-5 text-primary" />
              Manage Stage Links
            </CardTitle>
            <CardDescription>Define the flow between stages using a visual editor (e.g., React Flow).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently <strong>9</strong> stage links defined.</p>
             <Button variant="outline" className="mt-4 w-full">Edit Links</Button>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent changes and completions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Admin activity log will be displayed here.</p>
            {/* Placeholder for activity feed */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
