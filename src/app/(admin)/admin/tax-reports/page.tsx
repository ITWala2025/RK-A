import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function TaxReportsRedirectPage() {
  redirect("/admin/finance/reports");
}

