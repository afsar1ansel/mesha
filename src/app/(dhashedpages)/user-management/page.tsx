// app/(dashboard)/user-management/page.tsx
import dynamic from "next/dynamic";

const UserManagement = dynamic(
  () => import("@/app/(dhashedpages)/userManagement/page"),
  {
    ssr: false, // Disable SSR for this component
  }
);

export default function UserManagementPage() {
  return (
    <div>
      <h1>User Management</h1>
      <UserManagement />
    </div>
  );
}
