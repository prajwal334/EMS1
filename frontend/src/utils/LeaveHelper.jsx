import {useNavigate} from "react-router-dom";

export const getLeaveColumns = () => [
    {
        name: "S.No",
        selector: (row) => row.sno,
        "inline-size": "70px",
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId,
        "inline-size": "120px",
    },
    {
        name: "User ID",
        selector: (row) => row.userId,
        "inline-size": "120px",
    },
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
        navigate(`/admin-dashboard/leaves/${id}`);
    };

    return (
        <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => handleView(Id)}
        >
            View 
        </button>
    );
}