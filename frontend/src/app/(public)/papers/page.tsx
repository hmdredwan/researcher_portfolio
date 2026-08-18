import { getPapers } from "@/lib/api";
import { dummyPapers } from "@/lib/dummyData";
import PapersExplorer from "./PapersExplorer";
import { PageHeader } from "@/components/PageHeader";

export const revalidate = 60;

export default async function PapersPage() {
  let papers: Awaited<ReturnType<typeof getPapers>> = [];
  try {
    papers = await getPapers();
  } catch {
    // will fallback below
  }

  if (!papers || papers.length === 0) papers = dummyPapers;

  return (
    <div className="container-page py-16">
      <PageHeader
        eyebrow="Publications"
        title="Papers"
        description="Peer-reviewed research spanning optimization, NLP, computer vision, and responsible AI."
      />
      <PapersExplorer papers={papers} />
    </div>
  );
}