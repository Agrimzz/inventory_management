import { useFetch } from "@/hooks/useFetch";
import { Modules } from "@/modules";
import { SupplierWithIdSchema } from "@/validation/supplierSchema";
import { useLocalSearchParams } from "expo-router";

const SupplierForm = () => {
  const { id } = useLocalSearchParams();
  const { data } = useFetch<SupplierWithIdSchema>(`/suppliers/${id}/`, true);
  return <Modules.FormModules.supplier supplier={data} />;
};

export default SupplierForm;
