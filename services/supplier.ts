import axios from "axios";

const URL = process.env.EXPO_PUBLIC_API_URL;

export const createSupplier = async (formData: FormData) => {
  try {
    const res = await fetch(`${URL}/suppliers/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server responded with error:", res.status);
      console.error("Error response body:", errorText);
      throw new Error(`Failed to create supplier. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Request failed:", error);
    throw error;
  }
};

export const updateSupplier = async (id: string, formData: FormData) => {
  console.log(id, formData);

  //TO FIX: network type error

  const res = await axios
    .put(`${URL}/suppliers/${id}/`, formData)
    .then((res) => {
      console.log("done", res);
      return res;
    })
    .catch((err) => {
      console.log("Error", err);
      return err;
    });

  return res;

  // if (!res?.ok) {
  //   const errorText = await res.text();
  //   console.error("Server responded with error:", res.status);
  //   console.error("Error response body:", errorText);
  //   throw new Error(`Failed to update supplier. Status: ${res.status}`);
  // }

  // const text = await res.text();
  // const data = text ? JSON.parse(text) : {};
  // console.log("Parsed response data:", data);
  // console.log(data);
  // return data;
};
