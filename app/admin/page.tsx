import { redirect } from "next/navigation";

/** Default admin entry: real work surface (split routes live under /admin/*). */
export default function AdminIndexPage() {
  redirect("/admin/teams");
}
