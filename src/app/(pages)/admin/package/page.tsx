import PackageTable from "./_components/PackageTable";
import { PackageProvider } from "./packageContext";

export default function PackagePage() {
  return (
    <div className=" bg-white p-6">
      <PackageProvider>
        <PackageTable />
      </PackageProvider>
    </div>
  );
}
