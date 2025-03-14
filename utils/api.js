import axios from "axios";

// Create an Axios instance with global configuration
export const api = ()=> {
  axios.create({
    baseURL: "http://localhost:5001/api", // set your API base URL in your .env.local file
    timeout: 10000, // optional: set a request timeout
  });
}
// http://localhost:5001/api/job-card?page=1&pageSize=25


