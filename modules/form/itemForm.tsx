import CreateBatch from "@/components/form/CreateBatch";
import CreateCategoryModal from "@/components/form/CreateCategoryModal";
import CreateUnitModal from "@/components/form/CreateUnitModal";
import FormField from "@/components/form/FormField";
import PickerField from "@/components/form/PickerField";
import images from "@/constants/images";
import { useFetch } from "@/hooks/useFetch";
import api from "@/services/api";
import { getBatches } from "@/services/batches";
import { createItem, updateItem } from "@/services/items";
import { pickImages } from "@/utils/imagePicker";
import { BatchWithIdSchema } from "@/validation/batchSchema";
import { CategoryWithId } from "@/validation/categorySchema";
import {
  ItemDetailSchema,
  ItemSchema,
  itemSchema,
} from "@/validation/itemSchema";
import { UnitWithId } from "@/validation/unitSchema";
import { WarehouseWithIdSchema } from "@/validation/warehouseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect } from "expo-router";
import { Ellipsis } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, ScrollView, Switch } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Batch", "Warehouse", "Items"];

const ItemForm = ({ item }: { item?: ItemDetailSchema | null }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Batch");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [batches, setBatches] = useState<BatchWithIdSchema[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseWithIdSchema[]>([]);
  const { data: category, refetch: refetchCategories } =
    useFetch<CategoryWithId[]>("/categories/");
  const { data: unit, refetch: refetchUnits } =
    useFetch<UnitWithId[]>("/units/");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchWarehouses();
      fetchBatches();
    }, [])
  );

  const fetchWarehouses = async () => {
    const res = await api.get("/warehouses/");
    setWarehouses(res.data.results);
  };

  const fetchBatches = async () => {
    const res = await getBatches();
    setBatches(res.results);
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      images: [],
      warehouse_id: "",
      batch_id: "",
      quantity: "",
      availability: true,
      product: {
        sku: "",
        name: "",
        description: "",
        category_id: "",
        unit_id: "",
        product_condition: "Brand New",
        attributes: [],
      },
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        ...item,
        images: item.product.images,
        product: {
          ...item.product,
          product_condition: item.product.product_condition as
            | "Brand New"
            | "Used"
            | "Refurbished",
          warranty_period: Number(item.product.warranty_period),
          category_id: String(item.product.category?.id),
          unit_id: String(item.product.unit?.id),
        },
        warehouse_id: String(item.warehouse.id),
        batch_id: String(item.batch.id),
      });
    }
  }, [item]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "product.attributes",
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      if (errors.batch_id) setActiveTab("Batch");
      else if (errors.warehouse_id) setActiveTab("Warehouse");
      else setActiveTab("Items");
    }
  }, [errors]);

  const itemImages = watch("images") || [];

  const handleImagePick = async () => {
    const newImages = await pickImages();
    if (newImages.length > 0) {
      setValue("images", [...itemImages, ...newImages]);
    }
  };

  const onSubmit = async (data: ItemSchema) => {
    //  setLoading(true);
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
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      const result = item
        ? await updateItem(item.id.toString(), formData)
        : await createItem(formData);
      Alert.alert(
        "Success",
        `${item ? "Updated" : "Created"} "${result.name}"`
      );

      if (item) {
        router.push(`/inventory/item/${item.id}` as any);
      } else {
        router.back();
      }
      reset();
    } catch (err: any) {
      console.error(err.response.data);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Could not save item"
      );
    } finally {
      //  setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between p-4">
        <Image source={images.logo1} className="w-14 h-14 rounded-full" />
        <Text className="text-sm font-plight text-white">Add Items</Text>
        <View className="w-14 h-14 bg-gray rounded-2xl items-center justify-center">
          <Ellipsis size={16} color="#F1F1F1" />
        </View>
      </View>

      {/* Tabs */}
      <View className="px-4">
        <View className="flex-row items-center justify-between bg-white/10 rounded-2xl">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`${
                activeTab === tab ? "border-primary bg-primary" : "border-gray"
              } p-3 flex-1 rounded-2xl items-center justify-center`}
            >
              <Text className="text-sm font-pmedium text-white">{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 mt-4 px-4"
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "Batch" && (
          <View>
            {isCreatingNew ? (
              <CreateBatch
                onBatchCreated={(newBatch: BatchWithIdSchema) => {
                  fetchBatches();
                  setValue("batch_id", newBatch.id.toString());
                  setIsCreatingNew(false);
                }}
              />
            ) : (
              <View className="mb-4">
                <Text className="text-white text-lg font-pmedium mb-2">
                  Choose a Batch
                </Text>
                <Controller
                  control={control}
                  name="batch_id"
                  render={({ field: { value, onChange } }) => (
                    <PickerField
                      title="Select Batch"
                      value={value}
                      placeholder="Select Batch"
                      options={batches?.map((batch) => ({
                        label: batch.batch_name,
                        value: batch.id.toString(),
                      }))}
                      onSelect={onChange}
                    />
                  )}
                />

                <TouchableOpacity
                  onPress={() => {
                    setValue("batch_id", "");
                    setIsCreatingNew(!isCreatingNew);
                  }}
                  className="p-3 rounded-xl bg-green-700 mt-2"
                >
                  <Text className="text-white text-center">
                    + Create New Batch
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Validation Error (in case user selects nothing) */}
            {!watch("batch_id") && errors.batch_id?.message && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.batch_id.message}
              </Text>
            )}
          </View>
        )}

        {activeTab === "Warehouse" && (
          <>
            <Text className="text-lg font-pmedium text-white">
              Choose a Warehouse
            </Text>

            <View className="flex-col mt-16">
              {warehouses.map((warehouse) => {
                const selectedWarehouse = watch("warehouse_id");
                const selected = selectedWarehouse === warehouse.id.toString();

                return (
                  <Pressable
                    key={warehouse.id}
                    onPress={() => {
                      setValue("warehouse_id", warehouse.id.toString());
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
                      {warehouse.address_line1}, {warehouse.city}
                    </Text>
                    <Text className="text-4xl font-plight text-white mt-2">
                      {warehouse.name}
                    </Text>
                    {selected && (
                      <View className="flex flex-col gap-1 mt-4">
                        <Text className="text-xs font-plight text-white">
                          {warehouse.phone}
                        </Text>
                        <Text className="text-xs font-plight text-white">
                          {warehouse.email}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {activeTab === "Items" && (
          <>
            {/* Image Picker */}
            <View className="flex flex-col gap-2 mt-4">
              <Text className="text-lg font-psemibold text-white">
                Item Image
              </Text>
              <TouchableOpacity
                onPress={handleImagePick}
                className="bg-gray p-4 rounded-2xl items-center"
              >
                <Text className="text-white font-pregular">Select Images</Text>
              </TouchableOpacity>
              {itemImages && itemImages.length > 0 && (
                <FlatList
                  data={itemImages}
                  horizontal
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item.uri || item.upload }}
                      className="w-24 h-24 mr-2 rounded"
                    />
                  )}
                  className="mt-2"
                />
              )}
            </View>
            <View className="flex flex-col gap-2 mt-4">
              <Text className="text-lg font-psemibold text-white">
                Product Details
              </Text>

              <Controller
                control={control}
                name="product.sku"
                render={({ field: { value, onChange } }) => (
                  <FormField
                    title="SKU"
                    placeholder="Stock Keeping Unit"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.product?.sku?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="product.name"
                render={({ field: { value, onChange } }) => (
                  <FormField
                    title="Name"
                    placeholder="Product name"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.product?.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="product.description"
                render={({ field: { value, onChange } }) => (
                  <FormField
                    title="Description"
                    placeholder="Product description"
                    value={value}
                    handleChangeText={onChange}
                    error={errors.product?.description?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="product.product_condition"
                render={({ field: { value, onChange } }) => (
                  <PickerField
                    title="Product Condition"
                    value={value}
                    placeholder="Brand New"
                    options={[
                      { label: "Brand New", value: "Brand New" },
                      { label: "Used", value: "Used" },
                      { label: "Refurbished", value: "Refurbished" },
                    ]}
                    onSelect={onChange}
                  />
                )}
              />

              <View className="flex flex-row items-center justify-between w-full mt-4">
                <Text className="text-lg font-psemibold text-white">
                  Category Information
                </Text>
                <TouchableOpacity
                  className="py-2"
                  onPress={() => setCategoryModalVisible(true)}
                >
                  <Text className="text-primary font-pregular">
                    + Add Category
                  </Text>
                </TouchableOpacity>
              </View>

              <Controller
                control={control}
                name="product.category_id"
                render={({ field: { value, onChange } }) => (
                  <PickerField
                    title="Category"
                    value={value?.toString()}
                    placeholder="Select Category"
                    options={
                      category?.map((category) => ({
                        label: category.name,
                        value: category.id.toString(),
                      })) || []
                    }
                    onSelect={onChange}
                  />
                )}
              />

              <View className="flex flex-row items-center justify-between w-full mt-4">
                <Text className="text-lg font-psemibold text-white">
                  Unit Information
                </Text>
                <TouchableOpacity
                  className="py-2"
                  onPress={() => setUnitModalVisible(true)}
                >
                  <Text className="text-primary font-pregular">+ Add Unit</Text>
                </TouchableOpacity>
              </View>

              <Controller
                control={control}
                name="quantity"
                render={({ field: { value, onChange } }) => (
                  <FormField
                    title="Quantity"
                    placeholder="e.g. 1"
                    value={value}
                    type="number"
                    handleChangeText={onChange}
                    error={errors.quantity?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="product.unit_id"
                render={({ field: { value, onChange } }) => (
                  <PickerField
                    title="Unit"
                    value={value?.toString()}
                    placeholder="Select Unit"
                    options={
                      unit?.map((unit) => ({
                        label: unit.name,
                        value: unit.id.toString(),
                      })) || []
                    }
                    onSelect={onChange}
                  />
                )}
              />
            </View>
            <View className="flex-row items-center justify-between bg-gray p-4 rounded-2xl mt-4">
              <Text className="text-white font-pregular">Availability</Text>
              <Controller
                control={control}
                name="availability"
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

            <View className="flex flex-row items-center justify-between w-full mt-4">
              <Text className="text-lg font-psemibold text-white">
                Product Attributes
              </Text>
              <TouchableOpacity
                className="py-2"
                onPress={() => append({ key: "", value: "" })}
              >
                <Text className="text-primary font-pregular">
                  + Add Attribures
                </Text>
              </TouchableOpacity>
            </View>

            {fields.map((field, index) => (
              <View key={field.id} className=" mb-4">
                <View key={field.id} className="flex-row items-center gap-2">
                  <Controller
                    control={control}
                    name={`product.attributes.${index}.key`}
                    render={({ field: { value, onChange } }) => (
                      <FormField
                        title="Key"
                        placeholder="Key"
                        value={value}
                        handleChangeText={onChange}
                        otherStyles="flex-1"
                        error={
                          errors.product?.attributes?.[index]?.key?.message
                        }
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`product.attributes.${index}.value`}
                    render={({ field: { value, onChange } }) => (
                      <FormField
                        title="Value"
                        placeholder="Value"
                        value={value}
                        handleChangeText={onChange}
                        otherStyles="flex-1"
                        error={
                          errors.product?.attributes?.[index]?.value?.message
                        }
                      />
                    )}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => remove(index)}
                  className="rounded-xl"
                >
                  <Text className="text-red-500 font-pregular">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            {errors.product?.attributes && (
              <View className="mt-2">
                {Object.entries(errors.product?.attributes).map(
                  ([key, err]: any) =>
                    typeof err?.message === "string" ? (
                      <Text key={key} className="text-red-500 text-xs mt-1">
                        {err.message}
                      </Text>
                    ) : null
                )}
              </View>
            )}

            {errors.product && (
              <View className="mt-2">
                {Object.entries(errors.product).map(([key, err]: any) =>
                  typeof err?.message === "string" ? (
                    <Text key={key} className="text-red-500 text-xs mt-1">
                      {err.message}
                    </Text>
                  ) : null
                )}
              </View>
            )}

            <TouchableOpacity
              // onPress={handleAddItem}
              className="mt-4 bg-primary rounded-xl py-3 items-center"
            >
              <Text className="text-white font-pmedium">Add Item</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Submit */}
      <View className="p-4">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit, (formErrors) => {
            console.log("❌ Validation Errors:", formErrors);
            Alert.alert("Validation Failed", "Check console for details");
          })}
          className="bg-green-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-pbold text-base">Submit Form</Text>
        </TouchableOpacity>
      </View>

      {categoryModalVisible && (
        <CreateCategoryModal
          visible={categoryModalVisible}
          setVisible={setCategoryModalVisible}
          onCategoryCreated={(newCategory) => {
            refetchCategories();
            setValue("product.category_id", newCategory.id.toString());
          }}
        />
      )}

      {unitModalVisible && (
        <CreateUnitModal
          visible={unitModalVisible}
          setVisible={setUnitModalVisible}
          onUnitCreated={(newUnit) => {
            refetchUnits();
            setValue("product.unit_id", newUnit.id.toString());
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ItemForm;
