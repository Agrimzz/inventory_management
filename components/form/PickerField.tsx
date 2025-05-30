import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Option {
  label: string | number;
  value: string;
}

interface PickerFieldProps {
  title: string;
  value: string | undefined;
  placeholder?: string;
  options: Option[];
  onSelect: (value: string) => void;
  otherStyles?: string;
  error?: string;
}

const PickerField: React.FC<PickerFieldProps> = ({
  title,
  value,
  placeholder = "Select an option",
  options,
  onSelect,
  otherStyles = "",
  error,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || "";

  return (
    <View className={`w-full space-y-1 bg-gray p-4 rounded-2xl ${otherStyles}`}>
      <Text className="text-lightgray font-pregular">{title}</Text>

      <TouchableOpacity className=" py-2" onPress={() => setModalVisible(true)}>
        <Text
          className={`text-white font-pregular ${!value ? "opacity-60" : ""}`}
        >
          {selectedLabel || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-sm">{error}</Text>}

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-center px-4"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-black p-4 rounded-t-2xl w-full  rounded-2xl">
            <Text className="text-white text-lg font-pbold mb-3">{title}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-white/10"
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-white text-base">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default PickerField;
