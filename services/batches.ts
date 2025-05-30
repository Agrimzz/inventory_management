import api from "./api";

export const getBatches = async () => {
  try {
    const res = await api.get("/batches/");
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.error("Request failed:", error.message || error);
    throw error;
  }
};

export const createBatch = async (formData: FormData) => {
  {
    try {
      const res = await api.post("/batches/", formData);
      console.log(res.data);
      return res.data;
    } catch (error: any) {
      console.error("Request failed:", error.message || error);
      throw error;
    }
  }
};
