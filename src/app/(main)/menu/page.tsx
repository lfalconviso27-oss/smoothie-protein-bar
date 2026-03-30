import { getMenuData } from "@/lib/actions/menu";
import { MenuClient } from "./menu-client";

export const metadata = {
  title: "Menu",
};

export default async function MenuPage() {
  const data = await getMenuData();
  return <MenuClient data={data} />;
}
