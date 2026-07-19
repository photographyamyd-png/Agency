"use client";

import { useState } from "react";
import { buildGbpUtmUrl } from "@/lib/blueprint/gbp-sops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GbpUtmBuilderProps {
  defaultBaseUrl?: string;
}

export function GbpUtmBuilder({ defaultBaseUrl = "" }: GbpUtmBuilderProps) {
  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl);
  const [service, setService] = useState("");
  const [generated, setGenerated] = useState("");

  function handleGenerate() {
    if (!baseUrl.trim() || !service.trim()) return;
    setGenerated(buildGbpUtmUrl(baseUrl.trim(), service.trim()));
  }

  return (
    <div className="rounded-lg border border-border-bright bg-surface-raised p-4 space-y-3">
      <h3 className="text-sm font-medium">UTM Link Builder (§7.3)</h3>
      <p className="text-xs text-muted">
        Template: utm_source=gbp&amp;utm_medium=posts&amp;utm_campaign=&#123;service&#125;
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://client.com/services/plumbing"
        />
        <Input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Service name (campaign)"
        />
      </div>
      <Button type="button" size="sm" variant="outline" onClick={handleGenerate}>
        Generate UTM link
      </Button>
      {generated && (
        <div className="rounded border border-border-bright/50 p-3 text-xs break-all">
          <p className="text-muted mb-1">Copy for GBP post CTA:</p>
          <code className="text-accent-bright">{generated}</code>
        </div>
      )}
    </div>
  );
}
