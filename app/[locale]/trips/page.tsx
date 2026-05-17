import { TripsHeader } from "./_components/TripsHeader";
import { TripsTable } from "./_components/TripsTable";

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <TripsHeader />
      <TripsTable />
    </div>
  );

}
