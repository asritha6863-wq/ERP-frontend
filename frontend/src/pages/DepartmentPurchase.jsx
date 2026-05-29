import { useEffect, useState } from "react";
import axios from "axios";

function DepartmentPurchase() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const dept = "SCM"; // change dynamically later
    const res = await axios.get(
      `http://localhost:5000/api/purchase/department/${dept}`
    );
    setRequests(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/purchase/department/${id}`,
      { departmentApproval: status }
    );

    alert("Updated");
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Department Dashboard</h1>

      {requests.map((r) => (
        <div key={r._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{r.item}</h3>
          <p>{r.reason}</p>
          <p>Status: {r.status}</p>

          <button onClick={() => updateStatus(r._id, "Approved")}>
            Approve
          </button>

          <button onClick={() => updateStatus(r._id, "Rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default DepartmentPurchase;