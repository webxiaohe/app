import * as React from "react"
import { View, Platform, ViewStyle, ScrollViewStyle, ScrollView, TextInput, Text, TextStyle, SafeAreaView, StatusBar, TouchableOpacity } from "react-native"
import { NavigationScreenProps, StackActions, NavigationActions } from "react-navigation"
import { Button, WhiteSpace, Toast } from "antd-mobile-rn"
import ddn from "ddn-js"
import Icon from "react-native-vector-icons/Ionicons"

import { color } from "../../theme"
import { getPhaseKey, encryption } from "../../lib/crypto"
import { save, load } from "../../lib/storage"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  justifyContent: "center",
  backgroundColor: color.palette.white,
}

const CONTAINER_SCROLL: ScrollViewStyle = {
  flex: 1,
  padding: 20,
  paddingTop: 0,
  backgroundColor: color.palette.backgroundColor,
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

const MNEMONICINPUT = {
  height: 120,
  padding: 20,
  backgroundColor: color.palette.white,
  borderRadius: 8,
  marginBottom: 20,
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

const TIPTEXT: TextStyle = {
  color: color.palette.redTip,
  fontSize: 10,
}

const TITLE: TextStyle = {
  color: color.palette.inputLabel,
  fontSize: 18,
  marginTop: 6,
}

const PHASEKEYTEXT: TextStyle = {
  fontSize: 18,
}
const WARNTEXT: TextStyle = {
  color: color.palette.redTip,
  fontSize: 12,
}
const ALERTICON: TextStyle = {
  marginRight: 6,
  marginTop: 3,
}
const CAPION: ViewStyle = {
  marginTop: 6,
  flexDirection: "row",
  alignItems: "center",
}
const WARNTIP: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  marginRight: 10,
}
export interface RegisterScreenProps extends NavigationScreenProps<{}> {
}

interface state {
  walletName: string
  password: string
  remissingWord: string
  rePassword: string
  phaseKey: string
  address: string
  step: number
  createBip39: boolean
  passphraseParts: string[]
  missingWord: string
}

export class RegisterScreen extends React.Component<RegisterScreenProps, state> {
  backScreen = () => {
    this.props.navigation.goBack()
  }

  nextStep = (step: number) => {
    const { walletName, password, rePassword } = this.state
    switch (step) {
      case 1: {
        this.setState({
          createBip39: true,
        })
        if (!walletName) {
          Toast.info(__i18n("钱包名称不可以为空"), 1, null, false)
          break
        }
        if (!password) {
          Toast.info(__i18n("密码不可以为空"), 1, null, false)
          break
        }
        if (password.length < 8) {
          Toast.info(__i18n("密码不可以小于8个字符"), 1, null, false)
          break
        }
        const regExp = /^(?=.*[a-z])(?=.*\d)[^]+$/
        if (!regExp.test(password)) {
          Toast.info(__i18n("密码必须含有数字和英文"), 1, null, false)
          break
        }
        if (!rePassword) {
          Toast.info(__i18n("重复密码不可以为空"), 1, null, false)
          break
        }
        if (password !== rePassword) {
          Toast.info(__i18n("俩次密码不相同"), 1, null, false)
          break
        }
        if (!this.state.phaseKey) {
          let phaseKey = getPhaseKey()
          let publicKey = ddn.crypto.getKeys(phaseKey).publicKey
          let address = ddn.crypto.getAddress(publicKey)
          this.setState({
            phaseKey,
            address,
            step,
          })
        } else {
          this.setState({
            step,
          })
        }
        break
      }
      case 2: {
        const words = this.state.phaseKey.trim().split(/\s+/).filter(item => item.length > 0)
        const index = Math.floor(Math.random() * (words.length - 1))
        const missingWord = words[index]
        this.setState({
          passphraseParts: this.state.phaseKey.split(missingWord),
          missingWord,
          remissingWord: "",
        })
      }
      default: {
        this.setState({
          step,
        })
      }
    }
    if (step === 1) {
      this.setState({
        createBip39: false,
      })
    }
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      walletName: "",
      password: "",
      rePassword: "",
      step: 0,
      createBip39: false,
      phaseKey: "",
      address: "",
      passphraseParts: [],
      missingWord: "",
      remissingWord: "",
    }
  }

  createAccount = async () => {
    const { remissingWord, missingWord } = this.state
    if (remissingWord !== missingWord) {
      return Toast.info(__i18n("请输入正确的单词"), 1, null, false)
    }
    const { phaseKey, address, password } = this.state
    let phaseSeed = encryption(phaseKey, password)
    let keys = ddn.crypto.getKeys(phaseKey)
    let datUrl = "dat://" + keys.publicKey
    let curWallet = { address: address, author: "", walletName: this.state.walletName, phaseSeed: phaseSeed, publicKey: keys.publicKey, url: datUrl }
    try {
      const wallet = {
        curWallet, publicKey: keys.publicKey, privateKey: keys.privateKey,
      }
      await save("wallet", wallet)
      const wallets = await load("wallets")
      if (wallets && wallets instanceof Array) {
        await save("wallets", [wallet, ...wallets])
      } else {
        await save("wallets", [wallet])
      }
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

  renderFirstStep = () => {
    return <ScrollView
      style={CONTAINER_SCROLL}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
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
        <Text style={INPUTLABEL}>{__i18n("请输入密码")}</Text>
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
        <Text style={INPUTLABEL}>{__i18n("重复输入密码")}</Text>
        <TextInput
          secureTextEntry={true}
          placeholder={__i18n("重复输入密码")}
          style={INPUTITEM}
          onChangeText={(rePassword) => this.setState({ rePassword })}
          value={this.state.rePassword}
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={CAPION}>
        <Icon size={16} name="md-alert" color={color.palette.redTip}></Icon>
        <Text style={TIPTEXT}>{__i18n(" 该密码用于确认交易和下次登录，若忘记密码可通过助记词重新设置")}</Text>
      </View>
      <WhiteSpace size={"xl"} />
      <WhiteSpace size={"xl"} />
      <WhiteSpace size={"xl"} />
      <Button loading={this.state.createBip39} disabled={this.state.createBip39} onClick={() => this.nextStep(1)} type="primary">{__i18n("创建钱包")}</Button>
    </ScrollView>
  }

  renderSecondStep = () => {
    return <ScrollView
      style={CONTAINER_SCROLL}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginTop: 20 }}>
        <Text style={TITLE}>{__i18n("钱包助记词")}</Text>
        <WhiteSpace />
        <View style={WARNTIP}>
          <Icon size={12} name="md-alert" color={color.palette.redTip} style={ALERTICON}></Icon>
          <Text numberOfLines={3} style={WARNTEXT} >{__i18n("助记词用于恢复钱包，或重置钱包密码，将它准确保存到安全的地方。若截屏，请尽快将图片保存到安全的地方，并在本机中删除。")}</Text>
        </View>
        <WhiteSpace size={"xl"} />
        <TouchableOpacity style={MNEMONICINPUT} activeOpacity={1} onPress={() => {Toast.info(__i18n("禁止复制"), 1, null, false)}}>
          <Text style={PHASEKEYTEXT}>{this.state.phaseKey}</Text>
        </TouchableOpacity>
      </View>
      <WhiteSpace size={"xl"} />
      <WhiteSpace size={"xl"} />
      <Button onClick={() => this.nextStep(2)} type="primary">{__i18n("下一步 验证助记词")}</Button>
    </ScrollView>
  }

  renderThirdStep = () => {
    return <ScrollView
      style={CONTAINER_SCROLL}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ ...TITLE, marginTop: 20 }}>{__i18n("请填入正确的单词")}</Text>
      <WhiteSpace size={"xl"} />
      <View style={MNEMONICINPUT}>
        <Text style={PHASEKEYTEXT}>{`${this.state.passphraseParts[0]}_____${this.state.passphraseParts[1]}`}</Text>
      </View>
      <TextInput
        placeholder={__i18n("请在此处填入缺失的单词")}
        style={INPUTITEM}
        onChangeText={(remissingWord) => this.setState({ remissingWord })}
        value={this.state.remissingWord}
        underlineColorAndroid="transparent"
      />
      <WhiteSpace size={"xl"} />
      <WhiteSpace size={"xl"} />
      <WhiteSpace size={"xl"} />
      <Button onClick={this.createAccount} type="primary">{__i18n("确认")}</Button>
      <WhiteSpace />
      <Button onClick={() => this.nextStep(1)} type="primary">{__i18n("返回")}</Button>
    </ScrollView>
  }

  renderStep = () => {
    if (this.state.step === 0) {
      return this.renderFirstStep()
    }
    if (this.state.step === 1) {
      return this.renderSecondStep()
    }
    if (this.state.step === 2) {
      return this.renderThirdStep()
    }
    return null
  }

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={[FULL, CONTAINER]}>
          {this.renderStep()}
        </SafeAreaView>
      </View>
    )
  }
}
