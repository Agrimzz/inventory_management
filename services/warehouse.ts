import api from "./api";

export const createWarehouse = async (formData: FormData) => {
  try {
    const res = await fetch(`http://192.168.101.10:8000/api/ims/warehouses/`, {
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
