import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getResearcher } from "@/lib/api";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let researcher;
  try {
    researcher = await getResearcher();
  } catch {
    researcher = undefined;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer researcher={researcher} />
    </>
  );
}
