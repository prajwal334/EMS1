import {useNavigate} from "react-router-dom";
import { FaEye } from "react-icons/fa";

export const getLeaveColumns = () => [
    {
        name: "Name",
        selector: (row) => row.name,
        "inline-size": "120px",
    },

    {
        name: "Leave Type",
        selector: (row) => row.leaveType,
    "inline-size": "140px",
    },
    {
        name: "Department",
        selector: (row) => row.department,
        "inline-size": "170px",
    },
    {
        name: "Days",
        selector: (row) => row.days,
        "inline-size": "80px",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        "inline-size": "120px",
    },
    {
        name: "Action",
        selector: (row) => row.action,
        "inline-size": "150px",
    },
];

export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "employee";

    if (role === "admin" || role === "manager" ) {
      navigate(`/admin-dashboard/leaves/${id}`);
    } else {
      navigate(`/employee-dashboard/leaves/${id}`);
    }
  };
    return (
        <button
      title="View"
      className="text-black p-1 hover:scale-110 transition-transform"
      onClick={() => handleView(Id)}
    >
      <FaEye size={18} />
    </button>
    );
}