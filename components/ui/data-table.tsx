import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  zebra?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  zebra = false,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className
      )}
    >
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "h-9 px-4 text-left text-xs font-medium uppercase tracking-wide text-muted",
                  col.className
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={rowKey(row)}
              className={cn(
                "h-10 border-b border-border last:border-0 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50",
                zebra && index % 2 === 1 && "bg-surface/50"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 truncate text-foreground tabular-nums",
                    col.className
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
