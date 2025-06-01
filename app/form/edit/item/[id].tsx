import { useFetch } from "@/hooks/useFetch";
import { Modules } from "@/modules";
import { ItemDetailSchema } from "@/validation/itemSchema";
import { useLocalSearchParams } from "expo-router";

const SupplierForm = () => {
  const { id } = useLocalSearchParams();
  const { data } = useFetch<ItemDetailSchema>(`/inventory/${id}/`, true);
  return <Modules.FormModules.item item={data} />;
};

export default SupplierForm;
