"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateQuestionnaireFields } from "@/lib/actions/settings";

export type QuestionField = {
  id: string;
  type: "text" | "textarea" | "checkboxes";
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export function QuestionnaireEditor({
  templateId,
  initialFields,
}: {
  templateId: string;
  initialFields: QuestionField[];
}) {
  const [fields, setFields] = useState<QuestionField[]>(initialFields);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  function addField(type: QuestionField["type"]) {
    const id = `field_${Date.now()}`;
    setFields((prev) => [
      ...prev,
      {
        id,
        type,
        label: "New question",
        required: false,
        ...(type === "checkboxes"
          ? { options: [{ value: "OPTION_1", label: "Option 1" }] }
          : {}),
      },
    ]);
    setSaved(false);
  }

  function updateField(index: number, patch: Partial<QuestionField>) {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f))
    );
    setSaved(false);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  function moveField(index: number, dir: -1 | 1) {
    const next = [...fields];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setFields(next);
    setSaved(false);
  }

  async function save() {
    setPending(true);
    await updateQuestionnaireFields(templateId, fields);
    setPending(false);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => addField("text")}>
          <Plus className="h-3 w-3" /> Text field
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addField("textarea")}>
          <Plus className="h-3 w-3" /> Textarea
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addField("checkboxes")}>
          <Plus className="h-3 w-3" /> Checkboxes
        </Button>
      </div>

      <ul className="space-y-3">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="rounded-lg border border-border bg-surface p-4 space-y-3"
          >
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => moveField(index, -1)}
                  className="text-muted hover:text-foreground text-xs"
                  disabled={index === 0}
                >
                  ↑
                </button>
                <GripVertical className="h-4 w-4 text-muted" />
                <button
                  type="button"
                  onClick={() => moveField(index, 1)}
                  className="text-muted hover:text-foreground text-xs"
                  disabled={index === fields.length - 1}
                >
                  ↓
                </button>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    placeholder="Question label"
                    className="flex-1"
                  />
                  <span className="text-xs text-muted self-center px-2 py-1 rounded bg-background border border-border">
                    {field.type}
                  </span>
                </div>
                <Input
                  value={field.id}
                  onChange={(e) =>
                    updateField(index, {
                      id: e.target.value.replace(/\s/g, "_"),
                    })
                  }
                  placeholder="Field ID (used in rules)"
                  className="text-xs font-mono"
                />
                {field.type !== "checkboxes" && (
                  <Input
                    value={field.placeholder ?? ""}
                    onChange={(e) =>
                      updateField(index, { placeholder: e.target.value })
                    }
                    placeholder="Placeholder text (optional)"
                  />
                )}
                {field.type === "checkboxes" && (
                  <Input
                    value={
                      field.options?.map((o) => `${o.value}:${o.label}`).join(", ") ?? ""
                    }
                    onChange={(e) => {
                      const options = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((pair) => {
                          const [value, ...rest] = pair.split(":");
                          return {
                            value: value.trim(),
                            label: rest.join(":").trim() || value.trim(),
                          };
                        });
                      updateField(index, { options });
                    }}
                    placeholder="Options: VALUE:Label, VALUE2:Label2"
                  />
                )}
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.required ?? false}
                    onChange={(e) =>
                      updateField(index, { required: e.target.checked })
                    }
                  />
                  Required
                </label>
              </div>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="text-muted hover:text-danger p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {fields.length === 0 && (
        <p className="text-sm text-muted text-center py-8 border border-dashed border-border rounded-lg">
          No questions yet. Add a field above.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save questionnaire"}
        </Button>
        {saved && <span className="text-sm text-success">Saved!</span>}
      </div>
    </div>
  );
}
