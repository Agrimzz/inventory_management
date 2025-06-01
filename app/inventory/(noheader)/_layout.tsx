import { Stack } from "expo-router";
import React from "react";

const DetailsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="warehouse/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="item/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="supplier/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default DetailsLayout;
