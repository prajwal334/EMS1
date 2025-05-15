import{BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboad';
import EmployeeDashboard from "./pages/EmployeeDashboad";
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';
import List from './components/employee/List';
import Add from './components/employee/Add';
import View from './components/employee/View';
import Edit from './components/employee/Edit';
import AddSalary from './components/salary/Add';
import ViewSalary from './components/salary/View';
import TeamList from './components/team/TeamList';
import AddTeam from './components/team/Add';
import LeaveList from './components/leave/list';
import LeaveAdd from './components/leave/add';
import LeaveList1 from './components/leave/Table';
import LeaveDetail from './components/leave/DetailLeave';
import Setting from './components/EmployeeDashboard/Setting';

import EmployeeSummary from './components/EmployeeDashboard/EmployeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
            <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
          }>
            <Route index element={<AdminSummary />} />

            <Route path="/admin-dashboard/departments" element={<DepartmentList />}></Route>
            <Route path="/admin-dashboard/add-department" element={<AddDepartment />}></Route>
            <Route path="/admin-dashboard/department/:id" element={<AddDepartment />}></Route>

            <Route path="/admin-dashboard/employees" element={<List />}></Route>
            <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
            <Route path="/admin-dashboard/employees/:id" element={<View />}></Route>
            <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />}></Route>

            <Route path="/admin-dashboard/teams" element={<TeamList />}></Route>
            <Route path="/admin-dashboard/add-team" element={<AddTeam />}></Route>
            <Route path="/admin-dashboard/team/:id" element={<AddTeam />}></Route>
            <Route path="/admin-dashboard/settings" element={<Setting />}></Route>

            <Route path="/admin-dashboard/salary/add" element={<AddSalary />}></Route>
            <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary />}></Route>
            <Route path="/admin-dashboard/leaves" element={<LeaveList1 />}></Route>
            <Route path="/admin-dashboard/leaves/:id" element={<LeaveDetail />}></Route>
            <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />}></Route>
          </Route>
        <Route path="/employee-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
          <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
            <Route index element={<EmployeeSummary />} ></Route>

            <Route path="/employee-dashboard/profile/:id" element={<View />} ></Route>

            <Route path="/employee-dashboard/leaves/:id" element={<LeaveList />} ></Route>
            <Route path="/employee-dashboard/add-leave" element={<LeaveAdd />} ></Route>
            <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />} ></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
