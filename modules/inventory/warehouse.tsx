import AddButton from "@/components/AddButton";
import { CarouselCard } from "@/components/ui/CarouselCard";
import CarouselContainer from "@/components/ui/CarouselContainer";
import { useFetch } from "@/hooks/useFetch";
import { WarehouseWithIdSchema } from "@/validation/warehouseSchema";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Text, View } from "react-native";

export default function WarehouseModule() {
  const { data, loading, error, refetch } =
    useFetch<WarehouseWithIdSchema[]>("/warehouses/");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Transform raw API data into shape CarouselCard expects
  const transformedData = (data || []).map((warehouse) => {
    const firstImage =
      Array.isArray(warehouse.images) && warehouse.images.length > 0
        ? warehouse.images[0]?.uri ||
          warehouse.images[0]?.url ||
          warehouse.images[0].upload
        : null;

    const resolvedImageUri =
      firstImage && typeof firstImage === "string"
        ? { uri: firstImage.replace("localhost", "192.168.101.10:8000") }
        : undefined;
    return {
      id: warehouse.id?.toString() ?? warehouse.code,
      title: warehouse.name,
      location: `${warehouse.address_line1}, ${warehouse.city}`,
      image: resolvedImageUri,
    };
  });

  const renderContent = () => {
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
    if (!data || data.length === 0)
      return (
        <Text className="text-center mt-10 text-gray-400">
          No warehouses found.
        </Text>
      );

    return (
      <CarouselContainer
        data={transformedData}
        renderItem={({ item }) => <CarouselCard item={item} />}
      />
    );
  };

  return (
    <View className="flex-1 bg-background justify-end py-2">
      {renderContent()}
      <AddButton onPress={() => router.push("/form/warehouse")} />
    </View>
  );
}
