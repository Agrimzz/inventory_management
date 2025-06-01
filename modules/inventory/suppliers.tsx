import AddButton from "@/components/AddButton";
import { CarouselCard } from "@/components/ui/CarouselCard";
import CarouselContainer from "@/components/ui/CarouselContainer";
import { useFetch } from "@/hooks/useFetch";
import { SupplierWithIdSchema } from "@/validation/supplierSchema";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Text, View } from "react-native";

const SupplierModule = () => {
  const { data, loading, error, refetch } =
    useFetch<SupplierWithIdSchema[]>("/suppliers/");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Transform raw API data into shape CarouselCard expects
  const transformedData = (data || []).map((supplier) => {
    const firstImage =
      Array.isArray(supplier.images) && supplier.images.length > 0
        ? supplier.images[0]?.uri ||
          supplier.images[0]?.url ||
          supplier.images[0].upload
        : null;

    const resolvedImageUri =
      firstImage && typeof firstImage === "string"
        ? { uri: firstImage.replace("localhost", "192.168.101.10:8000") }
        : undefined;
    return {
      id: supplier.id?.toString() ?? supplier.contract_number,
      title: supplier.name,
      location: `${supplier.city}`,
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
          No suppliers found.
        </Text>
      );

    return (
      <CarouselContainer
        data={transformedData}
        renderItem={({ item }) => <CarouselCard item={item} type="supplier" />}
      />
    );
  };

  return (
    <View className="flex-1 bg-background justify-end py-2">
      {renderContent()}
      <AddButton onPress={() => router.push("/form/create/supplier")} />
    </View>
  );
};

export default SupplierModule;
