import { sendLeadOnboarding } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

export function SendOnboardingButton({ leadId }: { leadId: string }) {
  async function send() {
    "use server";
    await sendLeadOnboarding(leadId);
  }

  return (
    <form action={send}>
      <Button size="sm" variant="outline" type="submit">
        Send onboarding email
      </Button>
    </form>
  );
}
