import * as React from "react"
import { View, ViewStyle, Text, Button, TextStyle, SafeAreaView, StatusBar } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import { color } from "../../theme"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  justifyContent: "center",
  backgroundColor: color.palette.orange,
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}

export interface HomeScreenProps extends NavigationScreenProps<{}> { }

export class HomeScreen extends React.Component<HomeScreenProps, {}> {
  backScreen = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={[FULL, CONTAINER]}>
          <Text style={TITLE}>{__i18n("Home")}</Text>
          <Button
            title="go back"
            onPress={this.backScreen}
          />
          <Button
            title="go loading"
            onPress={() => this.props.navigation.navigate("loading")}
          />
        </SafeAreaView>
      </View>
    )
  }
}
