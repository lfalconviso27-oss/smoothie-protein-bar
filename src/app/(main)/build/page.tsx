import { getBuilderData } from "@/lib/actions/menu";
import { BuilderClient } from "./builder-client";

export default async function BuildPage() {
  const data = await getBuilderData();

  return <BuilderClient data={data} />;
}
