import * as React from "react"
import { View, ViewStyle, Text, Button, TextStyle, SafeAreaView, StatusBar } from "react-native"
import { NavigationScreenProps, StackActions, NavigationActions } from "react-navigation"

import { color } from "../../theme"
import { load } from "../../lib/storage"

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

export interface LoadingScreenProps extends NavigationScreenProps<{}> { }

export class LoadingScreen extends React.Component<LoadingScreenProps, {}> {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    let routeName = "person"
    let wallet = await load("wallet")
    if (wallet) {
      routeName = "person"
    } else {
      const wallets = await load("wallets")
      if (wallets && wallets instanceof Array && wallets.length > 0) {
        routeName = "login"
        wallet = wallets[0]
      } else {
        routeName = "first"
      }
    }
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName, params: { wallet } }),
      ],
    })
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        {/* <SafeAreaView style={[FULL, CONTAINER]}>
          <View style={CONTAINER}>
            <Text style={TITLE}>{__i18n("Welcome to DDN")}</Text>
            <Button
              title="go home"
              onPress={() => this.props.navigation.navigate("home")}
            />
            <Button
              title="wallets"
              onPress={() => this.props.navigation.navigate("wallets")}
            />
            <Button
              title="go register"
              onPress={() => this.props.navigation.navigate("register")}
            />
            <Button
              title="go person"
              onPress={() => this.props.navigation.navigate("person")}
            />
            <Button
              title="go giro"
              onPress={() => this.props.navigation.navigate("giro")}
            />
            <Button
              title="go ewm"
              onPress={() => this.props.navigation.navigate("ewm")}
            />
            <Button
              title="go result"
              onPress={() => this.props.navigation.navigate("result")}
            />
            <Button
              title="go login"
              onPress={() => this.props.navigation.navigate("login")}
            />
            <Button
              title="go first"
              onPress={() => this.props.navigation.navigate("first")}
            />
            <Button
              title="二维码"
              onPress={() => this.props.navigation.navigate("qr")}
            />
          </View>
        </SafeAreaView> */}
      </View>
    )
  }
}
