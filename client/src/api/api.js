function setEndpointHost(path) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:8080${path}`;
  }
  return `https://zotdegree.herokuapp.com${path}`;
}

export async function apiSearchCourses(query) {
  return await postJsonRequest("/api/courses/search", query);
}

export async function apiGetCourse(courseId) {
  return await jsonRequest(`/api/courses/getCourse/${courseId}`, {
    method: "GET",
  });
}
export async function apiGetRequirements(degrees) {
  return await postJsonRequest("/api/requirements/", { degreeNames: degrees });
}

export async function apiSaveUserData(userKey, userData) {
  return await postJsonRequest("/api/users/saveUserData", {
    ...userData,
    userKey: userKey,
  });
}

export async function apiLoadUserData(userKey) {
  return await postJsonRequest("/api/users/loadUserData", { userKey: userKey });
}

async function postJsonRequest(path, data) {
  return await jsonRequest(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function jsonRequest(path, params) {
  try {
    const json = await fetch(setEndpointHost(path), params)
      .then((resp) => resp.json())
      .catch((error) => { 
        console.log(error);
        return {error: "Request Error!"};
       });
       if ("error" in json)
       {
         console.log(json.error);
       }
    return json;
  } catch {}
  return { error: "Request Failed!" };
}
