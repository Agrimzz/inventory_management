import { useFetch } from "@/hooks/useFetch";
import { Modules } from "@/modules";
import { WarehouseWithIdSchema } from "@/validation/warehouseSchema";
import { useLocalSearchParams } from "expo-router";

const SupplierForm = () => {
  const { id } = useLocalSearchParams();
  const { data } = useFetch<WarehouseWithIdSchema>(`/warehouses/${id}/`, true);
  return <Modules.FormModules.warehouse warehouse={data} />;
};

export default SupplierForm;
