import React, { useRef } from "react";
import { Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const PAGE_WIDTH = Dimensions.get("window").width;

interface CarouselContainerProps<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
}

function CarouselContainer<T>({ data, renderItem }: CarouselContainerProps<T>) {
  const ref = useRef<ICarouselInstance>(null);

  return (
    <>
      {/* TODO: Fix writing value during component render warning  */}
      <Carousel
        ref={ref}
        autoPlay
        autoPlayInterval={5000}
        data={data}
        width={PAGE_WIDTH}
        height={300}
        loop
        pagingEnabled
        snapEnabled
        mode="vertical-stack"
        modeConfig={{
          snapDirection: "left",
          stackInterval: 16,
          scaleInterval: 0.07,
        }}
        customConfig={() => ({ type: "positive" })}
        renderItem={({ item }) => renderItem({ item })}
      />
    </>
  );
}

export default CarouselContainer;
