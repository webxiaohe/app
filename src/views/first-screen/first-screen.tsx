import * as React from "react"
import { TouchableOpacity, Text, Dimensions, View, Image, ImageStyle, ViewStyle, SafeAreaView, StatusBar, TextStyle } from "react-native"
import { Button, WhiteSpace } from "antd-mobile-rn"
import { NavigationScreenProps } from "react-navigation"
import LinearGradient from "react-native-linear-gradient"

import { color, spacing } from "../../theme"

const height = Dimensions.get("window").height
const width = Dimensions.get("window").width
const FULL: ViewStyle = { flex: 1, backgroundColor: "rgb(71, 99, 254)" }
const CONTAINER: ViewStyle = {
  width: width,
  overflow: "hidden",
  backgroundColor: "rgb(71, 106, 243)",
}

const CONTAINER_VIEW: ViewStyle = {
  height: height - 300,
  paddingLeft: spacing[4],
  paddingRight: spacing[4],
}

const LOGO_VIEW: ViewStyle = {
  height: 300,
  justifyContent: "center",
  alignItems: "center",
}

const LOGO: ImageStyle = {
  width: 100,
  height: 100,
}

const STAR: ImageStyle = {
  position: "absolute",
  zIndex: -1,
  top: 120,
}

const BG_LINE: ImageStyle = {
  position: "absolute",
  zIndex: -1,
  top: 0,
  left: 60,
  width,
  height: height - 300,
}

const GHOST_BUTTON: ViewStyle = {
  borderColor: color.palette.white,
  borderWidth: 1,
  borderRadius: 5,
  height: 47,
  alignItems: "center",
  justifyContent: "center",
}

const GHOST_BUTTON_TEXT: TextStyle = {
  fontSize: 18,
  color: color.palette.white,
}

export interface FirstScreenProps extends NavigationScreenProps<{}> { }

export class FirstScreen extends React.Component<FirstScreenProps, {}> {
  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(82, 119, 245)" />
        <SafeAreaView style={FULL}>
          <LinearGradient colors={["rgb(71, 99, 254)", "rgb(82, 119, 245)"]} style={[FULL, CONTAINER]}>
            <Image style={STAR}
              source={require("../../assets/first_bg_star.png")}
            />
            <View style={LOGO_VIEW}>
              <Image style={LOGO}
                source={require("../../assets/ic_launcher.png")}
              />
            </View>
            <View style={CONTAINER_VIEW}>
              <Image style={BG_LINE}
                source={require("../../assets/first_bg.png")}
              />
              <WhiteSpace size={"xl"} />
              <WhiteSpace size={"xl"} />
              <Button onClick={() => this.props.navigation.navigate("register")}>{__i18n("创建新账户")}</Button>
              <WhiteSpace size={"xl"} />
              <TouchableOpacity style={GHOST_BUTTON} onPress={() => this.props.navigation.navigate("entry")}>
                <Text style={GHOST_BUTTON_TEXT}>{__i18n("导入账户")}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </View>
    )
  }
}
