import images from "@/constants/images";
import { router, usePathname } from "expo-router";
import {
  Calendar,
  ChevronDown,
  Ellipsis,
  SlidersHorizontal,
  Truck,
  Warehouse,
} from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
const tabs = ["dashboard", "items", "warehouse", "suppliers"] as const;

const tabRoutes = {
  dashboard: "/inventory/dashboard",
  items: "/inventory/items",
  warehouse: "/inventory/warehouse",
  suppliers: "/inventory/suppliers",
} as const;

const InventoryHeader = () => {
  const pathname = usePathname();
  const activeTab = (() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === "inventory")
      return "dashboard";
    return segments[segments.length - 1];
  })();
  return (
    <View className="pb-4">
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
    </View>
  );
};

export default InventoryHeader;
