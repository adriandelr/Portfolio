import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

import { useTheme } from "../hooks/useThemeContext";

import Icon from "react-native-vector-icons/FontAwesome5";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function TabSnippetsScreen() {
  const { colors } = useTheme();

  const SNIPPETS: any = [
    {
      title: "General",
      data: [
        {
          title: "Agile and Scrum",
          content:
            "Agile is a general approach to project management, whereas scrum is just one of the different ways to practice agile. Agile is a set of guiding principles and ideals, but it doesn't say how exactly those values should be implemented. Scrum is a framework that provides specific rules for getting things done.",
        },
      ],
    },
    {
      title: "HTML",
      data: [
        {
          title:
            "HTML5 Basics For Everyone Tired Of Reading About Deprecated Code",
          content: "Content...",
        },
      ],
    },
    {
      title: "JavaScript",
      data: [
        {
          title: "Variable Shadowing",
          content: "Content...",
        },
      ],
    },
    {
      title: "CSS",
      data: [
        {
          title: "Common Screen Resolution",
          content:
            "Website Dimensions: These Are The Most Common Screen Resolutions To Design For",
          link: "https://www.designrush.com/trends/website-dimensions",
        },
      ],
    },
    {
      title: "Hybrid Frameworks",
      data: [
        {
          title: "React",
          content: "Content...",
        },
        {
          title: "Ionic",
          content: "Content...",
        },
      ],
    },
  ];

  function Item({ snipItem }: any) {
    const [open, setOpen] = useState(false);

    const toggleAccordion = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpen(!open);
    };

    return (
      <TouchableOpacity
        style={[styles.item, !open && { height: 40 }]}
        onPress={toggleAccordion}
        activeOpacity={1}
      >
        <Text
          style={[styles.title, { paddingVertical: open ? 3 : 0 }]}
          numberOfLines={open ? 0 : 1}
        >
          {snipItem.title}
        </Text>
        <Icon
          name="chevron-left"
          style={{
            fontSize: 14,
            color: colors.error,
            position: "absolute",
            top: Platform.OS === "web" ? 13 : 12,
            right: Platform.OS === "web" ? 13 : 12,
            alignSelf: "flex-end",
            justifyContent: "center",
            transform: open ? [{ rotate: "-90deg" }] : [{ rotate: "0deg" }],
            opacity: open ? 0.7 : 0.9,
          }}
        />
        {open && (
          <View>
            <Text style={styles.content}>{snipItem.content}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 50,
    },
    section: {},
    header: {
      fontSize: 17,
      color: colors.error,
      marginTop: 40,
    },
    item: {
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingLeft: 7,
      paddingRight: 37,
      borderWidth: 1,
      borderColor: colors.snipBorder,
      marginTop: 17,
      overflow: "hidden",
      backgroundColor: colors.snipItemBackground,
    },
    title: {
      fontSize: Platform.OS === "web" ? 15 : 15,
      color: colors.textSnipTitle,
      fontWeight: Platform.OS === "web" ? "normal" : "300",
    },
    content: {
      fontSize: 14,
      color: colors.textSnipContent,
      paddingBottom: 3,
    },
  });

  return (
    <View style={styles.container}>
      <SectionList
        sections={SNIPPETS}
        keyExtractor={(item, index): any => String(index)}
        renderItem={({ item }) => <Item snipItem={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        style={styles.section}
      />
    </View>
  );
}
