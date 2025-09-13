const backendDomain = "http://localhost:8080"

const SummaryApi = {
  // User-related endpoints
  signUp: {
    url: `${backendDomain}/api/signup`,
    method: "POST",
  },
  signIn: {
    url: `${backendDomain}/api/auth/login`,
    method: "POST",
  },

  // Timetable-related endpoints
  createTimetable: {
    url: `${backendDomain}/api/timetable/create`, // Assuming the endpoint is 'create'
    method: "POST", // Typically a POST request for creating new data
  },
  getTimetable: {
    url: `${backendDomain}/api/timetable`, // Assuming this endpoint fetches timetable
    method: "GET", // Typically a GET request to retrieve data
  },
  updateTimetable: {
    url: `${backendDomain}/api/timetable/update`, // Assuming this endpoint updates an existing timetable
    method: "PUT", // PUT or PATCH for updating data
  },
  deleteTimetable: {
    url: `${backendDomain}/api/timetable/delete`, // Assuming this deletes a timetable entry
    method: "DELETE", // DELETE request for removing data
  },
};

export default SummaryApi;
