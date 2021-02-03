import React, { useState, useRef, useCallback, memo } from "react";
import {
  Text,
  Image,
  Modal,
  StyleSheet,
  View,
  SectionList,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

import { PROJECTS } from "../constants/Projects";
import { useTheme } from "../hooks/useThemeContext";
import Linker from "../components/Linker";
import Loader from "../components/Loader";
import Styles from "../constants/Styles";
import Layout from "../constants/Layout";

import _ from "lodash";
import { ButtonGroup } from "react-native-elements";
import { Icon } from "react-native-elements";
import ReadMore from "react-native-read-more-text";
import { ScrollView } from "react-native-gesture-handler";
import Xcarousel from "../components/Xcarousel";

const TabProjectsScreen = () => {
  const { colors } = useTheme();
  const listRef: any = useRef<SectionList<any>>();

  const resumeURL =
    "https://drive.google.com/file/d/1MX6I97C9fx8CTzV5YQhRPwYdyAEjsyhm/view?usp=sharing";

  const [openDetail, setOpenDetail] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [projIndex, setProjIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [showButton, setShowButton] = useState(false);

  const viewDetail = (projSection: any, projItem: any) => {
    const sectionIndex = _.indexOf(PROJECTS, projSection);
    const projIndex = _.indexOf(PROJECTS[sectionIndex].data, projItem);
    setSelectedSection(projSection);
    setSelectedItem(projItem);
    setSectionIndex(sectionIndex);
    setProjIndex(projIndex);
    setOpenDetail(true);
  };

  const Carousel = (sectionId: any, itemId: any) => {
    return <Xcarousel sectionId={sectionIndex} itemId={projIndex} />;
  };

  const Item = useCallback(
    ({ projSection, projItem }: any) => {
      return (
        <ScrollView
          scrollEnabled={openDetail ? true : false}
          showsVerticalScrollIndicator={openDetail ? true : false}
          style={openDetail ? styles.detailContainer : styles.itemContainer}
        >
          <Text style={[Styles.novaFamily, styles.textTitle]}>
            {projItem.title}
          </Text>
          <Text style={[Styles.novaFamily, styles.textTime]}>
            {projItem.time}
          </Text>
          {!openDetail && (
            <TouchableWithoutFeedback
              onPress={() => {
                viewDetail(projSection, projItem);
              }}
            >
              <Image
                source={projItem.image}
                defaultSource={projItem.image}
                resizeMethod="scale"
                resizeMode="cover"
                style={{
                  width: "100%",
                  minHeight: Layout.isSmallDevice
                    ? Layout.isSmallerDevice
                      ? "100%"
                      : 270
                    : 420,
                  maxHeight: Layout.isSmallDevice
                    ? Layout.isSmallerDevice
                      ? "100%"
                      : Layout.window.width - 42
                    : 420,
                  aspectRatio: 1,
                  marginVertical: 7,
                  backgroundColor: colors.background,
                  opacity: 0.9,
                }}
              />
            </TouchableWithoutFeedback>
          )}
          {openDetail && (
            <View
              style={{
                height: Layout.window.width * 0.5,
                marginVertical: 7,
                opacity: 0.9,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: -10.5,
                  marginLeft: -10.5,
                  zIndex: 1,
                }}
              >
                <Loader />
              </View>
              <Carousel sectionId={sectionIndex} itemId={projIndex} />
            </View>
          )}
          <ReadMore
            numberOfLines={openDetail ? 0 : 1}
            renderTruncatedFooter={(handlePress: any) =>
              !openDetail && (
                <Text
                  style={[
                    Styles.novaFamily,
                    {
                      fontWeight: "700",
                      color: colors.textReadMore,
                      marginTop: 3,
                      marginBottom: 13,
                    },
                  ]}
                  onPress={
                    openDetail
                      ? handlePress
                      : () => {
                          setSelectedSection(projSection);
                          setSelectedItem(projItem);
                          setOpenDetail(true);
                        }
                  }
                >
                  {openDetail ? "Read more" : "View details"}
                </Text>
              )
            }
            renderRevealedFooter={(handlePress: any) => (
              <Text
                style={[
                  Styles.novaFamily,
                  {
                    color: colors.textReadMore,
                    marginTop: 3,
                    marginBottom: 13,
                  },
                ]}
                onPress={handlePress}
              >
                Show less
              </Text>
            )}
          >
            <Text style={[Styles.novaFamily, styles.textDesc]}>
              {projItem.description}
            </Text>
          </ReadMore>
          {openDetail && projItem.showResume && (
            <Linker url={resumeURL} text="View Resume" color={colors.link} />
          )}
          {openDetail && projItem.storeLink && (
            <Linker
              url={projItem.storeLink}
              text="Store Link"
              color={colors.link}
            />
          )}
          <Text style={[Styles.novaFamily, styles.textDate]}>
            {projItem.date}
          </Text>
        </ScrollView>
      );
    },
    [colors, openDetail]
  );

  const ItemList = useCallback(() => {
    return (
      <View style={styles.container}>
        <SectionList
          sections={PROJECTS}
          keyExtractor={(item): any => item}
          renderItem={({ item, section }) => (
            <Item projSection={section} projItem={item} />
          )}
          renderSectionHeader={({ section: { year } }) => (
            <Text style={[Styles.novaFamily, styles.textHeader]}>{year}</Text>
          )}
          ref={listRef}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          style={styles.sectionContainer}
          onScroll={handleScroll}
          scrollEventThrottle={Platform.OS === "web" ? 17 : 777}
        />
      </View>
    );
  }, []);

  const ItemDetail = useCallback(() => {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          hardwareAccelerated={true}
          presentationStyle="fullScreen"
          transparent={false}
          visible={openDetail}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                setOpenDetail(false);
              }, 300);
            }}
            style={{
              width: "100%",
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.backgroundClose,
            }}
          >
            <Text
              style={[
                Styles.novaFamily,
                {
                  fontSize: 14,
                  color: colors.text,
                  marginRight: 7,
                },
              ]}
            >
              {Platform.OS === "web"
                ? "Close detail view"
                : "Tap to close detail view"}
            </Text>
          </TouchableOpacity>
          <Item projSection={selectedSection} projItem={selectedItem} />
        </Modal>
      </View>
    );
  }, [colors, openDetail]);

  const YearGroup = () => {
    return (
      <View style={styles.buttonGroupContainer}>
        <ButtonGroup
          onPress={(selectedIndex: number) => {
            listRef.current?.scrollToLocation({
              itemIndex: 0,
              sectionIndex: selectedIndex,
              animated: true,
            });
          }}
          buttons={_.take(
            _.map(PROJECTS, "year"),
            Layout.isSmallDevice ? 4 : 5
          )}
          Component={TouchableOpacity}
          containerStyle={{
            height: "100%",
            backgroundColor: colors.backgroundYearGroup,
            borderColor: colors.borderYear,
            borderRadius: 0,
            marginVertical: 0,
            marginHorizontal: 0,
          }}
          buttonContainerStyle={{
            backgroundColor: colors.backgroundYearGroup,
          }}
          selectedButtonStyle={{
            backgroundColor: colors.backgroundYearGroup,
          }}
          textStyle={[
            Styles.novaFamily,
            {
              fontSize: Layout.isSmallDevice ? 14 : 15,
              color: colors.textYearGroup,
              backgroundColor: colors.backgroundYearGroup,
              fontWeight: "700",
            },
          ]}
          selectedTextStyle={{
            color: colors.textYearGroup,
            backgroundColor: colors.backgroundYearGroup,
          }}
          innerBorderStyle={{ width: 0, color: colors.backgroundYearGroup }}
        />
      </View>
    );
  };

  const scrollOffset = useRef(0);
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const layoutMeasurementHeight =
          event.nativeEvent.layoutMeasurement.height,
        contentOffsetY = event.nativeEvent.contentOffset.y,
        contentSizeHeight = event.nativeEvent.contentSize.height,
        offset = contentSizeHeight / 7,
        direction =
          contentOffsetY > 0 && contentOffsetY >= scrollOffset.current
            ? "down"
            : "up",
        isUp = direction === "up",
        isDown = direction === "down",
        isEnd =
          layoutMeasurementHeight + contentOffsetY >=
          contentSizeHeight - offset;
      if (isUp && contentOffsetY < offset) setShowButton(false);
      if (isDown && isEnd) setShowButton(true);
      scrollOffset.current = contentOffsetY;
    },
    [showButton]
  );

  const BackArrow = useCallback(() => {
    return (
      <View
        style={{
          position: "absolute",
          right: Platform.OS === "web" ? 49 : 19,
          bottom: Platform.OS === "web" ? 49 : 59,
        }}
      >
        {showButton && (
          <TouchableOpacity
            onPress={() => {
              listRef.current?.scrollToLocation({
                itemIndex: 0,
                sectionIndex: 0,
                animated: true,
              });
            }}
          >
            <Icon
              name="arrow-up"
              type="font-awesome-5"
              color={colors.backArrow}
              style={{
                width: 44,
                height: 44,
                fontSize: 33,
              }}
              reverse
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [showButton]);

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
    },
    sectionContainer: {
      paddingTop: Layout.isSmallDevice ? 21 : 73,
      paddingHorizontal: Layout.isSmallDevice
        ? 21
        : (Layout.window.width - 437) / 2,
    },
    itemContainer: {
      height: Layout.isSmallDevice ? (Platform.OS === "web" ? 473 : 573) : 703,
    },
    detailContainer: {
      width: "100%",
      height: "100%",
      paddingHorizontal: Layout.isSmallDevice
        ? 21
        : (Layout.window.width - 640) / 2,
      backgroundColor: colors.background,
    },
    modalContainer: {
      width: "100%",
      height: "100%",
      borderWidth: 0,
    },
    item: {
      height: Layout.isSmallDevice ? (Platform.OS === "web" ? 473 : 573) : 703,
    },
    textHeader: {
      display: "none",
      fontSize: 13,
      color: colors.error,
      textAlign: "right",
      paddingRight: 17,
    },
    textTitle: {
      fontSize: Layout.isSmallDevice ? 19 : 24,
      color: colors.text,
      fontWeight: "700",
      marginTop: 7,
    },
    textDesc: {
      fontSize: Platform.OS === "web" ? 14 : 15,
      color: colors.text,
      marginBottom: 7,
    },
    textTime: {
      fontSize: 13,
      color: colors.error,
    },
    textDate: {
      fontSize: 13,
      color: colors.textDate,
      paddingVertical: 14,
    },
    buttonGroupContainer: {
      width: Layout.isSmallDevice ? "100%" : "100%",
      height: Layout.isSmallDevice ? 30 : 30,
      alignSelf: "center",
      position: "absolute",
      top: !Layout.isSmallDevice ? 0 : "auto",
      bottom: Layout.isSmallDevice ? 0 : "auto",
    },
  });

  return (
    <View style={styles.container}>
      {openDetail && <ItemDetail />}
      <ItemList />
      {!openDetail && <YearGroup />}
      <BackArrow />
    </View>
  );
};

export default memo(TabProjectsScreen);
