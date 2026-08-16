import { useState, useEffect } from "react";
import { fetchWithAuth } from "../api"; // Import the new helper ;)

export default function Contacts() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [contacts, setContacts] = useState([]); 
  const [error, setError] = useState("");

  // Add the backend API call
  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetchWithAuth("/contacts/");

        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();
        setContacts(data);
      } catch (err) {
        console.error("Contacts error:", err);
        setError("Failed to load contacts. Please try again.");
      }
    }

    fetchContacts();
  }, []);

  const handleAddContact = async () => {
    setError("");

    if (name.trim() === "" || email.trim() === "") {
      setError("Name and email are required.");
      return;
    }

    const newContact = {
      job_id: null,
      contact_name: name.trim(),
      contact_email: email.trim(),
      contact_linkedin: null,
      contact_notes: notes.trim(),
    };

    try {
      const response = await fetchWithAuth("/contacts/", {
        method: "POST",
        // Removed the { name: ... } wrapper
        body: JSON.stringify(newContact), 
      });
      
      if (!response.ok) {
        throw new Error("Failed to add contact");
      }
      
      const data = await response.json();
      setContacts([...contacts, { ...newContact, contact_id: data.contact_id }]);

      setName("");
      setEmail("");
      setNotes("");
    } catch (err) {
      console.error("Add contact error:", err);
      setError("Failed to add contact. Please try again.");
    }
  };

  const handleDelete = async (idToDelete) => {
    setError("");

    try {
      const response = await fetchWithAuth(`/contacts/${idToDelete}`, {
        method: "DELETE",
      });

      if(!response.ok){
        throw new Error("Failed to delete contact.");
      }

      setContacts(contacts.filter((contact) => contact.contact_id !== idToDelete));
    } catch (err) {
      console.error("Delete contact error:", err);
      setError("Failed to delete contact. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Contacts</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAddContact} style={styles.button}>
          Add Contact
        </button>
      </div>

      <div>
        {contacts && contacts.map((c) => (
          <div key={c.contact_id} style={styles.card}>
            <div>
              <h3 style={{ margin: 0 }}>{c.contact_name}</h3>
              <p style={{ margin: "5px 0" }}>{c.contact_email}</p>
              {c.contact_notes && <p style={{ margin: 0 }}>{c.contact_notes}</p>}
            </div>

            <button
              onClick={() => handleDelete(c.contact_id)}
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
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#f2f2f2",
    width: "400px",
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
};
