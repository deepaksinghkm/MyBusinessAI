import {
  apiRequest,
  API_BASE_URL,
} from "./api";

export async function getCompanies() {
  return apiRequest("/companies/");
}

export async function getCompany(id) {
  return apiRequest(`/companies/${id}`);
}

export async function createCompany(data) {
  return apiRequest("/companies/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCompany(id, data) {
  return apiRequest(`/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCompany(id) {
  return apiRequest(`/companies/${id}`, {
    method: "DELETE",
  });
}

export async function uploadCompanyLogo(
  companyId,
  file
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/companies/${companyId}/logo`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      "Logo upload failed";

    throw new Error(message);
  }

  return data;
}