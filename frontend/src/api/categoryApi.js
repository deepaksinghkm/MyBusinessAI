import { apiRequest } from "./api";

/*
 * Get all categories
 */
export async function getCategories() {
  return apiRequest("/categories/");
}

/*
 * Get single category
 */
export async function getCategory(categoryId) {
  return apiRequest(
    `/categories/${categoryId}`
  );
}

/*
 * Create category
 */
export async function createCategory(data) {
  return apiRequest("/categories/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/*
 * Update category
 */
export async function updateCategory(
  categoryId,
  data
) {
  return apiRequest(
    `/categories/${categoryId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

/*
 * Delete category
 */
export async function deleteCategory(
  categoryId
) {
  return apiRequest(
    `/categories/${categoryId}`,
    {
      method: "DELETE",
    }
  );
}
