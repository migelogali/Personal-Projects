import { useState, useEffect } from "react"; // Added useEffect - SG
import { fetchWithAuth } from "../api"; // Added the API helper as well - SG

export default function Jobs() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  // Add the backend API call
  useEffect(() => {
    async function fetchJobs() {
      try {
        // Replaced regular fetch with fetchWithAuth so the JWT is sent to the backend - SG
        const response = await fetchWithAuth("/jobs/");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json(); 
        setJobs(data);
      } catch (err) {
        console.error("Jobs error:", err);
        setError("Failed to load jobs. Please try again.");
      }
    }

    fetchJobs();
  }, []);
  
  
  
  const handleAddJob = async () => {
    setError("");

    if (company.trim() === "" || role.trim() === "") {
      setError("Company and role are required.");
      return;
    }

    // Mapped frontend variables to the exact backend column names - SG
    const newJob = {
      job_company: company.trim(),
      job_title: role.trim(),
      job_location: null,
      job_website: null,
      job_date_applied: new Date().toISOString().split("T")[0],
      job_status: status,
      job_notes: null,
    };

    try {
      // Removed hardcoded localhost and headers, used fetchWithAuth - SG
      const response = await fetchWithAuth("/jobs/", {
        method: "POST",
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error("Failed to add job");
      }

      const data = await response.json();

      // Attached the real database job_id to the state so it can be immediately deleted if needed - SG
      setJobs([...jobs, { ...newJob, job_id: data.job_id }]);

      setCompany("");
      setRole("");
      setStatus("Applied");
    } catch (err) {
      console.error("Add job error:", err);
      setError("Failed to add job. Please try again.");
    }
  };

  // Changed from array index to actual db job_id - SG
  const handleDelete = async (jobId) => {
    setError("");

    try {
      // Swapped to fetchWithAuth - SG
      const response = await fetchWithAuth(`/jobs/${jobId}`, {
        method: "DELETE",
      });
  
      if(!response.ok){
        throw new Error("Failed to delete job/jobs.");
      }

      setJobs(jobs.filter((job) => job.job_id !== jobId));
    } catch (err) {
      console.error("Delete job error:", err);
      setError("Failed to delete job. Please try again.");
    }
  }

  return (
    <div style={styles.container}>
      <h1>Job Applications</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form */}
      <div className="jobsForm" style={styles.form}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Role (e.g. Frontend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.input}
        >
          <option value="Applied">Applied</option>
          {/* Fixed ENUM value to match backend for 'Interviewing' - SG */}
          <option value="Interviewing">Interviewing</option>
          <option value="Waiting">Waiting</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button onClick={handleAddJob} style={styles.button}>
          Add Job
        </button>
      </div>

      {/* Job List */}
      <div>
        {/* Changed React key to job_id */}
        {jobs && jobs.map((job) => (
          <div key={job.job_id} style={styles.card}>
            <div>
              <h3 style={{ margin: 0 }}>{job.job_company}</h3>
              <p style={{ margin: "5px 0" }}>{job.job_title}</p>
              <span style={styles.status}>{job.job_status}</span>
            </div>

            <button
              onClick={() => handleDelete(job.job_id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
    container: {
        padding: "20px",
        color: "#333",
      
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      
        minHeight: "100vh",
      },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    width: "300px",
  },
  input: {
    padding: "8px",
  },
  button: {
    padding: "8px",
    cursor: "pointer",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  
    padding: "12px",
    marginBottom: "10px",
  
    backgroundColor: "#f2f2f2",
  
    width: "400px",
  
    borderRadius: "10px",
  },
  status: {
    display: "inline-block",
    marginTop: "5px",
    padding: "3px 8px",
    backgroundColor: "#333",
    color: "white",
    fontSize: "12px",
    borderRadius: "4px",
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
};
