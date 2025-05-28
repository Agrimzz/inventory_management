import FormField from "@/components/form/FormField";
import images from "@/constants/images";
import { createWarehouse } from "@/services/warehouse";
import { pickImages } from "@/utils/imagePicker";
import { warehouseSchema, WarehouseSchema } from "@/validation/warehouseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ellipsis } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WarehouseForm() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<WarehouseSchema>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      images: [],
      name: "",
      code: "",
      manager_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      alt_phone: "",
      email: "",
      fax: "",
      storage_capacity: 0,
      current_storage: 0,
      min_threshold: 0,
      max_threshold: 0,
      temperature_controlled: false,
      hazard_compatible: false,
      fire_safety_certified: false,
      last_safety_audit: "",
      operational_hours: "",
      closed_days: "",
    },
  });

  const warehouseImages = watch("images");

  const handleImagePick = async () => {
    const newImages = await pickImages();
    if (newImages.length > 0) {
      setValue("images", newImages);
    }
  };

  const onSubmit = async (data: WarehouseSchema) => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((img, idx) => {
          formData.append("images", {
            uri: img.uri,
            name: `image_${idx}.jpg`,
            type: "image/jpeg",
          } as any);
        });
      } else {
        formData.append(key, String(value));
      }
    });
    try {
      const created = await createWarehouse(formData);
      Alert.alert("Success", `Warehouse "${created.name}" created!`);
      reset();
    } catch (err: any) {
      console.error(err.response.data);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Could not save warehouse"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between p-4">
        <Image source={images.logo1} className="w-14 h-14 rounded-full" />
        <Text className="text-sm font-plight text-white">Add Warehouse</Text>
        <View className="w-14 h-14 bg-gray rounded-2xl items-center justify-center">
          <Ellipsis size={16} color="#F1F1F1" />
        </View>
      </View>

      <ScrollView
        className="px-4"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {/* Image Picker */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">
            Warehouse Image
          </Text>
          <TouchableOpacity
            onPress={handleImagePick}
            className="bg-gray p-4 rounded-2xl items-center"
          >
            <Text className="text-white font-pregular">Select Images</Text>
          </TouchableOpacity>
          {warehouseImages && warehouseImages.length > 0 && (
            <FlatList
              data={warehouseImages}
              horizontal
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.uri }}
                  className="w-24 h-24 mr-2 rounded"
                />
              )}
              className="mt-2"
            />
          )}
        </View>

        {/* General Info */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">General</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Name"
                  placeholder="Enter warehouse name"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.name?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="code"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Code"
                  placeholder="e.g. WH-001"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.code?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="manager_name"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Manager Name"
                  placeholder="Enter manager’s name"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.manager_name?.message}
                />
              </>
            )}
          />
        </View>

        {/* Address */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Address</Text>
          {[
            {
              key: "address_line1",
              label: "Address Line1",
              ph: "Street address",
            },
            {
              key: "address_line2",
              label: "Address Line2",
              ph: "Apt, suite (optional)",
            },
            { key: "city", label: "City", ph: "City" },
            { key: "state", label: "State", ph: "State/Province" },
            { key: "postal_code", label: "Postal Code", ph: "ZIP / Postal" },
            { key: "country", label: "Country", ph: "Country" },
          ].map(({ key, label, ph }) => (
            <Controller
              key={key}
              control={control}
              name={key as any}
              render={({ field: { value, onChange } }) => (
                <>
                  <FormField
                    title={label}
                    placeholder={ph}
                    value={value}
                    handleChangeText={onChange}
                    error={errors[key as keyof WarehouseSchema]?.message}
                  />
                </>
              )}
            />
          ))}
        </View>

        {/* Contact */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Contact</Text>
          {[
            { key: "phone", label: "Phone", ph: "Primary phone number" },
            { key: "alt_phone", label: "Alt Phone", ph: "Alternate phone" },
            { key: "email", label: "Email", ph: "Email address" },
            { key: "fax", label: "Fax", ph: "Fax number" },
          ].map(({ key, label, ph }) => (
            <Controller
              key={key}
              control={control}
              name={key as any}
              render={({ field: { value, onChange } }) => (
                <>
                  <FormField
                    title={label}
                    placeholder={ph}
                    value={value}
                    handleChangeText={onChange}
                    error={errors[key as keyof WarehouseSchema]?.message}
                  />
                </>
              )}
            />
          ))}
        </View>

        {/* Capacity & Thresholds */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">
            Capacity & Thresholds
          </Text>
          {[
            {
              key: "storage_capacity",
              label: "Storage Capacity",
              ph: "e.g. 1000",
            },
            {
              key: "current_storage",
              label: "Current Storage",
              ph: "e.g. 250",
            },
            { key: "min_threshold", label: "Min Threshold", ph: "e.g. 100" },
            { key: "max_threshold", label: "Max Threshold", ph: "e.g. 900" },
          ].map(({ key, label, ph }) => (
            <Controller
              key={key}
              control={control}
              name={key as any}
              render={({ field: { value, onChange } }) => (
                <>
                  <FormField
                    title={label}
                    placeholder={ph}
                    value={String(value)}
                    handleChangeText={(text: string) =>
                      onChange(Number(text) || 0)
                    }
                    error={errors[key as keyof WarehouseSchema]?.message}
                  />
                </>
              )}
            />
          ))}
        </View>

        {/* Settings */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Settings</Text>
          {[
            {
              name: "temperature_controlled",
              label: "Temperature Controlled",
            },
            { name: "hazard_compatible", label: "Hazard Compatible" },
            {
              name: "fire_safety_certified",
              label: "Fire Safety Certified",
            },
          ].map(({ name, label }) => (
            <Controller
              key={name}
              control={control}
              name={name as any}
              render={({ field: { value, onChange } }) => (
                <>
                  <View className="flex-row items-center justify-between bg-gray p-4 rounded-2xl">
                    <Text className="text-white font-pregular">{label}</Text>
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{ false: "#555", true: "#0f0" }}
                      thumbColor={value ? "#fff" : "#aaa"}
                    />
                  </View>
                  {errors[name as keyof WarehouseSchema] && (
                    <Text className="text-red-500 text-sm ml-2">
                      {/* @ts-ignore */}
                      {errors[name]?.message}
                    </Text>
                  )}
                </>
              )}
            />
          ))}
        </View>

        {/* Schedule */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Schedule</Text>
          <Controller
            control={control}
            name="last_safety_audit"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Last Safety Audit"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.last_safety_audit?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="operational_hours"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Operational Hours"
                  placeholder="Mon–Fri 9am–5pm"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.operational_hours?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="closed_days"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Closed Days"
                  placeholder="Saturday, Sunday"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.closed_days?.message}
                />
              </>
            )}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`py-3 rounded-2xl items-center mt-4 ${
            loading ? "bg-gray" : "bg-primary"
          }`}
        >
          <Text className="text-white font-psemibold">
            {loading ? "Saving..." : "Save Warehouse"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
