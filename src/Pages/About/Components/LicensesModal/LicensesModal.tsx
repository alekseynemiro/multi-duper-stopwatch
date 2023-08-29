import React from "react";
import { Linking, Modal, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Link } from "@components/Link";
import { useLocalizationService } from "@config";
import { LicensesModalProps } from "./LicensesModalProps";
import { licensesModalStyles } from "./LicensesModalStyles";

type PackageType = {

  name: string;

  url?: string;

  license: string;

  licenseUrl: string;

};

export function LicensesModal({ onClose }: LicensesModalProps): JSX.Element {
  const localization = useLocalizationService();
  const utmSource = "ru.nemiro.apps.multiduperstopwatch";

  const openUrl = (url: string): { (): void } => {
    return (): void => {
      Linking.openURL(url);
    };
  };

  const packages: Array<PackageType> = [
    {
      name: "React Native",
      url: "https://reactnative.dev/",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/facebook/react-native/2ae163a7e8f56861ba081ed3909d4a1d890930f1/LICENSE",
    },
    {
      name: "React Native Navigation",
      url: "https://reactnavigation.org/",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/react-navigation/react-navigation/22bdd8e62289b373e9ffcfbf8879ae61a9c1b09d/packages/native/LICENSE",
    },
    {
      name: "InversifyJS",
      url: "https://inversify.io/",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/inversify/InversifyJS/b07fdce88e64085d05dba4207c402f4eb7d3f738/LICENSE",
    },
    {
      name: "Formik",
      url: "https://formik.org/",
      license: "Apache 2.0",
      licenseUrl: "https://raw.githubusercontent.com/jaredpalmer/formik/a9dee79f3138d17cb72e7bc905691dab143b6af8/LICENSE",
    },
    {
      name: "TypeORM",
      url: "https://typeorm.io/",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/typeorm/typeorm/52e5f7c3e275fad3f274e20570c7d6692855a640/LICENSE",
    },
    {
      name: "i18next",
      url: "https://www.i18next.com/",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/i18next/i18next/77f9a0fc5de078ff2d507896be1f1dc39a5238e4/LICENSE",
    },
    {
      name: "React Native Gesture Handler",
      url: "https://docs.swmansion.com/react-native-gesture-handler/",
      license: "MIT",
      licenseUrl: "https://github.com/software-mansion/react-native-gesture-handler/blob/e249dbd8e8c274bc9cf0c2f14ec2da728f99461a/LICENSE",
    },
    {
      name: "React Native Reanimated",
      url: "https://docs.swmansion.com/react-native-reanimated/",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/software-mansion/react-native-reanimated/221ce7de5a43aaf0db3fa4de560166a3e28b60cd/LICENSE",
    },
    {
      name: "React Native Screens",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/software-mansion/react-native-screens/69de6027f02685c0ca80322d6b43cd0aa2e0f7a9/LICENSE",
    },
    {
      name: "React Native Reanimated Carousel",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/dohooo/react-native-reanimated-carousel/72f2e9407e2518837d8892f2ae0ec1af2a1e0b3d/LICENSE",
    },
    {
      name: "React Native Vector Icons",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/oblador/react-native-vector-icons/1453dcba99e48c460dec860c0242136efb66a5eb/LICENSE",
    },
    {
      name: "fluentvalidation-ts",
      license: "Apache 2.0",
      licenseUrl: "https://raw.githubusercontent.com/AlexJPotter/fluentvalidation-ts/9211f43667a5657c7a6af38526c776852a1a0f3e/License.txt",
    },
    {
      name: "React Native Device Info",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/react-native-device-info/react-native-device-info/f4226480e950e8f1882ee97233f9a08986f6645e/LICENSE",
    },
    {
      name: "React Native Draggable FlatList",
      license: "MIT",
      licenseUrl: "https://github.com/computerjazz/react-native-draggable-flatlist/blob/fb21592f37a22bc6c72ae8c392a52e835c7abc38/LICENSE.txt",
    },
    {
      name: "react-native-safe-area-context",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/th3rdwave/react-native-safe-area-context/a21c1f7dd2d1c74fbd862564c2364957a0847041/LICENSE",
    },
    {
      name: "react-native-sqlite-storage",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/andpor/react-native-sqlite-storage/883504c4ac34aa3e1662cc53133f325bbbd15dd9/LICENSE",
    },
    {
      name: "react-native-uuid",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/eugenehp/react-native-uuid/f95045013a7504cc0a5e37f0744aa5d59261f6c7/LICENSE",
    },
    {
      name: "Metadata Reflection API",
      license: "Apache 2.0",
      licenseUrl: "https://raw.githubusercontent.com/rbuckton/reflect-metadata/1a07d3346d48ffbc77927c70245740debe09eb13/LICENSE",
    },
    {
      name: "React Native Picker",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/react-native-picker/picker/59fc631e6d1e94b8c7ca3516a6e7495c3a23afa0/LICENSE",
    },
    {
      name: "React Native CheckBox",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/react-native-checkbox/react-native-checkbox/81e3550367ef6e067436827748fc6c31a0b01de0/LICENSE",
    },
    {
      name: "React Native Async Storage",
      license: "MIT",
      licenseUrl: "https://raw.githubusercontent.com/react-native-async-storage/async-storage/044a2aae03292011397f3461b9bd7c55c43897e1/LICENSE",
    },
    {
      name: "SQLite3 bindings for Node.js",
      license: "BSD",
      licenseUrl: "https://raw.githubusercontent.com/TryGhost/node-sqlite3/d8691e27976991a3e06db7a3632132848d89432e/LICENSE",
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
    >
      <View style={licensesModalStyles.centeredView}>
        <View style={licensesModalStyles.modalView}>
          <View style={licensesModalStyles.row}>
            <View style={licensesModalStyles.textCol}>
              <Text>
                {localization.get("about.licensesModal.license")}
              </Text>
            </View>
            <View style={licensesModalStyles.buttonCol}>
              <Button
                variant="light"
                title={localization.get("about.licensesModal.showLicense")}
                onPress={openUrl(`https://raw.githubusercontent.com/alekseynemiro/multi-duper-stopwatch/master/LICENSE?utm_source=${utmSource}`)}
              />
            </View>
          </View>
          <HorizontalLine />
          <View style={licensesModalStyles.row}>
            <View style={licensesModalStyles.textCol}>
              <Text>
                {localization.get("about.licensesModal.thirdParty")}
              </Text>
            </View>
          </View>
          <HorizontalLine />
          <ScrollView>
            {
              packages.map(
                (x: PackageType): JSX.Element => {
                  return (
                    <View
                      key={x.name}
                      style={licensesModalStyles.row}
                    >
                      <View style={licensesModalStyles.textCol}>
                        <Text>
                          {x.name}
                        </Text>
                        {
                          x.url
                          && (
                            <Link
                              text={x.url!}
                              url={x.url!}
                              style={licensesModalStyles.url}
                            />
                          )
                        }
                      </View>
                      <View style={licensesModalStyles.buttonCol}>
                        <Button
                          variant="light"
                          title={x.license}
                          onPress={openUrl(x.licenseUrl)}
                        />
                      </View>
                    </View>
                  );
                }
              )
            }
          </ScrollView>
          <HorizontalLine />
          <View style={licensesModalStyles.row}>
            <View style={licensesModalStyles.textCol}>
              <Text style={licensesModalStyles.textSmall}>
                If you have any questions, please feel free to contact:
              </Text>
              <Link
                text={["aleksey.nemiro", "gmail.com"].join("@")}
                url={"mailto:" + ["aleksey.nemiro", "gmail.com"].join("@") + "?Subject=Multi-duper%20Stopwatch"}
                style={licensesModalStyles.textSmall}
              />
            </View>
          </View>
          <HorizontalLine />
          <View
            style={licensesModalStyles.footer}
          >
            <Button
              variant="primary"
              title={localization.get("projectEditor.activityNameModal.ok")}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
