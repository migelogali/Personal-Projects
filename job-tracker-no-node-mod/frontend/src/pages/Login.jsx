import { useState } from "react";
// to send user to dashboard after login
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        if (email.trim() === "" || password.trim() === "") {
            setError("Email and password are required.");
            return;
        }

        try {
            // no token yet, so no fetchWithAuth yet
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_email: email, user_password: password }),
            });

            if (!response.ok) {
                setError("Invalid email or password.");
                return;
            }

            const data = await response.json();
            // had to look this part up because didn't know how - MG
            // stores returned token
            localStorage.setItem("token", data.token);
            // redirect to dashboard
            navigate("/");
        }
        catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    }

return (
    <div style={styles.container}>
        <h1>Job Tracker</h1>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={styles.form}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />

            <button onClick={handleLogin} style={styles.button}>
                Login
            </button>
        </div>
    </div>
);
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "50px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px",
    },
    input: {
        padding: "8px",
    },
    button: {
        padding: "10px",
        cursor: "pointer",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "8px",
    },
};