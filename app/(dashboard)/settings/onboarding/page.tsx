import Link from "next/link";
import {
  getOnboardingTemplates,
  updateOnboardingTemplate,
} from "@/lib/actions/settings";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { QuestionnaireEditor, type QuestionField } from "@/components/settings/questionnaire-editor";
import { TestOnboardingEmail } from "@/components/settings/test-onboarding-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { isEmailConfigured } from "@/lib/email/gmail";

export default async function OnboardingSettingsPage() {
  const templates = await getOnboardingTemplates();
  const template = templates.find((t) => t.isDefault) ?? templates[0];

  const questionnaire = template?.questionnaire as { fields?: QuestionField[] } | null;
  const fields = questionnaire?.fields ?? [];
  const emailConfigured = isEmailConfigured();

  return (
    <DashboardShell
      title="Onboarding Templates"
      description="Welcome email copy and questionnaire configuration"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings">Back to settings</Link>
        </Button>
      }
    >
      {!template ? (
        <p className="text-sm text-muted">
          No templates found. Run <code className="text-xs">npm run db:seed</code> to create the default template.
        </p>
      ) : (
        <div className="max-w-2xl space-y-8">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">{template.name}</h2>
            {template.isDefault && <Badge variant="default">Default</Badge>}
            <span className="text-xs text-muted tabular-nums">
              {template._count.rules} rules · {template._count.sessions} sessions
            </span>
          </div>

          <form action={updateOnboardingTemplate} className="space-y-4 rounded-lg border border-border p-5">
            <input type="hidden" name="id" value={template.id} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Welcome email subject</label>
              <Input
                name="welcomeEmailSubject"
                defaultValue={template.welcomeEmailSubject}
              />
              <p className="text-xs text-muted">
                Variables: {"{{contactName}}"}, {"{{businessName}}"},{" "}
                {"{{questionnaireButton}}"}, {"{{questionnaireUrl}}"}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Welcome email body</label>
              <Textarea
                name="welcomeEmailBody"
                rows={10}
                defaultValue={template.welcomeEmailBody}
              />
            </div>
            <Button type="submit">Save template</Button>
          </form>

          <TestOnboardingEmail
            templateId={template.id}
            emailConfigured={emailConfigured}
            fromEmail={process.env.GMAIL_USER ?? null}
            toEmail={process.env.ADMIN_EMAIL ?? null}
          />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Questionnaire fields</h3>
              <p className="text-xs text-muted mt-1">
                Field IDs are used in onboarding rules (e.g. interestedIn, businessGoals).
              </p>
            </div>
            <QuestionnaireEditor templateId={template.id} initialFields={fields} />
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
