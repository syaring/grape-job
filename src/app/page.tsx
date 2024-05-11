import Grapes from "@/components/Grapes";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function Home() {
  return (
      <div>
        <div id="title">
          🍇 포도알 5기 🍇
        </div>
        <Grapes />
        <SpeedInsights />
      </div>
  );
}
