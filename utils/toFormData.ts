/**
 * Converts an object to FormData with options to ignore specific keys and values,
 * stringify complex data, and apply conditional dirt-checking.
 *
 * @param {Object} params - The parameters for converting to FormData.
 * @param {Record<string, any>} params.values - The object values to be transformed.
 * @param {string[]} [params.keyIgnore=[]] - Keys to be excluded from the FormData.
 * @param {any[]} [params.valueIgnore=[]] - Values to be excluded from the FormData.
 * @param {boolean} [params.stringify=false] - Whether to stringify non-File objects.
 * @param {boolean} [params.hasDirtCheck=false] - Whether to perform a dirt check on keys.
 * @returns {Promise<FormData>} - The constructed FormData object.
 */
export async function toFormData({
  values,
  keyIgnore = [],
  valueIgnore = [],
  stringify = false,
  hasDirtCheck = false,
}: {
  values: Record<string, any>;
  keyIgnore?: string[];
  valueIgnore?: any[];
  stringify?: boolean;
  hasDirtCheck?: boolean;
}): Promise<FormData> {
  const formData = new FormData();

  /**
   * Appends a key-value pair to FormData, stringifying objects and arrays if needed.
   * @param {string} key - The key to add to FormData.
   * @param {any} value - The value associated with the key.
   */
  const addToFormData = (key: string, value: any) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item: any) => {
          formData.append(key, item);
        });
      } else {
        const processedValue =
          typeof value === "object" && !(value instanceof File)
            ? JSON.stringify(value)
            : value;

        formData.append(
          key,
          stringify ? JSON.stringify(processedValue) : processedValue
        );
      }
    }
  };

  try {
    for (const [key, value] of Object.entries(values)) {
      // Skip keys/values based on ignore lists and optional dirt check
      if (
        !keyIgnore.includes(key) &&
        !valueIgnore.includes(value) &&
        (!hasDirtCheck || key !== "_dirtcheck")
      ) {
        addToFormData(key, value);
      }
    }
  } catch (error) {
    console.error("Error while converting to FormData:", error);
  }

  return formData;
}
