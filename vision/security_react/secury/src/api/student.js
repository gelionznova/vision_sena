import { BASE_API } from "../utils/constants";

export async function getStudentsApi() {
  try {
    const url = `${BASE_API}/api/students/`;
    console.log("Fetching:", url);
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addStudentApi(data, token) {
  try {
    const formData = new FormData();
    formData.append("student_id", data.student_id);
    formData.append("full_name", data.full_name);
    formData.append("training_program", data.training_program);
    formData.append("image", data.image);

    const url = `${BASE_API}/api/students/`;
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error("Error al agregar estudiante");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function updateStudentApi(id, data, token) {
  try {
    const formData = new FormData();
    formData.append("student_id", data.student_id);
    formData.append("full_name", data.full_name);
    formData.append("training_program", data.training_program);
    if (data.image) formData.append("image", data.image);

    const url = `${BASE_API}/api/students/${id}/`;
    const params = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteStudentApi(id, token) {
  try {
    const url = `${BASE_API}/api/students/${id}/`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getStudentByIdApi(id) {
  try {
    const url = `${BASE_API}/api/students/${id}/`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
