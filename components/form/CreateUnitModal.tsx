import { createUnit } from "@/services/unit";
import { Unit, unitSchema, UnitWithId } from "@/validation/unitSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FormField from "./FormField";

const CreateUnitModal = ({
  visible,
  setVisible,
  onUnitCreated,
}: {
  visible: boolean;
  setVisible: Function;
  onUnitCreated: (newCategory: UnitWithId) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Unit>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: "",
      symbol: "",
    },
  });

  const onSubmit = async (data: Unit) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("symbol", data.symbol);
    try {
      const result = await createUnit(formData);
      Alert.alert("Success", `Unit "${result.name}" created!`);
      onUnitCreated(result);
      setVisible(false);
    } catch (err: any) {
      console.error(err.response.data);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Could not save unit"
      );
    } finally {
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        className="flex-1 bg-black/40"
        onPress={() => setVisible(false)}
      >
        <ScrollView className="absolute bottom-0 left-0 right-0 bg-black rounded-t-2xl p-4 max-h-[50%] ">
          <Text className="text-lg font-pmedium text-white mb-4">
            Add New Unit
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Unit Name"
                placeholder="e.g. Kilogram"
                value={value}
                handleChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="symbol"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="symbol"
                placeholder="e.g. kg"
                value={value}
                handleChangeText={onChange}
                error={errors.symbol?.message}
                otherStyles="mt-4"
              />
            )}
          />

          <View className="w-full flex-col gap-2 mt-4 ">
            <TouchableOpacity
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              className="p-4 bg-primary rounded-2xl w-full"
            >
              <Text className="text-white font-pregular text-center">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="mr-2 p-4 w-full border-white/10 rounded-2xl border-2"
            >
              <Text className="text-white font-pregular text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

export default CreateUnitModal;
