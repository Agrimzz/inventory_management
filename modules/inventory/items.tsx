import AddButton from "@/components/AddButton";
import images from "@/constants/images";
import { useFetch } from "@/hooks/useFetch";
import { router, useFocusEffect } from "expo-router";
import {
  Calendar,
  ChevronDown,
  EllipsisVertical,
  SlidersHorizontal,
  Truck,
  Warehouse,
} from "lucide-react-native";
import React, { useCallback } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const ItemsModule = () => {
  const { data, loading, error, refetch } = useFetch<any[]>("/inventory/");

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

  return (
    <View className="relative flex-1">
      <View style={{ marginTop: 48 }}>
        <View className="">
          {/* Filter Heading */}
          <View className="flex flex-row items-center justify-between px-4">
            <Text className="font-pmedium text-xs text-white">
              Show based on
            </Text>
            <Text className="font-pmedium text-xs text-lightgray">
              Filters for Dashboard
            </Text>
          </View>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 px-4"
            contentContainerStyle={{ gap: 4 }}
          >
            {/* Settings */}
            <View className="bg-primary rounded-2xl justify-center items-center w-14 h-14">
              <SlidersHorizontal size={18} color="#F1F1F1" />
            </View>

            {[
              { Icon: Calendar, label: "Calendar", value: "All Time" },
              {
                Icon: Warehouse,
                label: "Warehouse",
                value: "Ranbari Warehouse",
              },
              {
                Icon: Truck,
                label: "Supplier",
                value: "Supplier 1",
                extra: true,
              },
            ].map(({ Icon, label, value, extra }) => (
              <View
                key={label}
                className={`flex-row items-center bg-white/10 rounded-2xl h-14 px-4 gap-2 ${
                  extra ? "mr-8" : ""
                }`}
              >
                <Icon size={18} color="#F1F1F1" />
                <Text className="text-xs font-plight text-lightgray">
                  {label}
                </Text>
                <Text className="text-xs font-plight text-white">{value}</Text>
                <ChevronDown size={18} color="#F1F1F1" />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <FlatList
        data={data}
        className="px-4 mt-4"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/inventory/item/${item.id}`)}>
            <View className="flex flex-row items-stretch justify-between p-4 bg-white/10 rounded-2xl mb-2">
              <View className="flex-1 flex flex-row gap-4 items-stretch">
                <Image
                  source={
                    item.product.images[0]?.upload
                      ? { uri: item.product.images[0].upload }
                      : images.logo1
                  }
                  className="w-24 h-24 rounded-2xl"
                />
                <View className="flex flex-col justify-between">
                  <View className="flex flex-col">
                    <Text className="text-xl font-pmedium text-white">
                      {item.product.name}
                    </Text>
                    <Text className="text-xs font-pmedium text-lightgray">
                      Qty: {item.quantity} {item.product.unit.symbol}
                    </Text>
                  </View>
                  <Text className="text-xs font-pmedium text-white">
                    {item.product.sku}
                  </Text>
                </View>
              </View>
              <EllipsisVertical size={20} color="#F1F1F1" />
            </View>
          </Pressable>
        )}
      />
      <AddButton onPress={() => router.push("/form/create/item")} />
    </View>
  );
};

export default ItemsModule;
