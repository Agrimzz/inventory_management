const URL = process.env.EXPO_PUBLIC_API_URL;

export const createUnit = async (formData: FormData) => {
  const res = await fetch(`${URL}/units/`, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      const result = res.json();
      return result;
    })
    .catch((err) => {
      if (err.response) {
        console.log("Server Error", err.response.data);
      } else if (err.request) {
        console.log("No response received", err.request);
      } else {
        console.log("Axios config error", err.message);
      }
      return err;
    });

  return res;
};
