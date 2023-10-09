import React, { useEffect, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, View } from "react-native";
import { DurationFormatter } from "@components/DurationFormatter";
import { getTimeSpan } from "@utils/TimeUtils";
import { SplitBarProps } from "./SplitBarProps";
import { splitModalStyles } from "./SplitModalStyles";

export function SplitBar(props: SplitBarProps): JSX.Element {
  const {
    split,
    value,
    onSelect,
  } = props;

  const [maxWidth, setMaxWidth] = useState(0);
  const [x, setX] = useState(0);

  useEffect(
    (): void => {
      setX((split * maxWidth) / value);
    },
    [
      split,
      maxWidth,
      value,
    ]
  );

  return (
    <>
      <View
        style={splitModalStyles.splitBar}
        onTouchStart={(e: GestureResponderEvent): void => {
          setX(e.nativeEvent.locationX);
        }}
        onTouchEnd={(): void => {
          const part = (x * value) / maxWidth;

          onSelect([part, value - part]);
        }}
        onTouchMove={(e: GestureResponderEvent): void => {
          if (e.nativeEvent.locationX <= maxWidth) {
            setX(e.nativeEvent.locationX);
          }
        }}
        onLayout={(e: LayoutChangeEvent): void => {
          setMaxWidth(e.nativeEvent.layout.width);
          setX((split * e.nativeEvent.layout.width) / value);
        }}
      >
        <View
          style={[
            splitModalStyles.splitBarSelected,
            {
              width: x,
            },
          ]}
        />
      </View>
      {
        maxWidth > 0
        && (
          <View
            style={splitModalStyles.splitBarParts}
          >
            <DurationFormatter
              value={getTimeSpan((x * value) / maxWidth)}
            />
            <DurationFormatter
              value={getTimeSpan(value - ((x * value) / maxWidth))}
            />
          </View>
        )
      }
    </>
  );
}
