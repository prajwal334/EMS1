import axios from "axios";
import { useNavigate } from "react-router-dom";


export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno
    },
        {
        name: "Image",
        cell: (row) => (
          <img
            src={`http://localhost:3000/uploads/${row.profileImage}`} // Assuming Express serves this statically
            alt={row.name}
            className="w-10 h-10 rounded-full"
          />
        ),
      },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,    
    },
    {
        name: "Department",
        selector: (row) => row.dep_name,
    },
    {
        name:"DOJ",
        selector: (row) => row.doj,
        sortable: true,
    },
    {
        name: "Action",
        selector: (row) => row.actions,
    }
]

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:3000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

export const EmployeeButtons = ({Id}) => {
  const navigate = useNavigate();
  return (
    <div className="flex space-x-1">
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded" 
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}>
        View
      </button>
      <button 
      className="bg-purple-500 text-white px-2 py-1 rounded"
      onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        Edit
      </button>
      <button className="bg-green-500 text-white px-2 py-1 rounded">
        Salary
      </button>
      <button className="bg-red-500 text-white px-2 py-1 rounded">
        Leave
      </button>
    </div>
  );
};
