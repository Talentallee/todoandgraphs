import ProjectTimeline from '@/components/ProjectTimeline';
import { initialProjectData } from '@/data/projectPlan';

export default function Page() {
  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      <ProjectTimeline initialData={initialProjectData} />
    </main>
  );
}
const    foo =  "bar"