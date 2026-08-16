import { Link } from "react-router-dom";

function Navbar() {

    return (
        <div style={styles.navbar}>
          <Link to="/">Dashboard</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/contacts">Contacts</Link>
        </div>
      );
  }
  
const styles = {
  navbar: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",

    display: "flex",
    gap: "14px",

    padding: "14px 20px",

    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",

    border: "1px solid rgba(255,255,255,0.15)",

    borderRadius: "22px",

    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",

    zIndex: 1000,
  },

  link: {
    textDecoration: "none",

    color: "white",

    padding: "10px 18px",

    borderRadius: "14px",

    background: "rgba(255,255,255,0.12)",

    border: "1px solid rgba(255,255,255,0.15)",

    backdropFilter: "blur(8px)",

    fontWeight: "500",

    transition: "all 0.25s ease",

    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
};
  
  export default Navbar;