import { useFetch } from "@/hooks/useFetch";
import api from "@/services/api";
import { ItemDetailSchema } from "@/validation/itemSchema";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Boxes, MoveLeft, Pen, Trash } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const ItemDetail = () => {
  const { id } = useLocalSearchParams();
  const { data, loading, error, refetch } = useFetch<ItemDetailSchema>(
    `/inventory/${id}/`,
    true
  );

  const [activeTab, setActiveTab] = useState<"item" | "batch" | "warehouse">(
    "item"
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading)
    return (
      <Text className="text-center mt-10 text-white animate-bounce">
        Loading...
      </Text>
    );

  if (error)
    return (
      <Text className="text-red-500 text-center mt-10">Error: {error}</Text>
    );

  const handleDelete = async () => {
    try {
      await api.delete(`/inventory/${id}/`);
      router.back();
    } catch (err: any) {
      console.error("Item deletion failed:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Could not delete item"
      );
    }
  };

  const itemImages = data?.product?.images || [];

  return (
    <SafeAreaView className="bg-background flex-1 pb-4 relative">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between p-4 z-20">
        <Pressable
          onPress={() => router.back()}
          className="w-14 h-14 bg-gray rounded-2xl items-center justify-center"
        >
          <MoveLeft size={16} color="#F1F1F1" />
        </Pressable>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.push(`/form/edit/item/${data?.id}` as any)}
            className="w-14 h-14 bg-green-500 rounded-2xl items-center justify-center"
          >
            <Pen size={16} color="#F1F1F1" />
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete this item?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDelete,
                  },
                ]
              )
            }
            className="w-14 h-14 bg-red-500 rounded-2xl items-center justify-center"
          >
            <Trash size={16} color="#F1F1F1" />
          </Pressable>
        </View>
      </View>

      <View className="absolute top-0 left-0 w-full">
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
          className="absolute inset-0 z-10"
          pointerEvents="none"
        />
        {itemImages.length > 1 ? (
          <Carousel
            loop
            width={430}
            height={500}
            snapEnabled
            pagingEnabled
            autoPlayInterval={5000}
            autoPlay
            data={itemImages}
            style={{ width: "100%" }}
            renderItem={({ item }) => (
              <Image source={{ uri: item.upload }} className="w-full h-full" />
            )}
          />
        ) : itemImages.length === 1 ? (
          <Image
            source={{ uri: itemImages[0].upload }}
            className="w-full h-[500px]"
          />
        ) : (
          <View className="w-full h-[500px] bg-gray-300 items-center justify-center">
            <Text className="text-gray-600">No image available</Text>
          </View>
        )}
      </View>

      <View className="flex-1 mt-64 w-full bg-gray rounded-3xl p-4">
        {/* Tab Buttons */}
        <View className="flex-row justify-around mb-4">
          <Pressable
            onPress={() => setActiveTab("item")}
            className={`py-2 px-4 rounded-full ${
              activeTab === "item" ? "bg-primary" : "bg-darkgray"
            }`}
          >
            <Text className="text-white">Item Info</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("batch")}
            className={`py-2 px-4 rounded-full ${
              activeTab === "batch" ? "bg-primary" : "bg-darkgray"
            }`}
          >
            <Text className="text-white">Batch Info</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("warehouse")}
            className={`py-2 px-4 rounded-full ${
              activeTab === "warehouse" ? "bg-primary" : "bg-darkgray"
            }`}
          >
            <Text className="text-white">Warehouse Info</Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        <ScrollView>
          {activeTab === "item" && (
            <>
              <View className="flex-row items-start justify-between mb-2">
                <View className="gap-1">
                  <Text className="text-3xl font-pbold text-white">
                    {data?.product?.name}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Boxes color={"#F1F1F1"} size={18} />
                    <Text className="text-base font-light text-lightgray">
                      Qty: {data?.quantity} {data?.product?.unit?.symbol}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl font-pmedium text-primary underline">
                  #{data?.id}
                </Text>
              </View>

              <View className="mt-4">
                <Text className="text-xl font-pmedium text-white mb-2">
                  Product Details
                </Text>
                <Text className="text-base text-lightgray">
                  SKU: {data?.product?.sku}
                </Text>
                <Text className="text-base text-lightgray">
                  Condition: {data?.product?.product_condition}
                </Text>
                <Text className="text-base text-lightgray">
                  Category: {data?.product?.category?.name}
                </Text>
                <Text className="text-base text-lightgray">
                  Unit: {data?.product?.unit?.name}
                </Text>
                <Text className="text-base text-lightgray">
                  Description: {data?.product?.description || "N/A"}
                </Text>
                <Text className="text-base text-lightgray">
                  Manufacture Date: {data?.product?.manufacture_date || "N/A"}
                </Text>
                <Text className="text-base text-lightgray">
                  Expiry Date: {data?.product?.expiry_date || "N/A"}
                </Text>
                <Text className="text-base text-lightgray">
                  Warranty: {data?.product?.warranty_period || "N/A"}
                </Text>
              </View>

              {data?.product?.attributes?.length > 0 && (
                <View className="mt-4">
                  <Text className="text-xl font-pmedium text-white mb-2">
                    Attributes
                  </Text>
                  {data.product.attributes.map((attr, idx) => (
                    <Text key={idx} className="text-base text-lightgray">
                      {attr.name}: {attr.value}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === "batch" && data?.batch && (
            <View className="mt-2">
              <Text className="text-xl font-pmedium text-white mb-2">
                Batch Info
              </Text>
              <Text className="text-base text-lightgray">
                Batch Name: {data.batch.batch_name}
              </Text>
              <Text className="text-base text-lightgray">
                Cause: {data.batch.cause || "N/A"}
              </Text>
              <Text className="text-base text-lightgray">
                Created At: {new Date(data.batch.created_at).toLocaleString()}
              </Text>
            </View>
          )}

          {activeTab === "warehouse" && data?.warehouse && (
            <View className="mt-2">
              <Text className="text-xl font-pmedium text-white mb-2">
                Warehouse Info
              </Text>
              <Text className="text-base text-lightgray">
                Name: {data.warehouse.name}
              </Text>
              <Text className="text-base text-lightgray">
                Location: {data.warehouse.address_line1}, {data.warehouse.city}
              </Text>
              <Text className="text-base text-lightgray">
                State: {data.warehouse.state}
              </Text>
              <Text className="text-base text-lightgray">
                Country: {data.warehouse.country}
              </Text>
              <Text className="text-base text-lightgray">
                Postal Code: {data.warehouse.postal_code}
              </Text>
              <Text className="text-base text-lightgray">
                Phone: {data.warehouse.phone}
              </Text>
              <Text className="text-base text-lightgray">
                Email: {data.warehouse.email}
              </Text>
              <Text className="text-base text-lightgray">
                Manager: {data.warehouse.manager_name}
              </Text>
              <Text className="text-base text-lightgray">
                Temperature Controlled:{" "}
                {data.warehouse.temperature_controlled ? "Yes" : "No"}
              </Text>
              <Text className="text-base text-lightgray">
                Fire Safety Certified:{" "}
                {data.warehouse.fire_safety_certified ? "Yes" : "No"}
              </Text>
              <Text className="text-base text-lightgray">
                Hazard Compatible:{" "}
                {data.warehouse.hazard_compatible ? "Yes" : "No"}
              </Text>
              <Text className="text-base text-lightgray">
                Current Storage: {data.warehouse.current_storage} /{" "}
                {data.warehouse.storage_capacity}
              </Text>
              <Text className="text-base text-lightgray">
                Min Threshold: {data.warehouse.min_threshold}
              </Text>
              <Text className="text-base text-lightgray">
                Max Threshold: {data.warehouse.max_threshold}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ItemDetail;
