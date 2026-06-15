"use client";

import { useState } from "react";
import { submitOnboardingQuestionnaire } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type QuestionField = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

export function OnboardingQuestionnaireForm({
  token,
  fields,
  contactName,
}: {
  token: string;
  fields: QuestionField[];
  contactName: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const responses: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.type === "checkboxes") {
        responses[field.id] = formData.getAll(field.id).map(String);
      } else {
        const val = formData.get(field.id);
        if (val != null && val !== "") responses[field.id] = String(val);
      }
    }

    const result = await submitOnboardingQuestionnaire(token, responses);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <h2 className="text-xl font-semibold">Thank you, {contactName}!</h2>
        <p className="mt-3 text-sm text-muted">
          We&apos;ve received your answers and started building your client profile,
          checklists, and estimate. We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-danger"> *</span>}
          </label>
          {field.type === "text" && (
            <Input
              id={field.id}
              name={field.id}
              required={field.required}
              placeholder={field.placeholder}
            />
          )}
          {field.type === "textarea" && (
            <Textarea
              id={field.id}
              name={field.id}
              required={field.required}
              rows={3}
              placeholder={field.placeholder}
            />
          )}
          {field.type === "checkboxes" && field.options && (
            <div className="flex flex-wrap gap-4">
              {field.options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <Checkbox name={field.id} value={opt.value} />
                  {opt.label}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit questionnaire"}
      </Button>
    </form>
  );
}
