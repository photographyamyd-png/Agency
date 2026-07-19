interface DatabaseSetupNoticeProps {
  message: string;
}

export function DatabaseSetupNotice({ message }: DatabaseSetupNoticeProps) {
  return (
    <div className="max-w-2xl space-y-4 rounded-xl border border-border-bright bg-surface-raised p-8">
      <h2 className="text-lg font-semibold">Database not configured</h2>
      <p className="text-sm text-muted leading-relaxed">
        This project uses <strong className="text-foreground">PostgreSQL</strong> via Neon.
        Your <code className="text-foreground">.env</code> still points at a local SQLite file,
        which causes dashboard pages to fail.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
        <li>
          Create a free database at{" "}
          <a
            href="https://neon.tech"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            neon.tech
          </a>
        </li>
        <li>
          Copy the <strong className="text-foreground">pooled</strong> URL to{" "}
          <code className="text-foreground">DATABASE_URL</code>
        </li>
        <li>
          Copy the <strong className="text-foreground">direct</strong> URL to{" "}
          <code className="text-foreground">DIRECT_URL</code>
        </li>
        <li>
          Run{" "}
          <code className="text-foreground">npm run db:migrate && npm run db:seed</code>
        </li>
        <li>Restart the dev server</li>
      </ol>
      <pre className="overflow-x-auto rounded-md bg-background p-3 text-xs text-muted whitespace-pre-wrap break-words">
        {message}
      </pre>
    </div>
  );
}
