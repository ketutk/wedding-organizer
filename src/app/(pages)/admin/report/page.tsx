import ReportsTable from "./_components/ReportsTable";

export default function ReportsPage() {
  return (
    <div className="bg-white p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Packages Sells Reports</h1>
      {/* Additional report components can be added here */}
      <ReportsTable />
    </div>
  );
}
