import { zodResolver } from "@hookform/resolvers/zod";
import { Ellipsis } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import FormField from "@/components/form/FormField";
import images from "@/constants/images";
import { createSupplier } from "@/services/supplier";
import { pickImages } from "@/utils/imagePicker";
import { supplierSchema, SupplierSchema } from "@/validation/supplierSchema";

export default function SupplierForm() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      images: [],
      name: "",
      contact_name: "",
      contact_title: "",
      phone: "",
      alt_phone: "",
      email: "",
      fax: "",
      purpose: "",
      restrictions: "",
      notes: "",
      contract_number: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      preferred_delivery_days: "",
      operational_hours: "",
      is_active: true,
    },
  });

  const supplierImages = watch("images") || [];

  const handleImagePick = async () => {
    const newImages = await pickImages();
    if (newImages.length > 0) {
      setValue("images", [...supplierImages, ...newImages]);
    }
  };
  const onSubmit = async (data: SupplierSchema) => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((img, idx) => {
          formData.append("images", {
            uri: img.uri,
            name: `image_${idx}.jpg`,
            type: "image/jpeg",
          } as unknown as Blob); // Use Blob for proper typing
        });
      } else {
        const isObject = typeof value === "object" && value !== null;
        formData.append(key, isObject ? JSON.stringify(value) : String(value));
      }
    });

    try {
      const created = await createSupplier(formData);
      Alert.alert("Success", `Supplier "${created.name}" created!`);
      reset();
    } catch (err: any) {
      console.error(err.response.data);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Could not save supplier"
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
        <Text className="text-sm font-plight text-white">Add Supplier</Text>
        <View className="w-14 h-14 bg-gray rounded-2xl items-center justify-center">
          <Ellipsis size={16} color="#F1F1F1" />
        </View>
      </View>

      <KeyboardAwareScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === "ios" ? 40 : 20}
        keyboardOpeningTime={0}
        keyboardDismissMode="on-drag"
      >
        {/* Image Picker */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">
            Supplier Image
          </Text>
          <TouchableOpacity
            onPress={handleImagePick}
            className="bg-gray p-4 rounded-2xl items-center"
          >
            <Text className="text-white font-pregular">Select Images</Text>
          </TouchableOpacity>
          {supplierImages && supplierImages.length > 0 && (
            <FlatList
              data={supplierImages}
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
        {/* General */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">General</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Name"
                  placeholder="Supplier name"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.name?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="contact_name"
            render={({ field: { value, onChange } }) => (
              <>
                <FormField
                  title="Contact Name"
                  placeholder="Primary contact"
                  value={value}
                  handleChangeText={onChange}
                  error={errors.contact_name?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="contact_title"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Contact Title"
                placeholder="e.g. Manager"
                value={value}
                handleChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Contact Info */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">
            Contact Info
          </Text>
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
                    isNumeric={key === "email" ? false : true}
                    error={errors[key as keyof SupplierSchema]?.message}
                  />
                </>
              )}
            />
          ))}
        </View>

        {/* Details */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Details</Text>
          <Controller
            control={control}
            name="purpose"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Purpose"
                placeholder="Supplier specialization"
                value={value}
                handleChangeText={onChange}
                error={errors.purpose?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="restrictions"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Restrictions"
                placeholder="e.g. payment terms"
                value={value}
                handleChangeText={onChange}
                error={errors.restrictions?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="contract_number"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Contract Number"
                placeholder="Suppliers Contract Number"
                value={value}
                handleChangeText={onChange}
                isNumeric
                error={errors.contract_number?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Notes"
                placeholder="Additional notes"
                value={value}
                handleChangeText={onChange}
                error={errors.notes?.message}
              />
            )}
          />
        </View>

        {/* Address */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Address</Text>
          {[
            {
              key: "address",
              label: "Address",
              ph: "Street address",
            },
            { key: "city", label: "City", ph: "City" },
            { key: "state", label: "State", ph: "State/Province" },
            {
              key: "postal_code",
              label: "Postal Code",
              ph: "ZIP / Postal",
            },
            { key: "country", label: "Country", ph: "Country" },
          ].map(({ key, label, ph }) => (
            <Controller
              key={key}
              control={control}
              name={key as any}
              render={({ field: { value, onChange } }) => (
                <FormField
                  title={label}
                  placeholder={ph}
                  value={value}
                  handleChangeText={onChange}
                  isNumeric={key === "postal_code" ? true : false}
                  error={errors[key as keyof SupplierSchema]?.message}
                />
              )}
            />
          ))}
        </View>

        {/* Schedule */}
        <View className="flex flex-col gap-2 mt-4">
          <Text className="text-lg font-psemibold text-white">Schedule</Text>
          <Controller
            control={control}
            name="preferred_delivery_days"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Preferred Delivery Days"
                placeholder="Mon, Wed, Fri"
                value={value}
                handleChangeText={onChange}
                error={errors.preferred_delivery_days?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="operational_hours"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Operational Hours"
                placeholder="9am–5pm"
                value={value}
                handleChangeText={onChange}
                error={errors.operational_hours?.message}
              />
            )}
          />
        </View>

        {/* Active Toggle */}
        <View className="flex-row items-center justify-between bg-gray p-4 rounded-2xl mt-4">
          <Text className="text-white font-pregular">Is Active</Text>
          <Controller
            control={control}
            name="is_active"
            render={({ field: { value, onChange } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: "#555", true: "#0f0" }}
                thumbColor={value ? "#fff" : "#aaa"}
              />
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
            {loading ? "Saving..." : "Save Supplier"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
