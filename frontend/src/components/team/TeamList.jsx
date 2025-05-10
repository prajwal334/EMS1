import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from  'react-data-table-component'
import { columns, TeamButtons } from "../../utils/TeamHelper";

const TeamList = () => {
    const [teams, setTeams] = useState([]) 

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/team", {
                    headers: {
                        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.success) {
                    let sno = 1;
                    const data = response.data.teams.map((tem) => ({
                        _id: tem._id,
                        sno: sno++,
                        teamname_id: tem.teamname_id,
                        description: tem.description,
                        actions: <TeamButtons _id={tem._id}/>,
                    }))
                    setTeams(data)
                }              
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    };

    fetchTeams()
}, []);

  return (
    <div className="p-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Teams</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Teams"
          className="px-4 py-0.5 border border-gray-300 rounded shadow-sm"
        />
        <Link
          to="/admin-dashboard/add-team"
          className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-800 text-white shadow-lg"
        >
          Add Teams
        </Link>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={teams} 
        />
      </div>
    </div>
  );
};

export default TeamList;
