import images from "@/constants/images";
import { router, Slot, usePathname } from "expo-router";
import { Ellipsis } from "lucide-react-native";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = ["dashboard", "items", "warehouse", "suppliers"] as const;

const tabRoutes = {
  dashboard: "/inventory/dashboard",
  items: "/inventory/items",
  warehouse: "/inventory/warehouse",
  suppliers: "/inventory/suppliers",
} as const;

const InventoryLayout = () => {
  const pathname = usePathname();
  const activeTab = (() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === "inventory")
      return "dashboard";
    return segments[segments.length - 1];
  })();

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="flex flex-col gap-8 w-full">
        {/* Header */}
        <View className="w-full flex flex-row items-center justify-between p-4">
          <Image source={images.logo1} className="w-14 h-14 rounded-full" />
          <Text className="text-sm font-plight text-white">Inventory</Text>
          <View className="flex items-center justify-center bg-gray rounded-2xl w-14 h-14">
            <Ellipsis size={16} color="#F1F1F1" />
          </View>
        </View>

        {/* Tabs */}
        <FlatList
          data={tabs}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          horizontal
          className="px-4 mt-4"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(tabRoutes[item])}
              className="mr-8"
              disabled={activeTab === item}
            >
              <Text
                className={`font-pmedium text-4xl capitalize ${
                  activeTab === item ? "text-white" : "text-lightgray"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Slot for children routes */}
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default InventoryLayout;
