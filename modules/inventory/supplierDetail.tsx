import { useFetch } from "@/hooks/useFetch";
import api from "@/services/api";
import { SupplierWithIdSchema } from "@/validation/supplierSchema";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  Mail,
  MapPin,
  MoveLeft,
  Pen,
  Phone,
  Printer,
  Trash,
  User,
} from "lucide-react-native";
import React, { useCallback } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const SupplierDetail = () => {
  const { id } = useLocalSearchParams();
  const { data, loading, error, refetch } = useFetch<SupplierWithIdSchema>(
    `/suppliers/${id}/`,
    true
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
      const res = await api.delete(`/suppliers/${id}/`);
      router.back();
    } catch (err: any) {
      console.error("Warehouse deletion failed:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          err.message ||
          "Could not delete warehouse"
      );
    }
  };

  const supplierImages = data?.images || [];

  return (
    <SafeAreaView className="bg-background  flex-1 pb-4 relative">
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
            onPress={() =>
              router.push(`/form/edit/supplier/${data?.id}` as any)
            }
            className="w-14 h-14 bg-green-500 rounded-2xl items-center justify-center"
          >
            <Pen size={16} color="#F1F1F1" />
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete this warehouse?",
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
          colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]}
          className="absolute inset-0 w-full h-full z-10"
          pointerEvents="none"
        />
        {supplierImages.length > 1 ? (
          <Carousel
            loop
            width={430}
            height={500}
            snapEnabled
            pagingEnabled
            autoPlayInterval={5000}
            autoPlay
            data={supplierImages}
            style={{ width: "100%" }}
            renderItem={({ item }) => (
              <Image source={{ uri: item.upload }} className="w-full h-full" />
            )}
          />
        ) : supplierImages.length === 1 ? (
          <Image
            source={{ uri: supplierImages[0].upload }}
            className="w-full h-[500px]"
          />
        ) : (
          <View className="w-full h-[500px] bg-gray-300 items-center justify-center">
            <Text className="text-gray-600">No image available</Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 mt-64 w-full bg-gray rounded-3xl p-6 z-20">
        <View className="flex-row items-start justify-between">
          <View className="flex-col gap-1">
            <Text className="text-3xl font-pbold text-white">{data?.name}</Text>
            <View className="flex-row items-center gap-1">
              <MapPin color={"#F1F1F1"} size={18} />
              <Text className="text-base font-light text-lightgray">
                {[data?.address, data?.city, data?.state, data?.country]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </View>
          </View>
          <Text className="text-xl font-pmedium text-primary underline">
            #{data?.contract_number}
          </Text>
        </View>
        <View className="flex-col gap-2 mt-4">
          <Text className="text-xl font-pmedium text-white mt-4">
            Contact Details
          </Text>
          <View className="flex-row items-center gap-2">
            <User color={"#F1F1F1"} size={18} />
            <Text className="text-base font-light text-lightgray">
              {[data?.contact_person].filter(Boolean).join(", ")}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Mail color={"#F1F1F1"} size={18} />
            <Text className="text-base font-light text-lightgray">
              {data?.email}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Phone color={"#F1F1F1"} size={18} />
            <Text className="text-base font-light text-lightgray">
              {[data?.phone, data?.alt_phone].filter(Boolean).join(", ")}
            </Text>
          </View>
          {data?.fax ? (
            <View className="flex-row items-center gap-2">
              <Printer color={"#F1F1F1"} size={18} />
              <Text className="text-base font-light text-lightgray">
                {data.fax}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupplierDetail;
