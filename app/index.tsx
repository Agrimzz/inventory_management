import images from "@/constants/images";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboard = () => {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 1000);

    return () => clearTimeout(timeout); // cleanup
  }, []);
  return (
    <SafeAreaView className="bg-background h-full">
      <Image source={images.logo1} className="w-48 h-48 m-auto" />
      <Text className="text-lightgray text-center font-pthin mb-4">
        For the people by the people
      </Text>
    </SafeAreaView>
  );
};

export default Onboard;
