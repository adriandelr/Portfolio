import * as React from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "../hooks/useThemeContext";
import { Text, Image, colors as elementsColor } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function TabSnippetsScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
  });

  const elemStyles = {
    title: {
      color: colors.text,
    },
  };

  return (
    <View style={styles.container}>
      <Icon
        name="hard-hat"
        size={30}
        color={colors.text}
        style={{ marginTop: 50 }}
      />
      <Text h2 style={elemStyles.title}>
        Snippets
      </Text>
      <Text style={elemStyles.title}>In Progress</Text>
    </View>
  );
}
