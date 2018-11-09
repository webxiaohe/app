import * as React from "react"
import { TextInput, TouchableOpacity, Dimensions, View, ViewStyle, ImageStyle, Image, Text, TextStyle, SafeAreaView, StatusBar, Clipboard, BackHandler, ToastAndroid } from "react-native"
import { WhiteSpace, Toast } from "antd-mobile-rn"
import { NavigationScreenProps, StackActions, NavigationActions } from "react-navigation"
import LinearGradient from "react-native-linear-gradient"
import ddn from "ddn-js"

import { color, spacing } from "../../theme"
import { getRawSeed } from "../../lib/crypto"
import { save } from "../../lib/storage"
import ddnApi from "../../services/api/ddn-api"
import getStatusBarHeight from "../../lib/statusBar"
import { wallet } from "../../types"

const statusBarHeight = getStatusBarHeight(true)
const height = Dimensions.get("window").height
const width = Dimensions.get("window").width
const FULL: ViewStyle = { flex: 1, backgroundColor: "#4865FE" }
const CONTAINER: ViewStyle = {
  width: width,
  marginTop: statusBarHeight,
  backgroundColor: "#4865FE",
  overflow: "hidden",
}

const PERSON: ViewStyle = {
  height: 260,
  justifyContent: "center",
  alignItems: "center",
}

const SIRCLE_FLOAT: ViewStyle = {
  height: width * 4,
  width: width * 4,
  position: "absolute",
  top: -(width * 4 - 260 - 60),
  left: -width * 1.5,
  zIndex: -1,
  backgroundColor: "#6186F5",
  borderBottomLeftRadius: width * 2,
  borderBottomRightRadius: width * 2,
}

const SIRCLE: ViewStyle = {
  height: 60,
  width,
  zIndex: -2,
  backgroundColor: color.palette.white,
}

const CONTAINER_VIEW: ViewStyle = {
  height: height - 260,
  paddingLeft: spacing[4],
  paddingRight: spacing[4],
  paddingTop: 60,
  backgroundColor: color.palette.white,
}

const INPUTITEM = {
  height: 40,
  color: color.palette.black,
  borderBottomWidth: 1,
  borderBottomColor: color.palette.border,
  padding: 0,
}

const AVATAR: ImageStyle = {
  width: 80,
  height: 80,
  marginTop: 30,
}

const NAME: TextStyle = {
  color: color.palette.white,
  fontSize: 18,
}

const ADDRESS: TextStyle = {
  color: color.palette.white,
  fontSize: 16,
}

const BANLANCE: TextStyle = {
  color: color.palette.white,
  fontSize: 20,
  bottom: 0,
}

const GHOST_BUTTON: ViewStyle = {
  borderColor: color.palette.blueText,
  borderWidth: 1,
  borderRadius: 5,
  height: 47,
  alignItems: "center",
  justifyContent: "center",
}

const GHOST_BUTTON_TEXT: TextStyle = {
  fontSize: 18,
  color: color.palette.blueText,
}

const LOGIN_BUTTON = {
  borderRadius: 5,
}

const LOGIN_BUTTON_TOUCH: ViewStyle = {
  height: 47,
  alignItems: "center",
  justifyContent: "center",
}

const LOGIN_BUTTON_TEXT: TextStyle = {
  fontSize: 18,
  color: color.palette.white,
}
const PUBLICKEY: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "center",
}
const PUBLICKEYICON: ImageStyle = {
    width: 14,
    height: 17,
    marginLeft: 5,
}
interface state {
  password: string
  logining: boolean
  account: {
    balance: number;
  }
}

export interface LoginScreenProps extends NavigationScreenProps<{wallet: wallet}> { }

export class LoginScreen extends React.Component<LoginScreenProps, state> {
  componentDidMount = async () => {
    try {
      const { address } = this.props.navigation.getParam("wallet").curWallet
      const result = await ddnApi.getUser(address)
      if (result.kind === "ok") {
        this.setState({
          account: {
            balance: result.account.balance,
          },
        })
      } else if (result.kind === "error-result") {
        Toast.fail(result.response.error)
      } else {
        Toast.fail(result.kind)
      }
    } catch (e) {
      Toast.fail(e.message)
    } finally {
      BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid)
    }
  }
  onBackAndroid = () => {
    ToastAndroid.show(__i18n("退出应用"), ToastAndroid.SHORT)
    BackHandler.exitApp()
    return
  }
  componentWillUnmount = () => {
    this.removeEvent()
  }
  removeEvent = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid)
  }
  goWallets = () => {
    this.removeEvent()
    this.props.navigation.navigate("wallets")
  }
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      logining: false,
      account: {
        balance: 0,
      },
    }
  }

  login = async () => {
    this.setState({
      logining: true,
    })
    const password = this.state.password
    if (!password) {
      this.setState({
        logining: false,
      })
      return Toast.info(__i18n("密码不可以为空"), 1, null, false)
    }
    const wallet = this.props.navigation.getParam("wallet")
    const phaseSeed = wallet.curWallet.phaseSeed
    const address = wallet.curWallet.address
    let phaseKey = getRawSeed(phaseSeed, password)
    if (!ddn.crypto.isAddress(address)) {
      this.setState({
        logining: false,
      })
      return Toast.info(__i18n("钱包地址格式不正确"), 1, null, false)
    }
    if (!phaseKey) {
      this.setState({
        logining: false,
      })
      return Toast.fail(__i18n("密码错误"))
    }
    await save("wallet", wallet)
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "person", params: {} }),
      ],
    })
    this.removeEvent()
    this.props.navigation.dispatch(resetAction)
  }
   async _setClipboardContent (address) {
    try {
        Clipboard.setString(address)
        Toast.info(__i18n("复制地址成功"), 1, null, false)
    } catch (e) {
        Clipboard.setString(e.message)
    }
}
  render() {
    let { walletName, address, balance } = this.props.navigation.getParam("wallet").curWallet
    balance = typeof balance === "number" ?  balance : this.state.account.balance
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" backgroundColor="#4865FE" />
        <SafeAreaView style={[FULL, CONTAINER]}>
          <LinearGradient colors={["#4865FE", "#6186F5"]} style={PERSON}>
            <Image style={AVATAR}
              source={require("../../assets/avatar.png")}
            />
            <WhiteSpace />
            <Text style={NAME} numberOfLines={1}>{walletName}</Text>
            <WhiteSpace />
            <TouchableOpacity activeOpacity={1} style={PUBLICKEY} onPress={this._setClipboardContent.bind(this, address)}>
              <Text style={ADDRESS} numberOfLines={1}>{__i18n(address)}</Text>
              <Image source={require("../../images/icon/copy-icon.png")} style={PUBLICKEYICON} />
            </TouchableOpacity>
            <WhiteSpace />
            <Text style={BANLANCE}>{__i18n("余额")} <Text style={{ fontSize: 26 }}>{balance / 100000000}</Text> DDN</Text>
          </LinearGradient>
          <View style={SIRCLE_FLOAT}></View>
          <View style={SIRCLE}>
          </View>
          <View style={CONTAINER_VIEW}>
            <TextInput
              secureTextEntry={true}
              placeholder={__i18n("请输入交易密码")}
              style={INPUTITEM}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              underlineColorAndroid="transparent"
            />
            <WhiteSpace size={"xl"} />
            <WhiteSpace size={"xl"} />
            <LinearGradient colors={["#567CF0", "#4865FE"]} style={LOGIN_BUTTON}>
              <TouchableOpacity style={LOGIN_BUTTON_TOUCH} onPress={this.login}>
                <Text style={LOGIN_BUTTON_TEXT}>{__i18n("登录")}</Text>
              </TouchableOpacity>
            </LinearGradient>
            <WhiteSpace size={"xl"} />
            <TouchableOpacity style={GHOST_BUTTON} onPress={() => this.goWallets()}>
              <Text style={GHOST_BUTTON_TEXT}>{__i18n("其他账户")}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}