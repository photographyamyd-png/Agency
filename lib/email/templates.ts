export function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{{${key}}}`, value),
    template
  );
}

export function renderEmailHtml(body: string): string {
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  if (hasHtml) return body;

  return body
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" style="color:#6366f1;word-break:break-all;">$1</a>'
    )
    .replace(/\n/g, "<br/>");
}

export function onboardingEmailVars(input: {
  contactName: string;
  businessName: string;
  questionnaireUrl: string;
}) {
  const { contactName, businessName, questionnaireUrl } = input;
  const questionnaireButton = `<a href="${questionnaireUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#6366f1;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Complete questionnaire</a>`;

  return {
    contactName,
    businessName,
    questionnaireUrl,
    questionnaireButton,
  };
}
