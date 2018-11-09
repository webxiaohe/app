import * as React from "react"
import { View, Platform, ViewStyle, ScrollViewStyle, ScrollView, TextInput, Text, TextStyle, SafeAreaView, StatusBar } from "react-native"
import { NavigationScreenProps, StackActions, NavigationActions } from "react-navigation"
import { Button, WhiteSpace, Toast } from "antd-mobile-rn"
import ddn from "ddn-js"

import { color } from "../../theme"
import { validateMnemonic, encryption } from "../../lib/crypto"
import { save, load } from "../../lib/storage"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  justifyContent: "center",
  backgroundColor: color.palette.white,
}

const INPUTLABEL: TextStyle = {
  fontSize: 16,
  marginBottom: 10,
  marginTop: 20,
  color: color.palette.inputLabel,
}

const INPUTITEM = {
  height: 40,
  color: color.palette.black,
  borderBottomWidth: 1,
  borderBottomColor: color.palette.border,
  padding: 0,
}

const CONTAINER_SCROLL: ScrollViewStyle = {
  flex: 1,
  padding: 20,
  paddingTop: 0,
  backgroundColor: color.palette.backgroundColor,
}

const MNEMONICINPUT = {
  height: 120,
  marginTop: 20,
  marginBottom: 20,
  padding: 10,
  backgroundColor: color.palette.white,
  borderRadius: 8,
  ...Platform.select({
    ios: {
      shadowColor: "#4661FF",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
    },
    android: {
      elevation: 2,
    },
  }),
}

export interface EntryScreenProps extends NavigationScreenProps<{}> {
}

interface state {
  walletName: string
  password: string
  rePassword: string
  phaseKey: string
}

export class EntryScreen extends React.Component<EntryScreenProps, state> {

  constructor(props, context) {
    super(props, context)
    this.state = {
      walletName: "",
      password: "",
      rePassword: "",
      phaseKey: "",
    }
  }

  entry = async () => {
    const { phaseKey: phaseKeyNoTrim, walletName, password, rePassword } = this.state
    const phaseKey = phaseKeyNoTrim.trim()
    if (!phaseKey) {
      Toast.info(__i18n("助记词不可以为空"), 1, null, false)
      return
    }
    if (!validateMnemonic(phaseKey)) {
      Toast.info(__i18n("助记词不符合规范"), 1, null, false)
      return
    }
    if (!walletName) {
      Toast.info(__i18n("钱包名称不可以为空"), 1, null, false)
      return
    }
    if (!password) {
      Toast.info(__i18n("密码不可以为空"), 1, null, false)
      return
    }
    if (password.length < 8) {
      Toast.info(__i18n("密码不可以小于8个字符"), 1, null, false)
      return
    }
    const regExp = /^(?=.*[a-z])(?=.*\d)[^]+$/
    if (!regExp.test(password)) {
      Toast.info(__i18n("密码必须含有数字和英文"), 1, null, false)
      return
    }
    if (!rePassword) {
      Toast.info(__i18n("重复密码不可以为空"), 1, null, false)
      return
    }
    if (password !== rePassword) {
      Toast.info(__i18n("俩次密码不相同"), 1, null, false)
      return
    }
    try {
      let publicKey = ddn.crypto.getKeys(phaseKey).publicKey
      let address = ddn.crypto.getAddress(publicKey)
      let phaseSeed = encryption(phaseKey, password)
      let keys = ddn.crypto.getKeys(phaseKey)
      let datUrl = "dat://" + keys.publicKey
      let curWallet = { address: address, author: "", walletName: this.state.walletName, phaseSeed: phaseSeed, publicKey: keys.publicKey, url: datUrl }
      const wallet = {
        curWallet, publicKey: keys.publicKey, privateKey: keys.privateKey,
      }
      const wallets = await load("wallets")
      if (wallets && wallets instanceof Array) {
        const isWallet = wallets.find(({ privateKey }) => privateKey === keys.privateKey)
        if (isWallet) {
          return Toast.info(__i18n("钱包已经存在"), 1, null, false)
        }
        await save("wallets", [wallet, ...wallets])
      } else {
        await save("wallets", [wallet])
      }
      await save("wallet", wallet)
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: "person", params: {} }),
        ],
      })
      this.props.navigation.dispatch(resetAction)
    } catch (e) {
      Toast.fail(e.message)
    }
  }

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={[FULL, CONTAINER]}>
          <ScrollView
            style={CONTAINER_SCROLL}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={MNEMONICINPUT}>
              <TextInput
                placeholder={__i18n("请输入助记词, 按空格分割")}
                onChangeText={(phaseKey) => this.setState({ phaseKey })}
                value={this.state.phaseKey}
                underlineColorAndroid="transparent"
                multiline={true}
              />
            </View>
            <View>
              <Text style={INPUTLABEL}>{__i18n("钱包名称")}</Text>
              <TextInput
                style={INPUTITEM}
                onChangeText={(walletName) => this.setState({ walletName })}
                value={this.state.walletName}
                underlineColorAndroid="transparent"
              />
            </View>
            <View>
              <Text style={INPUTLABEL}>{__i18n("交易密码")}</Text>
              <TextInput
                secureTextEntry={true}
                placeholder={__i18n("由字母和数字组成，不少于8个字符")}
                style={INPUTITEM}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                underlineColorAndroid="transparent"
              />
            </View>
            <View>
              <Text style={INPUTLABEL}>{__i18n("重复交易密码")}</Text>
              <TextInput
                secureTextEntry={true}
                placeholder={__i18n("重复输入密码")}
                style={INPUTITEM}
                onChangeText={(rePassword) => this.setState({ rePassword })}
                value={this.state.rePassword}
                underlineColorAndroid="transparent"
              />
            </View>
            <WhiteSpace size={"xl"} />
            <WhiteSpace size={"xl"} />
            <Button onClick={this.entry} type="primary">{__i18n("登录")}</Button>
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}
