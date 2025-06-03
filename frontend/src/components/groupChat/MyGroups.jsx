import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyGroups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/group/my-groups", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setGroups(res.data.groups);
        }
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Group Chats</h2>
      <div className="space-y-4">
        {groups.length === 0 && <p>No group chats found.</p>}
        {groups.map((group) => (
          <Link
            key={group._id}
            to={`/employee-dashboard/groups/${group._id}`}
            className="block p-4 border border-gray-300 rounded hover:bg-gray-100"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  group.group_dp
                    ? `http://localhost:3000/${group.group_dp.replace("public/", "")}`
                    : "https://via.placeholder.com/100"
                }
                alt="Group"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{group.group_name}</p>
                <p className="text-sm text-gray-500">
                  Created by: {group.createdBy?.name || "Unknown"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyGroups;
