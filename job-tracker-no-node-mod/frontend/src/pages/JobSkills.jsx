import { useState, useEffect } from "react"; // Added useEffect
import { fetchWithAuth } from "../api"; // Added API helper

export default function JobSkills() {
  const [skill, setSkill] = useState("");
  // Added category and level states to satisfy backend requirements for Issue #28 - SG
  const [category, setCategory] = useState("Language");
  const [level, setLevel] = useState("Beginner");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");

  // Add the backend API call
  useEffect(() => {
    async function fetchJobSkills() {
      try {
        // Replaced regular fetch with fetchWithAuth - SG
        const response = await fetchWithAuth("/skills/");

        if (!response.ok) {
          throw new Error("Failed to fetch job skills");
        }

        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error("Skills error:", err);
        setError("Failed to load skills. Please try again.");
      }
    }

    fetchJobSkills();
  }, []);
  
  
  
  const handleAddSkill = async () => {
    setError("");

    if (skill.trim() === "") {
      setError("Skill name is required.");
      return;
    }

    // Mapped to exact backend MySQL columns - SG
    const newSkill = {
      skill_name: skill.trim(),
      skill_category: category,
      skill_level: level
    };

    try {
      // Used fetchWithAuth and passed the correct payload object - SG
      const response = await fetchWithAuth("/skills/", {
        method: "POST",
        body: JSON.stringify(newSkill),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add job skill/skills");
      }

      const data = await response.json();
      // Appending the new skill object, attaching the real database skill_id - SG
      setSkills([...skills, { ...newSkill, skill_id: data.skill_id }]);
      
      // Reset form
      setSkill("");
      setCategory("Language");
      setLevel("Beginner");
    } catch (err) {
      console.error("Add skill error:", err);
      setError("Failed to add skill. It may already exist.");
    }
  }

  // Swapped from array index to actual db skillId - SG
  const handleDelete = async (skillId) => {
    setError("");

    try {
      const response = await fetchWithAuth(`/skills/${skillId}`, {
        method: "DELETE",
      });

      if(!response.ok){
        throw new Error("Failed to delete job skill/skills.");
      }

      // Filter by database skill_id - SG
      setSkills(skills.filter((s) => s.skill_id !== skillId));
    } catch (err) {
      console.error("Delete skill error:", err);
      setError("Failed to delete skill. Please try again.");
    }
  }

  return (
    <div style={styles.container}>
      <h1>Job Skills</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter a skill (e.g. React, SQL)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={styles.input}
        />
        
        {/* Added dropdowns for category and level to match Issue #28 DB requirements - SG */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
          <option value="Language">Language</option>
          <option value="Framework">Framework</option>
          <option value="Tool">Tool</option>
          <option value="Database">Database</option>
          <option value="Version Control">Version Control</option>
          <option value="Cloud Platforms">Cloud Platforms</option>
          <option value="Operating Systems">Operating Systems</option>
        </select>

        <select value={level} onChange={(e) => setLevel(e.target.value)} style={styles.input}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button onClick={handleAddSkill} style={styles.button}>
          Add Skill
        </button>
      </div>

      <ul style={styles.list}>
        {/* Swapped key to skill_id and updated variables to map to SQL columns - SG */}
        {skills && skills.map((s) => (
          <li key={s.skill_id} style={styles.listItem}>
            <span>
              <strong>{s.skill_name}</strong> ({s.skill_level} - {s.skill_category})
            </span>
            {/* Passing the real database ID to delete - SG */}
            <button
              onClick={() => handleDelete(s.skill_id)}
              style={styles.deleteBtn}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    width: "250px",
  },
  button: {
    padding: "8px 12px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    width: "300px",
    padding: "8px",
    marginBottom: "8px",
    backgroundColor: "#f2f2f2",
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
