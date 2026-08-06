import api from "./api";

export const getCompanies = () => api.get("/companies/");

export const getCompany = (id) =>
  api.get(`/companies/${id}`);

export const createCompany = (data) =>
  api.post("/companies/", data);

export const updateCompany = (id, data) =>
  api.put(`/companies/${id}`, data);

export const deleteCompany = (id) =>
  api.delete(`/companies/${id}`);
export const uploadCompanyLogo = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(
    `/companies/${id}/logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};