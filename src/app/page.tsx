import DesktopPortfolio from "@/components/DesktopPortfolio";
import { getWritings } from "@/lib/writing";
export default async function Home() {
  return <DesktopPortfolio posts={await getWritings()} />;
}
