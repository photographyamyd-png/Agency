import { randomBytes } from "crypto";
import { inviteClientPortalUser } from "@/lib/actions/client-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ClientPortalInviteForm({ clientId }: { clientId: string }) {
  async function invite(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password =
      String(formData.get("password") ?? "") ||
      randomBytes(4).toString("hex") + "A1!";
    if (!email) return;
    await inviteClientPortalUser({ clientId, email, password });
  }

  return (
    <form action={invite} className="mt-4 flex flex-wrap gap-2">
      <Input
        name="email"
        type="email"
        placeholder="Client email"
        className="max-w-xs"
        required
      />
      <Input
        name="password"
        type="text"
        placeholder="Temp password (optional)"
        className="max-w-xs"
      />
      <Button type="submit" size="sm">
        Invite to portal
      </Button>
    </form>
  );
}
