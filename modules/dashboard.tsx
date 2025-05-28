import { useRouter } from "expo-router";
import { Menu, MoveUpRight, User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-background h-full">
      <View className="w-full bg-gray px-4 py-8 rounded-b-2xl">
        <View className="flex flex-row items-center justify-between">
          <Menu size={20} color="#F1F1F1" />
          <User size={20} color="#F1F1F1" />
        </View>
        <Text className="text-4xl font-pbold text-white mt-4">Dashboard</Text>
      </View>
      <View className="w-full flex flex-row flex-wrap gap-4 mt-4">
        <TouchableOpacity
          className="bg-gray px-4 py-8 rounded-2xl w-[48%]"
          onPress={() => router.push("/inventory/dashboard")}
        >
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">
                Inventory
              </Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray px-4 py-8 rounded-2xl w-[48%]">
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">Projects</Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray px-4 py-8 rounded-2xl w-[48%]">
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">
                Volunteers
              </Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray px-4 py-8 rounded-2xl w-[48%]">
          <View className="flex flex-row items-center justify-between">
            <View className="space-y-1">
              <Text className="text-lg text-white font-pregular">View</Text>
              <Text className="text-lg text-white font-pregular">Orders</Text>
            </View>
            <MoveUpRight size={20} color="#F1F1F1" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
