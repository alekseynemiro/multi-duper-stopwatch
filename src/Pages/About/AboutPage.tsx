import React from "react";
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Link } from "@components/Link";
import { useLocalizationService } from "@config";
import AppIcon from "@images/AppIcon.png";
import { aboutPageStyles } from "./AboutPageStyles";

export function AboutPage(): JSX.Element {
  const localization = useLocalizationService();
  const utmSource = "ru.nemiro.apps.multiduperstopwatch";

  return (
    <ScrollView
      style={aboutPageStyles.container}
    >
      <View
        style={aboutPageStyles.version}
      >
        <Image
          source={AppIcon}
        />
        <Text>
          {DeviceInfo.getApplicationName()}
        </Text>
        <Text>
          v{DeviceInfo.getVersion() ?? "0"}
          {" "}
          ({localization.get("about.build")}: {DeviceInfo.getBuildNumber()})
        </Text>
      </View>
      <HorizontalLine />
      <View
        style={aboutPageStyles.author}
      >
        <Text>{localization.get("about.author")}</Text>
      </View>
      <View
        style={aboutPageStyles.social}
      >
        <TouchableOpacity
          style={aboutPageStyles.socialButton}
          onPress={(): void => {
            Linking.openURL(`https://aleksey.nemiro.ru?utm_source=${utmSource}`);
          }}
        >
          <Icon
            name="home-page"
            style={aboutPageStyles.socialButtonIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={aboutPageStyles.socialButton}
          onPress={(): void => {
            Linking.openURL(`https://vk.com/aleksey.nemiro?utm_source=${utmSource}`);
          }}
        >
          <Icon
            name="vk"
            style={aboutPageStyles.socialButtonIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={aboutPageStyles.socialButton}
          onPress={(): void => {
            Linking.openURL(`https://github.com/alekseynemiro?utm_source=${utmSource}`);
          }}
        >
          <Icon
            name="github"
            style={aboutPageStyles.socialButtonIcon}
          />
        </TouchableOpacity>
      </View>
      <HorizontalLine />
      <View
        style={aboutPageStyles.feedback}
      >
        <View
          style={aboutPageStyles.feedbackRow}
        >
          <Text>
            {localization.get("about.youCanHelp")}
          </Text>
        </View>
        <View
          style={aboutPageStyles.feedbackRow}
        >
          <Icon
            name="thumbs-up"
            style={aboutPageStyles.feedbackIcon}
          />
          <View
            style={aboutPageStyles.feedbackText}
          >
            <Link
              url="https://play.google.com/store/apps/details?id=ru.nemiro.apps.multiduperstopwatch&utm_source=app"
              text={localization.get("about.rateGooglePlay")}
            />
          </View>
        </View>
        <View
          style={aboutPageStyles.feedbackRow}
        >
          <Icon
            name="star"
            style={aboutPageStyles.feedbackIcon}
          />
          <View
            style={aboutPageStyles.feedbackText}
          >
            <Link
              url="https://github.com/alekseynemiro/multi-duper-stopwatch"
              text={localization.get("about.giveStartOnGitHub")}
            />
          </View>
        </View>
        <View
          style={aboutPageStyles.feedbackRow}
        >
          <Icon
            name="smile"
            style={aboutPageStyles.feedbackIcon}
          />
          <View
            style={aboutPageStyles.feedbackText}
          >
            <Text>
              {localization.get("about.tellYourFriends")}
            </Text>
          </View>
        </View>
        <View
          style={aboutPageStyles.feedbackRow}
        >
          <Icon
            name="comments"
            style={aboutPageStyles.feedbackIcon}
          />
          <View
            style={aboutPageStyles.feedbackText}
          >
            <Text>
              {localization.get("about.ifYouHaveIdeas")}
              {" "}
            </Text>
            <Link
              text={localization.get("about.tellTheAuthor")}
              url="https://github.com/alekseynemiro/multi-duper-stopwatch/issues/choose"
            />
            <Text>.</Text>
          </View>
        </View>
      </View>
      <HorizontalLine />
      <View
        style={aboutPageStyles.thanks}
      >
        <Text>
          {localization.get("about.thankYou")}
        </Text>
      </View>
    </ScrollView>
  );
}
