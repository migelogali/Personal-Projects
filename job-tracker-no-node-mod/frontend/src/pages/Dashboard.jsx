// Add React Hook
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/NavBar";
import { fetchWithAuth } from "../api"; // Added API helper - SG

function Dashboard() {
  const userName = "User Name";

  const [stats, setStats] = useState({
    totalApplications: 0,      
    interviews: 0,
    offers: 0,
    rejections: 0,
    contacts: 0,
    skillsTracked: 0,
  });

  // Add loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Removed the unused 'summary' string - SG
  // Removed the fake data that bypasses database and started with an empty array - SG
  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  // Added 'role' state because the DB requires a job_title to save successfully - SG
  const [role, setRole] = useState(""); 
  const [status, setStatus] = useState("Applied");
  const [filter, setFilter] = useState("All");

useEffect(() => {
    async function fetchData() {
      try {
        // Fetch real stats with auth - SG
        const statsRes = await fetchWithAuth("/dashboard/stats");
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        // Fetch real jobs to populate the dashboard list - SG
        const jobsRes = await fetchWithAuth("/jobs/");
        if (jobsRes.ok) {
          setApplications(await jobsRes.json());
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddJob = async () => {
    setError("");

    if (company.trim() === "" || role.trim() === "") {
      setError("Company and role are required.");
      return;
    }

    const newJob = {
      job_company: company.trim(),
      job_title: role.trim(),
      job_location: null,
      job_website: null,
      job_status: status,
      job_date_applied: new Date().toISOString().split('T')[0],
      job_notes: null,
    };

    try {
      // POST to backend so it actually saves - SG
      const response = await fetchWithAuth("/jobs/", {
        method: "POST",
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error("Failed to add job");
      }

      const data = await response.json();
      setApplications([...applications, { ...newJob, job_id: data.job_id }]);
      
      // Reset inputs
      setCompany("");
      setRole("");
      setStatus("Applied");
    } catch (err) {
      console.error("Add dashboard job error:", err);
      setError("Failed to add job. Please try again.");
    }
  };

  const handleDelete = async (jobId) => {
    setError("");

    try {
      // DELETE from actual database - SG
      const response = await fetchWithAuth(`/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setApplications(applications.filter((job) => job.job_id !== jobId));
    } catch (err) {
      console.error("Delete dashboard job error:", err);
      setError("Failed to delete job. Please try again.");
    }
  };

  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    // Updated to use the DB column name 'job_status' - SG
    return applications.filter((job) => job.job_status === filter);
  }, [applications, filter]);

  const getStatusStyle = (status) => {
    const base = {
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
    };

    switch (status) {
      case "Applied":
        return { ...base, background: "#dbeafe", color: "#1d4ed8" };
      case "Interviewing":
        return { ...base, background: "#fef9c3", color: "#854d0e" };
      case "Waiting":
        return { ...base, background: "#e5e7eb", color: "#374151" };
      case "Rejected":
        return { ...base, background: "#fee2e2", color: "#991b1b" };
      case "Offer":
        return { ...base, background: "#dcfce7", color: "#166534" };
      default:
        return base;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title} style={{ color: "white" }}>Job Tracker</h1>
          <p style={styles.subtext}>Welcome back, {userName}</p>
        </div>

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "15px", fontWeight: "bold" }}>
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>Applied<br /><b>{loading ? "..." : stats.totalApplications}</b></div>
          <div style={styles.summaryCard}>Interviewing<br /><b>{loading ? "..." : stats.interviews}</b></div>
          <div style={styles.summaryCard}>Rejected<br /><b>{loading ? "..." : stats.rejections}</b></div>
          <div style={styles.summaryCard}>Offers<br /><b>{loading ? "..." : stats.offers}</b></div>
        </div>

        {/* ADD JOB */}
        <div style={styles.card}>
          <h2 style={{ color: "white" }}>Add Application</h2>

          <div style={styles.row}>
            <input
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={styles.input}
            />
            
            {/* Added missing role input - SG */}
            <input
              placeholder="Role (e.g. Software Engineer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Waiting">Waiting</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>

            <button style={styles.addButton} onClick={handleAddJob}>
              Add +
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div style={styles.card}>
          <h2 style={{ color: "white" }}>Filter</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Waiting">Waiting</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>

        {/* LIST */}
        <div style={styles.card}>
          <h2 style={{ color: "white" }}>Applications</h2>

          <div>
            {/* Mapped frontend to correct DB columns - SG */}
            {filteredApplications && filteredApplications.map((job) => (
              <div key={job.job_id} style={styles.jobRow}>
                <div>
                  <div style={styles.company}>{job.job_company}</div>
                  <div style={getStatusStyle(job.job_status)}>{job.job_status}</div>
                </div>

                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(job.job_id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <Navbar />

      </div>
    </div>
  );
}

/* =========================
   🎨 REAL VISUAL REDESIGN
========================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "30px",
    color: "white",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    fontSize: "34px",
    margin: 0,
  },

  subtext: {
    color: "#cbd5e1",
    marginTop: "5px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },

  summaryCard: {
    background: "#253550",  // much lighter than before
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #4a5f7a",
  },

  card: {
    background: "#1a2c45",  // much lighter than before
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid #2d3f55",
    color: "white",  // fix the dark heading text
  },

  row: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #4a5f7a",  // was #334155, more visible border
    background: "#1e293b",  // was #0f172a, lighter so it's distinguishable from card
    color: "white",
    flex: 1,
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #4a5f7a",  // was #334155, matches input
    background: "#1e293b",  // was #0f172a, matches input
    color: "white",
  },

  addButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  jobRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #2d3f55",  // was #1f2937, more visible divider
  },

  company: {
    fontWeight: "600",
    marginBottom: "5px",
  },

  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default Dashboard;
