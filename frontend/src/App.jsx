import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboad";
import EmployeeDashboard from "./pages/EmployeeDashboad";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import TeamList from "./components/team/TeamList";
import AddTeam from "./components/team/Add";
import HrDashboard from "./pages/HrDashboard";
import PfView from "./components/pf/PfView";
import HrSummary from "./components/dashboard/HrSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
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

          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/department/:id"
            element={<AddDepartment />}
          ></Route>

          <Route path="/admin-dashboard/employees" element={<List />}></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route
            path="/admin-dashboard/employees/:id"
            element={<View />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/edit/:id"
            element={<Edit />}
          ></Route>

          <Route path="/admin-dashboard/teams" element={<TeamList />}></Route>
          <Route path="/admin-dashboard/add-team" element={<AddTeam />}></Route>
          <Route path="/admin-dashboard/team/:id" element={<AddTeam />}></Route>

          <Route
            path="/admin-dashboard/salary/add"
            element={<AddSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/salary/:id"
            element={<ViewSalary />}
          ></Route>
        </Route>
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

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

          <Route
            path="/hr-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route
            path="/hr-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/hr-dashboard/department/:id"
            element={<AddDepartment />}
          ></Route>

          <Route path="/hr-dashboard/employees" element={<List />}></Route>
          <Route path="/hr-dashboard/add-employee" element={<Add />}></Route>
          <Route path="/hr-dashboard/employees/:id" element={<View />}></Route>
          <Route
            path="/hr-dashboard/employees/edit/:id"
            element={<Edit />}
          ></Route>
          <Route path="/hr-dashboard/pf" element={<PfView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
