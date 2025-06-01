import { createCategory } from "@/services/category";
import {
  Category,
  categorySchema,
  CategoryWithId,
} from "@/validation/categorySchema";
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

const CreateCategoryModal = ({
  visible,
  setVisible,
  onCategoryCreated,
}: {
  visible: boolean;
  setVisible: Function;
  onCategoryCreated: (newCategory: CategoryWithId) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: Category) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    try {
      const result = await createCategory(formData);
      Alert.alert("Success", `Category "${result.name}" created!`);
      onCategoryCreated(result);
      setVisible(false);
    } catch (err: any) {
      console.error(err.response.data);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Could not save category"
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
            Add New Category
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Category Name"
                placeholder="e.g. Electronics"
                value={value}
                handleChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <FormField
                title="Description"
                placeholder="Enter category description"
                value={value ?? ""}
                handleChangeText={onChange}
                error={errors.description?.message}
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

export default CreateCategoryModal;
