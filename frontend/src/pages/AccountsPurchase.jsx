import { useEffect, useState } from "react";
import axios from "axios";

function AccountsPurchase() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/purchase/department/Accounts"
    );
    setRequests(res.data);
  };

  const finalApproval = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/purchase/accounts/${id}`,
      { accountsApproval: status }
    );

    alert("Updated");
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Accounts Dashboard</h1>

      {requests.map((r) => (
        <div key={r._id} style={{ border: "1px solid green", margin: "10px", padding: "10px" }}>
          <h3>{r.item}</h3>
          <p>{r.reason}</p>
          <p>Status: {r.status}</p>

          <button onClick={() => finalApproval(r._id, "Approved")}>
            Approve Payment
          </button>

          <button onClick={() => finalApproval(r._id, "Rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default AccountsPurchase;