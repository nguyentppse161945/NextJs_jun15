import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* //<p className="ml-4 text-gray-700">Loading...</p> */}
      <DashboardSkeleton />;
    </div>
  );
}