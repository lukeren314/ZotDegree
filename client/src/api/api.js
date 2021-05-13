function setEndpointHost(path) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:8080${path}`;
  }
  return `https://zotdegree.herokuapp.com${path}`;
}

export async function apiSearchCourses(query) {
  return await jsonRequest("/api/courses/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
}

export async function apiGetCourse(courseId) {
  return await jsonRequest(`/api/courses/getCourse/${courseId}`, { method: "GET" });
}
export async function apiGetRequirements(degrees) {
  return await jsonRequest("/api/requirements/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ degreeNames: degrees }),
  });
}

export async function apiSaveUserData(userKey, userData) {
  return await jsonRequest("/api/users/saveUserData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...userData, userKey: userKey }),
  });
}

export async function apiLoadUserData(userKey) {
  return await jsonRequest("/api/users/loadUserData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userKey: userKey }),
  });
}

async function jsonRequest(path, params) {
  try {
    const json = await fetch(setEndpointHost(path), params)
      .then((resp) => resp.json())
      .catch(() => null);
    if ("error" in json) {
      console.log(json.error);
      return null;
    }
    return json;
  } catch {}
  return null;
}
