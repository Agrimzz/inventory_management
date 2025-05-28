import * as ImagePicker from "expo-image-picker";

export async function pickImages() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.fileName || `image_${Date.now()}.jpg`,
      type: asset.type || "image/jpeg",
    }));
  }

  return [];
}
