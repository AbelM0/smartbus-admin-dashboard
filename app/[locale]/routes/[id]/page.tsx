export default function RouteDetailPage({ params }: { params: { id: string; locale: string } }) {
  return (
    <div className="p-5">
      <p className="text-sm text-slate-400">Route detail for {params.id}</p>
    </div>
  );
}
