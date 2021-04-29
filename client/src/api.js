function setEndpointHost(path) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:8080${path}`;
  }
  return `https://localhost:8080${path}`;
}

export async function searchCourses(query) {
  const json = await fetch(setEndpointHost("/api/courses/search"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  })
    .then((resp) => resp.json())
    .catch((error) => console.log("Error: ", error));
  return json;
}

export async function getRequirements(degrees) {
  const json = await fetch(setEndpointHost("/api/requirements/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ degreeNames: degrees }),
  })
    .then((resp) => resp.json())
    .catch((error) => console.log("Error: ", error));
  return json;
}
