import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const next = searchParams.get("next") ?? "/";

  //Itt lenne a felhasználó megerősítése

  if (token_hash) {
    return redirect(next);
  }

  return redirect("/error");
}
