const API_BASE_URL = "http://127.0.0.1:8000";

/*
 * Get all brands
 */
export async function getBrands() {
  const response = await fetch(
    `${API_BASE_URL}/brands/`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to fetch brands"
    );
  }

  return result;
}


/*
 * Get single brand
 */
export async function getBrand(
  brandId
) {
  const response = await fetch(
    `${API_BASE_URL}/brands/${brandId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to fetch brand"
    );
  }

  return result;
}


/*
 * Create brand
 */
export async function createBrand(
  data
) {
  const response = await fetch(
    `${API_BASE_URL}/brands/`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to create brand"
    );
  }

  return result;
}


/*
 * Update brand
 */
export async function updateBrand(
  brandId,
  data
) {
  const response = await fetch(
    `${API_BASE_URL}/brands/${brandId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to update brand"
    );
  }

  return result;
}


/*
 * Delete brand
 */
export async function deleteBrand(
  brandId
) {
  const response = await fetch(
    `${API_BASE_URL}/brands/${brandId}`,
    {
      method: "DELETE",
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to delete brand"
    );
  }

  return result;
}


/*
 * Upload brand logo
 */
export async function uploadBrandLogo(
  brandId,
  file
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response = await fetch(
    `${API_BASE_URL}/brands/${brandId}/logo`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to upload brand logo"
    );
  }

  return result;
}


/*
 * Delete brand logo
 */
export async function deleteBrandLogo(
  brandId
) {
  const response = await fetch(
    `${API_BASE_URL}/brands/${brandId}/logo`,
    {
      method: "DELETE",
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Failed to delete brand logo"
    );
  }

  return result;
}