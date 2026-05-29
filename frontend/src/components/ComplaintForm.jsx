import { useState } from "react";
import axios from "axios";

function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/complaints/add",
        formData
      );

      alert(res.data.message);

      setFormData({
        title: "",
        description: "",
        department: ""
      });
    } catch (error) {
      console.log(error);
      alert("Error submitting complaint");
    }
  };

  return (
    <div>
      <h2>Submit Complaint</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Complaint Title"
          value={formData.title}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Complaint Description"
          value={formData.description}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;