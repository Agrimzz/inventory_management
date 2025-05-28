import CustomButton from "@/components/form/CustomButton";
import FormField from "@/components/form/FormField";
import images from "@/constants/images";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    return true;
  };
  const handleSubmit = () => {
    // if (!validateForm()) return;

    router.push("/dashboard");
  };
  return (
    <SafeAreaView className="bg-background h-full flex items-center justify-center relative">
      <View className="p-4 w-full flex flex-col items-center gap-8">
        <View className="flex flex-col gap-4">
          <Image source={images.logo1} className="w-32 h-32 m-auto" />
          <Text className="text-4xl font-pbold text-white">Sign In</Text>
        </View>

        <View className="w-full flex flex-col gap-4">
          <FormField
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            handleChangeText={(value: string) => updateField("email", value)}
          />
          <FormField
            title="Password"
            placeholder="******"
            value={form.password}
            handleChangeText={(value: string) => updateField("password", value)}
          />
          <CustomButton title="Sign In" handlePress={handleSubmit} />
        </View>
      </View>

      <Text className="text-lightgray text-center mb-4 font-pthin absolute bottom-4 w-full">
        For the people by the people
      </Text>
    </SafeAreaView>
  );
};

export default Login;
