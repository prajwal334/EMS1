import React, { useEffect, useState } from "react";
import axios from "axios";

const AddCandidate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    candidate_name: "",
    email: "",
    contact_no: "",
    whatsapp_no: "",
    date_of_joining: "",
    profile_type: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/candidates/add", {
        ...formData,
        status: "pending",
      });
      setMessage("✅ Candidate added successfully!");
      setFormData({
        candidate_name: "",
        email: "",
        contact_no: "",
        whatsapp_no: "",
        date_of_joining: "",
        profile_type: "",
      });
      fetchCandidates();
      setTimeout(() => handleClose(), 800);
    } catch (err) {
      console.error("Error submitting form", err);
      setMessage("❌ Failed to add candidate.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:3000/api/candidates/${id}`, {
        status,
      });
      fetchCandidates();
    } catch (err) {
      console.error("Error updating candidate status", err);
    }
  };

  const onboardedCount = candidates.filter(c => c.status === "onboarded").length;
  const incompleteCount = candidates.length - onboardedCount;
  const onboardedPercentage = candidates.length > 0 ? Math.round((onboardedCount / candidates.length) * 100) : 0;
  const incompletePercentage = 100 - onboardedPercentage;

  return (
    <>
      <div className={isOpen ? "blur-sm pointer-events-none select-none" : ""}>
        {/* Header */}
        <div
          className="bg-cover bg-center p-6 flex justify-between items-center"
          style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}
        >
          <div className="flex gap-12 text-center text-black font-bold">
            <div>
              <div className="text-4xl">{onboardedPercentage}%</div>
              <div>ON-BOARDING COMPLETE</div>
            </div>
            <div>
              <div className="text-4xl">{onboardedCount}</div>
              <div>TOTAL ON-BOARDED</div>
            </div>
            <div>
              <div className="text-4xl">{incompletePercentage}%</div>
              <div>ON-BOARDING INCOMPLETE</div>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className="bg-black text-white font-bold px-4 py-2 rounded-full"
          >
            + ADD CANDIDATE
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          {loading ? (
            <div className="text-center p-6 text-lg">Loading...</div>
          ) : (
            <table className="min-w-full bg-white text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">SL. NO.</th>
                  <th className="px-4 py-2">NAME</th>
                  <th className="px-4 py-2">EMAIL</th>
                  <th className="px-4 py-2">CONTACT NO.</th>
                  <th className="px-4 py-2">WHATSAPP NO.</th>
                  <th className="px-4 py-2">DATE OF JOINING</th>
                  <th className="px-4 py-2">PROFILE TYPE</th>
                  <th className="px-4 py-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, index) => (
                  <tr
                    key={index}
                    className={`text-center ${c.status === "onboarded"
                      ? "bg-green-100"
                      : c.status === "rejected"
                      ? "bg-red-100"
                      : ""
                      }`}
                  >
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">{c.candidate_name}</td>
                    <td className="border px-2 py-1">{c.email}</td>
                    <td className="border px-2 py-1">{c.contact_no}</td>
                    <td className="border px-2 py-1">{c.whatsapp_no}</td>
                    <td className="border px-2 py-1">{c.date_of_joining?.slice(0, 10)}</td>
                    <td className="border px-2 py-1">{c.profile_type}</td>
                    <td className="border px-2 py-1 flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(c._id, "onboarded")}
                        className="text-green-600 text-lg hover:scale-110"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c._id, "rejected")}
                        className="text-red-600 text-lg hover:scale-110"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] relative p-6">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">ADD CANDIDATE</h2>
            {message && <p className="mb-2 text-blue-600">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                ["candidate_name", "NAME"],
                ["email", "EMAIL ADDRESS"],
                ["contact_no", "CONTACT NO."],
                ["whatsapp_no", "WHATSAPP NO."],
                ["date_of_joining", "DATE OF JOINING", "date"],
                ["profile_type", "PROFILE TYPE"],
              ].map(([name, label, type = "text"]) => (
                <div key={name} className="flex">
                  <label className="w-1/3 font-bold">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-2/3 p-2 rounded border"
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
                >
                  {loading ? "Saving..." : "SAVE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCandidate;
