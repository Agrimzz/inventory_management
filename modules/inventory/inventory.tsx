import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  MoveUpRight,
  SlidersHorizontal,
  Truck,
  Warehouse,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const Inventory = () => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const CARD_SPACING = 8;
  const CARD_WIDTH = width / 2 - CARD_SPACING * 2.5;

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    const offset = clampedIndex * (CARD_WIDTH + CARD_SPACING);
    scrollRef.current?.scrollTo({ x: offset, animated: true });
    setCurrentIndex(clampedIndex);
  };

  const data = [
    { title: "items", num: 1300 },
    { title: "warehouses", num: 4 },
    { title: "suppliers", num: 24 },
    { title: "locations", num: 10 },
    { title: "dispatches", num: 55 },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ marginTop: 48 }}>
        <View className="">
          {/* Filter Heading */}
          <View className="flex flex-row items-center justify-between px-4">
            <Text className="font-pmedium text-xs text-white">
              Show based on
            </Text>
            <Text className="font-pmedium text-xs text-lightgray">
              Filters for Dashboard
            </Text>
          </View>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 px-4"
            contentContainerStyle={{ gap: 4 }}
          >
            {/* Settings */}
            <View className="bg-primary rounded-2xl justify-center items-center w-14 h-14">
              <SlidersHorizontal size={18} color="#F1F1F1" />
            </View>

            {[
              { Icon: Calendar, label: "Calendar", value: "All Time" },
              {
                Icon: Warehouse,
                label: "Warehouse",
                value: "Ranbari Warehouse",
              },
              {
                Icon: Truck,
                label: "Supplier",
                value: "Supplier 1",
                extra: true,
              },
            ].map(({ Icon, label, value, extra }) => (
              <View
                key={label}
                className={`flex-row items-center bg-white/10 rounded-2xl h-14 px-4 gap-2 ${
                  extra ? "mr-8" : ""
                }`}
              >
                <Icon size={18} color="#F1F1F1" />
                <Text className="text-xs font-plight text-lightgray">
                  {label}
                </Text>
                <Text className="text-xs font-plight text-white">{value}</Text>
                <ChevronDown size={18} color="#F1F1F1" />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View className="flex flex-col gap-1 px-4 mt-4">
        <View className="bg-white/10 w-full h-[250px] rounded-2xl"></View>
        {/* <View className=" bg-white/10 w-full h-[200px] rounded-2xl"></View> */}

        <View className="flex flex-col gap-4 mt-4">
          <View className="flex flex-row w-full justify-between items-center">
            <Text className="text-xs font-pmedium text-white">
              Quick Overview
            </Text>

            <View className="flex flex-row gap-2 items-center">
              <Pressable
                onPress={() => scrollToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="disabled:opacity-20"
              >
                <ArrowLeft size={16} color="#F1F1F1" />
              </Pressable>
              <Pressable
                onPress={() => scrollToIndex(currentIndex + 1)}
                disabled={currentIndex === data.length - 2}
                className="disabled:opacity-20"
              >
                <ArrowRight size={16} color="#F1F1F1" />
              </Pressable>
            </View>
          </View>

          {/* Scrollable Cards */}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            snapToAlignment="start"
            contentContainerStyle={{ gap: CARD_SPACING }}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
              setCurrentIndex(index);
            }}
          >
            {data.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  width: CARD_WIDTH,
                }}
                className={`${
                  item.title === "items" ? "bg-primary" : "bg-white/10"
                } p-4 flex flex-col gap-8 rounded-2xl`}
                onPress={() =>
                  router.push(("/inventory/" + item.title.toLowerCase()) as any)
                }
              >
                <View className="flex flex-row justify-between items-start">
                  <View className="flex-col">
                    <Text className="text-base font-pmedium text-white">
                      View
                    </Text>
                    <Text className="text-base font-pmedium text-white capitalize">
                      {item.title}
                    </Text>
                  </View>
                  <MoveUpRight size={20} color="#F1F1F1" />
                </View>

                <View className="flex-col">
                  <Text className="text-4xl font-pmedium text-white">
                    {item.num}
                  </Text>
                  <Text className="text-sm font-pmedium text-white/80 capitalize">
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default Inventory;
