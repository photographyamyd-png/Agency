import { KpiSkeletonGrid, PageHeaderSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-5">
        <PageHeaderSkeleton />
      </div>
      <div className="px-8 py-8">
        <KpiSkeletonGrid count={4} />
      </div>
    </div>
  );
}
