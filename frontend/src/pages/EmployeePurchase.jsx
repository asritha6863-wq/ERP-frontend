import { useState } from "react";
import axios from "axios";

function EmployeePurchase() {
  const [employeeName, setEmployeeName] = useState("");
  const [item, setItem] = useState("");
  const [reason, setReason] = useState("");
  const [department, setDepartment] = useState("");

  const submitRequest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/purchase/add",
        {
          employeeName,
          item,
          reason,
          department
        }
      );

      alert(res.data.message);

      setEmployeeName("");
      setItem("");
      setReason("");
      setDepartment("");
    } catch (error) {
      alert("Error submitting request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Purchase Request</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Item (Laptop, Printer)"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <br /><br />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">Select Department</option>
        <option value="SCM">SCM</option>
        <option value="Accounts">Accounts</option>
        <option value="IT">IT</option>
      </select>

      <br /><br />

      <button onClick={submitRequest}>
        Submit Request
      </button>
    </div>
  );
}

export default EmployeePurchase;