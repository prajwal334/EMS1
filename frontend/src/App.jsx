import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboad";
import EmployeeDashboard from "./pages/EmployeeDashboad";
import HrDashboard from "./pages/HrDashboard";
import SetNewPassword from "./pages/SetNewPassword";
import AdminResetPassword from "./pages/EmployeePassword";

import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Dashboard components
import AdminSummary from "./components/dashboard/AdminSummary";
import HrSummary from "./components/HrDashboard/HrSummary";
import EmployeeSummary from "./components/EmployeeDashboard/EmployeeDashboard";

// Admin Department
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import DeleteDepartment from "./components/department/DeleteDepartment";
// Group Chat
import ChatLayout from "./pages/ChatLayout";
import ChatRoom from "./components/groupChat/ChatRoom";
import GroupChatAdd from "./components/groupChat/AddGroup";

// HR Department
import DepartmentList1 from "./components/HrDepartment/DepartmentList";
import AddDepartment1 from "./components/HrDepartment/AddDepartment";
import DeleteDepartment1 from "./components/HrDepartment/DeleteDepartement";

// Employee
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import HrList from "./components/employee/HrList";

// Salary
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import ViewSalaryEmp from "./components/salary/ViewEmp";

// Team
import TeamList from "./components/team/TeamList";
import AddTeam from "./components/team/Add";
import ViewTeam from "./components/team/ViewTeam";
import EmTeam from "./components/team/EmTeam";
import EmView from "./components/team/EmView";

// PF
import PfView from "./components/pf/PfView";
import PfView1 from "./components/EmployeePf/PfView";

// Leave
import LeaveList from "./components/leave/list";
import LeaveAdd from "./components/leave/add";
import Leavetable from "./components/leave/Table";
import LeaveList1 from "./components/Hrleave/list";
import LeaveAdd1 from "./components/Hrleave/add";
import LeaveDetail from "./components/leave/DetailLeave";

// Attendance
import View4 from "./components/attendance/View";
import View5 from "./components/attendance/View";
import AdminView from "./components/attendance/AdminView";
import AttendanceEditView from "./components/attendance/AdminEditView";

// Settings
import Setting from "./components/EmployeeDashboard/Setting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />


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
          <Route path="delete-department/:id" element={<DeleteDepartment />} />

          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />

          <Route path="teams" element={<TeamList />} />
          <Route path="add-team" element={<AddTeam />} />
          <Route path="teams/team/:id" element={<ViewTeam />} />

          <Route path="salary/add" element={<AddSalary />} />

          <Route path="settings" element={<Setting />} />
          <Route path="leaves" element={<Leavetable />} />
          <Route path="leaves/:id" element={<LeaveDetail />} />
          <Route path="employees/leaves/:id" element={<LeaveList />} />

          <Route path="attendance" element={<AdminView />} />
          <Route path="chat/add" element={<GroupChatAdd />} />
          <Route path="groups" element={<ChatLayout />}>
           <Route path=":id" element={<ChatRoom />} />
           </Route>
          <Route
            path="attendance/view/:userId"
            element={<AttendanceEditView />}
          />
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
          <Route path="departments" element={<DepartmentList1 />} />
          <Route path="add-department" element={<AddDepartment1 />} />
          <Route path="department/:id" element={<AddDepartment1 />} />
          <Route path="delete-department/:id" element={<DeleteDepartment1 />} />

          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="hr-employees" element={<HrList />} />

          <Route path="pf/:employeeId" element={<PfView />} />
          <Route path="leaves" element={<LeaveList1 />} />
          <Route path="add-leave" element={<LeaveAdd1 />} />
          <Route path="login-history/:employeeId" element={<View4 />} />
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
          <Route path="leaves/:id" element={<LeaveList />} />
          <Route path="add-leave" element={<LeaveAdd />} />
          <Route path="salary/:id" element={<ViewSalaryEmp />} />
          <Route path="pf/:employeeId" element={<PfView1 />} />
          <Route path="login-history/:userId" element={<View5 />} />
          <Route path="teams/user/:UseId" element={<EmTeam />} />
          <Route path="teams/team/:id" element={<EmView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
