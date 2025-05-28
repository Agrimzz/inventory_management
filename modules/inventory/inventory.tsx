import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  MoveUpRight,
  SlidersHorizontal,
  Truck,
  Warehouse,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const Inventory = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
      <View className="flex flex-col gap-1 px-4 mt-4">
        <View className="bg-white/10 w-full h-[250px] rounded-2xl"></View>
        {/* <View className=" bg-white/10 w-full h-[200px] rounded-2xl"></View> */}

        <View className="flex flex-col gap-4 mt-4">
          <View className="flex flex-row w-full justify-between items-center">
            <Text className="text-xs font-pmedium text-white">
              Quick Overview
            </Text>

            <View className="flex flex-row gap-2 items-center">
              <ArrowLeft size={16} color="#F1F1F1" />
              <ArrowRight size={16} color="#F1F1F1" />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable className="bg-primary w-48 p-4 flex flex-col gap-8 rounded-2xl mr-2">
              <View className="flex flex-row justify-between items-start">
                <View className="flex-col">
                  <Text className="text-base font-pmedium text-white">
                    View
                  </Text>
                  <Text className="text-base font-pmedium text-white">
                    Items
                  </Text>
                </View>
                <MoveUpRight size={20} color="#F1F1F1" />
              </View>

              <View className="flex-col">
                <Text className="text-4xl font-pmedium text-white">1300</Text>
                <Text className="text-sm font-pmedium text-white/80">
                  Items
                </Text>
              </View>
            </Pressable>
            <Pressable className="bg-white/10 w-48 p-4 flex flex-col gap-8 rounded-2xl mr-2">
              <View className="flex flex-row justify-between items-start">
                <View className="flex-col">
                  <Text className="text-base font-pmedium text-white">
                    View
                  </Text>
                  <Text className="text-base font-pmedium text-white">
                    Items
                  </Text>
                </View>
                <MoveUpRight size={20} color="#F1F1F1" />
              </View>

              <View className="flex-col">
                <Text className="text-4xl font-pmedium text-white">1300</Text>
                <Text className="text-sm font-pmedium text-white/80">
                  Items
                </Text>
              </View>
            </Pressable>
            <Pressable className="bg-white/10 w-48 p-4 flex flex-col gap-8 rounded-2xl mr-2">
              <View className="flex flex-row justify-between items-start">
                <View className="flex-col">
                  <Text className="text-base font-pmedium text-white">
                    View
                  </Text>
                  <Text className="text-base font-pmedium text-white">
                    Items
                  </Text>
                </View>
                <MoveUpRight size={20} color="#F1F1F1" />
              </View>

              <View className="flex-col">
                <Text className="text-4xl font-pmedium text-white">1300</Text>
                <Text className="text-sm font-pmedium text-white/80">
                  Items
                </Text>
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default Inventory;
