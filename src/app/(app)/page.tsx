
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the public courses page by default.
  // Later, this page could become a dashboard or a mode selector.
  redirect('/public-courses');

  // return (
  //   <div className="space-y-8">
  //     <section className="text-center mb-12">
  //       <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 sm:text-5xl">CourseFlowへようこそ！</h1>
  //       <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
  //         下のコースを選択して、学習の旅を始めましょう。インタラクティブなステージと進捗追跡でスキルアップを目指します。
  //       </p>
  //     </section>
      
  //     {/* Content will be moved to specific mode pages */}
  //   </div>
  // );
}
