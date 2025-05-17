import { useNavigate } from "react-router-dom";

// Column Definitions
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
  },
  {
    name: "Description",
    selector: (row) => row.description,
  },
  {
    name: "Action",
    selector: (row) => row.actions,
  },
];

// DepartmentButtons Component
export const DepartmentButtons = ({ _id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => navigate(`/admin-dashboard/delete-department/${_id}`)}
      >
        Delete
      </button>
    </div>
  );
};
