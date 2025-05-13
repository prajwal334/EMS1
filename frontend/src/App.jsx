import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboad";
import EmployeeDashboard from "./pages/EmployeeDashboad";
import HrDashboard from "./pages/HrDashboard";

import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Dashboard components
import AdminSummary from "./components/dashboard/AdminSummary";
import HrSummary from "./components/dashboard/HrSummary";
import EmployeeSummary from "./components/EmployeeDashboard/EmployeeDashboard";

// Department
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";

// Employee
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";

// Salary
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";

// Team
import TeamList from "./components/team/TeamList";
import AddTeam from "./components/team/Add";

// PF
import PfView from "./components/pf/PfView";

// Leave
import LeaveList from "./components/leave/list";
import LeaveAdd from "./components/leave/add";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<AddDepartment />} />

          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />

          <Route path="teams" element={<TeamList />} />
          <Route path="add-team" element={<AddTeam />} />
          <Route path="team/:id" element={<AddTeam />} />

          <Route path="salary/add" element={<AddSalary />} />
        </Route>

        {/* HR Dashboard */}
        <Route
          path="/hr-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["hr"]}>
                <HrDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<HrSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<AddDepartment />} />

          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="pf" element={<PfView />} />
        </Route>

        {/* Employee Dashboard */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route path="profile/:id" element={<View />} />
          <Route path="leaves" element={<LeaveList />} />
          <Route path="add-leave" element={<LeaveAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
