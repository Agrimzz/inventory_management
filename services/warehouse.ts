import api from "./api";

const URL = process.env.EXPO_PUBLIC_API_URL;

export const createWarehouse = async (formData: FormData) => {
  try {
    const res = await fetch(`${URL}/warehouses/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server responded with error:", res.status);
      console.error("Error response body:", errorText);
      throw new Error(`Failed to create warehouse. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Request failed:", error.message || error);
    throw error;
  }
};

export const getWarehouses = async () => {
  const res = await api.get("/warehouses/");
  return res.data;
};

export const updateWarehouse = async (id: string, formData: FormData) => {
  const res = await fetch(`${URL}/warehouses/${id}/`, {
    method: "PUT",
    body: formData,
  })
    .then((res) => {
      console.log("done", res);
      return res;
    })
    .catch((err) => {
      console.log("Error", err);
      return err;
    });

  return res;
};
