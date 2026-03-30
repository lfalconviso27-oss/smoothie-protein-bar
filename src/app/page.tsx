import { getTodaySpecial, getSmoothieTypes } from "@/lib/actions/menu";
import { HomeContent } from "./home-client";

export default async function Home() {
  const [todaySpecial, smoothieTypes] = await Promise.all([
    getTodaySpecial().catch(() => null),
    getSmoothieTypes().catch(() => []),
  ]);

  return <HomeContent todaySpecial={todaySpecial} smoothieTypes={smoothieTypes} />;
}
