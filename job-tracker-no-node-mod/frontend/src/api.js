// =====================================================================
// This is meant to be a helper function to talk to the backend.
// Instead of typing out the localhost URL and manually grabbing
// the JWT token from local storage on every single page, we just
// use this fetchWithAuth function to reduce typing late
//
// Credit to:  https://reliasoftware.com/blog/fetch-api-vs-axios
// As well as: https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
// =====================================================================

const BASE_URL = "http://localhost:3000/api";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers, 
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: headers,
  });

  // If the backend says NO (401 or 403), the token probably expired.
  // Delete the dead token and kick the user back to the login page.
  if (response.status === 401 || response.status === 403) {
    console.log("Token expired or missing. Logging out...");
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  }

  return response;
};