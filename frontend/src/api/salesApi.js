const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// GET ALL SALES
// =====================================================

export async function getSales() {
  const response = await fetch(
    `${API_BASE_URL}/sales/`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to fetch sales"
    );
  }

  return result;
}


// =====================================================
// GET SINGLE SALE
// =====================================================

export async function getSale(saleId) {
  const response = await fetch(
    `${API_BASE_URL}/sales/${saleId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to fetch sale"
    );
  }

  return result;
}


// =====================================================
// CREATE SALE
// =====================================================

export async function createSale(data) {
  const response = await fetch(
    `${API_BASE_URL}/sales/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to create sale"
    );
  }

  return result;
}


// =====================================================
// DELETE SALE
// =====================================================

export async function deleteSale(saleId) {
  const response = await fetch(
    `${API_BASE_URL}/sales/${saleId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to delete sale"
    );
  }

  return result;
}
