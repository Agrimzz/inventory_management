import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Text, View } from "react-native";
import FormField from "./FormField";

export const ItemsTab = () => {
  const { control } = useFormContext();

  const {
    fields: attributeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "product.product_attributes",
  });

  return (
    <View className="space-y-4 p-4">
      {/* Product Basic Info */}
      <Text className="text-xl font-bold">Product Details</Text>
      <FormField title="SKU" name="product.sku" control={control} />
      <FormField title="Name" name="product.name" control={control} />
      <FormField
        title="Description"
        name="product.description"
        control={control}
        multiline
      />

      {/* Product Category */}
      <Text className="text-lg font-semibold">Category</Text>
      <FormField
        title="Category ID"
        name="product.category_id"
        control={control}
      />
      <FormField
        title="Category Name"
        name="product.category.name"
        control={control}
      />
      <FormField
        title="Category Description"
        name="product.category.description"
        control={control}
      />
      <FormField
        title="Category Icon URL"
        name="product.category.icon_url"
        control={control}
      />

      {/* Unit Information */}
      <Text className="text-lg font-semibold">Unit</Text>
      <FormField title="Unit ID" name="product.unit_id" control={control} />
      <FormField
        title="Unit Symbol"
        name="product.unit.symbol"
        control={control}
      />
      <FormField title="Unit Name" name="product.unit.name" control={control} />

      {/* Manufacturing & Warranty */}
      <Text className="text-lg font-semibold">Manufacturing Info</Text>
      <FormField
        title="Manufacture Date"
        name="product.manufacture_date"
        control={control}
      />
      <FormField
        title="Expiry Date"
        name="product.expiry_date"
        control={control}
      />
      <FormField
        title="Serial Number"
        name="product.serial_number"
        control={control}
      />
      <FormField
        title="Condition"
        name="product.product_condition"
        control={control}
      />
      <FormField
        title="Warranty Period (months)"
        name="product.warranty_period"
        control={control}
        keyboardType="numeric"
      />

      {/* Product Attributes */}
      <Text className="text-lg font-semibold">Attributes</Text>
      {attributeFields.map((item, index) => (
        <View key={item.id} className="mb-2 border p-2 rounded-md">
          <FormField
            title="Key"
            name={`product.product_attributes.${index}.key`}
            control={control}
          />
          <FormField
            title="Value"
            name={`product.product_attributes.${index}.value`}
            control={control}
          />
          <Button
            title="Remove"
            onPress={() => remove(index)}
            color="#dc2626" // Tailwind's red-600
          />
        </View>
      ))}
      <Button
        title="Add Attribute"
        onPress={() => append({ key: "", value: "" })}
      />

      {/* Quantity & Availability */}
      <Text className="text-lg font-semibold">Stock Info</Text>
      <FormField
        title="Quantity"
        name="quantity"
        control={control}
        keyboardType="numeric"
      />
      <FormField
        title="Availability"
        name="availability"
        control={control}
        keyboardType="numeric"
      />

      {/* Image upload is skipped */}
    </View>
  );
};
