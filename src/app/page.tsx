import Grapes from "@/components/Grapes";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';

export default async function Home() {
  return (
      <div>
        <div id="title">
          🍇 포도알 6기 🍇
        </div>
        <Grapes />
        <SpeedInsights />
        <Analytics />
      </div>
  );
}
