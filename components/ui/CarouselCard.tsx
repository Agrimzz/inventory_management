import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface CarouselCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    image?: { uri: string };
  };
}

export const CarouselCard: React.FC<CarouselCardProps> = ({ item }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      className="flex-1 items-center justify-center w-full p-6"
    >
      <View className="w-full h-56 rounded-3xl overflow-hidden shadow-lg">
        <ImageBackground
          source={item.image}
          className="w-full h-56 flex justify-end p-4"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute inset-0"
          />
          <Text className="text-sm font-plight text-lightgray mb-1">
            {item.location}
          </Text>
          <Text className="text-3xl font-pmedium text-white">{item.title}</Text>
        </ImageBackground>
      </View>
    </Animated.View>
  );
};
