import api from "@/services/api";
import { batchSchema, BatchSchema } from "@/validation/batchSchema";
import { SupplierWithIdSchema } from "@/validation/supplierSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import FormField from "./FormField";

const CreateBatch = ({ onBatchCreated }: any) => {
  const [suppliers, setSuppliers] = useState<SupplierWithIdSchema[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchSuppliers();
    }, [])
  );

  const fetchSuppliers = async () => {
    const res = await api.get("/suppliers/");
    setSuppliers(res.data.results);
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BatchSchema>({
    resolver: zodResolver(batchSchema),
  });

  const onSubmit = async (data: BatchSchema) => {
    try {
      const res = await api.post("/batches/", data);
      const newBatch = res.data;
      Alert.alert("Success", `Batch "${newBatch.batch_name}" created!`);
      onBatchCreated(newBatch);
      reset();
    } catch (err) {
      console.error("Batch creation failed:", err);
    }
  };

  return (
    <View className="mt-4">
      <Text className="mb-2 text-white font-pmedium">Create New Batch</Text>

      <Controller
        control={control}
        name="batch_name"
        render={({ field }) => (
          <FormField
            title="Batch Name"
            placeholder="Enter batch name"
            value={field.value}
            handleChangeText={field.onChange}
            error={errors.batch_name?.message}
          />
        )}
      />

      <Text className="text-lg font-pmedium text-white mt-4">
        Choose a Supplier
      </Text>

      <View className="flex-col mt-16">
        {suppliers.map((supplier) => {
          const selectedSupplier = watch("supplier_id");
          const selected = selectedSupplier === supplier.id.toString();

          return (
            <Pressable
              key={supplier.id}
              onPress={() => {
                setValue("supplier_id", supplier.id.toString());
              }}
              className={`p-6 rounded-2xl border-2  -mt-12  border-lightgray
                              ${
                                selected
                                  ? "bg-primary h-[175px] "
                                  : "bg-gray h-[150px]"
                              }
                          `}
            >
              <Text className="text-sm font-plight text-white/80">
                {supplier.address}, {supplier.city}
              </Text>
              <Text className="text-4xl font-plight text-white mt-2">
                {supplier.name}
              </Text>
              {selected && (
                <View className="flex flex-col gap-1 mt-4">
                  <Text className="text-xs font-plight text-white">
                    {supplier.phone}
                  </Text>
                  <Text className="text-xs font-plight text-white">
                    {supplier.email}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-green-700 p-3 rounded-xl mt-4"
        >
          <Text className="text-white text-center font-pmedium">
            Save Batch
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateBatch;
