export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6 py-2">
      <div className="h-10 w-56 rounded-sm bg-white/[0.06]" />
      <div className="h-24 max-w-2xl rounded-sm bg-white/[0.04]" />
      <div className="h-64 rounded-sm border border-[var(--line)] bg-white/[0.02]" />
    </div>
  );
}
