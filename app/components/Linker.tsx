import React, { useCallback } from "react";
import { Alert, Platform, View, Linking, TouchableOpacity } from "react-native";

import { useTheme } from "../hooks/useThemeContext";

import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function Linker({
  url,
  text,
  color,
  confirmText,
  cancelText,
  iconOnly,
}: any) {
  const { colors } = useTheme();

  const openLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      if (Platform.OS == "web") {
        window.open(url, "_blank");
      } else {
        await Linking.openURL(url);
      }
    } else {
      Alert.alert(`Invalid URL: ${url}`);
    }
  }, [url]);

  return (
    <View>
      {!!iconOnly && (
        <TouchableOpacity
          onPress={() => {
            if (confirmText && cancelText) {
              if (confirm(confirmText)) {
                openLink();
              } else {
                alert(cancelText);
              }
            } else {
              openLink();
            }
          }}
        >
          <Icon
            name={iconOnly}
            size={24}
            color={colors.primary}
            style={{
              alignSelf: "center",
              justifyContent: "flex-end",
              paddingVertical: 13,
            }}
          />
        </TouchableOpacity>
      )}
      {!iconOnly && (
        <Button
          onPress={() => {
            if (confirmText && cancelText) {
              if (confirm(confirmText)) {
                openLink();
              } else {
                alert(cancelText);
              }
            } else {
              openLink();
            }
          }}
          titleStyle={{
            fontSize: 13,
            color: colors.background,
            fontWeight: Platform.OS === "web" ? "normal" : "300",
          }}
          buttonStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: 170,
            height: 37,
            backgroundColor: colors.linkerButton,
            marginTop: 3,
            marginBottom: 7,
            borderWidth: 2,
            borderColor: "slategray",
            borderRadius: 1,
            paddingVertical: 7,
            paddingHorizontal: 13,
          }}
          title={text}
          type="solid"
        />
      )}
    </View>
  );
}