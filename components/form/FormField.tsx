import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string | undefined;
  placeholder?: string;
  isNumeric?: boolean;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  isNumeric = false,
  handleChangeText,
  otherStyles = "",
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = title.toLowerCase().includes("password");

  return (
    <View className={`w-full space-y-1 bg-gray p-4 rounded-2xl ${otherStyles}`}>
      <Text className="text-lightgray font-pregular">{title}</Text>

      <View className="flex flex-row items-center justify-between">
        <TextInput
          className="placeholder:text-white/70 text-white p-0 font-pregular flex-1 py-2"
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          placeholderTextColor="#ccc"
          secureTextEntry={isPasswordField && !showPassword}
          keyboardType={isNumeric ? "numeric" : "default"}
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color="#F1F1F1" />
            ) : (
              <Eye size={20} color="#F1F1F1" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
};

export default FormField;
