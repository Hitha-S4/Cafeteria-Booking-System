import { useAuth } from "@/components/auth/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import AppLayout from "@/components/layout/AppLayout";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
// import HeadDashboard from "@/components/dashboard/HeadDashboard";
import { Spinner } from "@/components/ui/spinner";

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      {user?.role.toLocaleLowerCase() === "employee" && <EmployeeDashboard />}
      {user?.role.toLocaleLowerCase() === "manager" && <ManagerDashboard />}
      {/* {user?.role.toLocaleLowerCase() === "head" && <HeadDashboard />} */}
      {["admin", "superadmin"].includes(
        user?.role.toLocaleLowerCase() || ""
      ) && <AdminDashboard />}
    </AppLayout>
  );
};

export default Index;
