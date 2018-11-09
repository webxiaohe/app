import * as React from "react"
import { View, ViewStyle, Text, TextStyle, SafeAreaView, Image, ImageStyle, TextInput, StatusBar, TouchableOpacity } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { color } from "../../theme"
import { Button, Toast, Modal } from "antd-mobile-rn"
import Icon from "react-native-vector-icons/Ionicons"
import ddn from "ddn-js"
import ddnApi from "../../services/api/ddn-api"
import { load } from "../../lib/storage"
import { getRawSeed } from "../../lib/crypto"

const prompt = Modal.prompt
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
    marginLeft: 15,
    marginRight: 15,
}
const FORMBOX: ViewStyle = {
    marginTop: 20,
    backgroundColor: color.palette.white,
    borderRadius: 4,
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 35,
}
const CAPION: ViewStyle = {
    marginTop: 11,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
}
const CAPIONTEXT: TextStyle = {
    color: "#FD6B6C",
    marginLeft: 6,
    fontSize: 10,
}
const BUTTONBOX: ViewStyle = {
    marginTop: 18,
    height: 44,
}
const INPUTITEM: ViewStyle = {
    height: 66,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
}
const INPUTBOX: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}
const INPUT: TextStyle = {
    padding: 0,
    flex: 1,
    color: "#999999",
    fontSize: 14,
    marginLeft: 11,
}
const INPUTLEFTICON: ImageStyle = {
    width: 24,
    height: 24,
}
const ACCOUNTCONTAINER: ViewStyle = {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
}
const FEETEXT: TextStyle = {
    fontSize: 10,
    lineHeight: 14,
    color: "#FD6B6C",
}
const RECORDCONTAINER: ViewStyle = {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
}
const RECORDTEXT: TextStyle = {
    color: color.palette.blueTip,
    fontSize: 12,
    lineHeight: 17,
}
const REMARKINPUT = {
    flex: 1,
    height: 20,
    color: color.palette.black,
    padding: 0,
}
export interface GiroScreenProps extends NavigationScreenProps<{ address: string }> { }

interface state {
    address: string
    amount: number
    remark: string
    fee: number
    account: {
        balance: number;
    }
}

export class GiroScreen extends React.Component<GiroScreenProps, state> {
    backScreen = () => {
        this.props.navigation.goBack()
    }
    componentDidMount = async () => {
        try {
            const wallet = await load("wallet")
            const address = wallet.curWallet.address
            const result = await ddnApi.getUser(address)
            const receiveAddress = this.props.navigation.getParam("address")
            if (receiveAddress) {
                this.setState({
                    address: receiveAddress,
                })
            }
            if (result.kind === "ok") {
                this.setState({
                    account: result.account,
                })
            } else if (result.kind === "error-result") {
                Toast.fail(result.response.error)
            } else {
                Toast.fail(result.kind)
            }
        } catch (e) {
            Toast.fail(e.message)
        }
    }

    handleGiro = async () => {
        const { address, amount, remark } = this.state
        if (!address) {
            Toast.info(__i18n("钱包地址不能为空"), 1, null, false)
        } else if (!ddn.crypto.isAddress(address)) {
            Toast.info(__i18n("钱包地址格式不正确"), 1, null, false)
        } else if (!amount) {
            Toast.info(__i18n("转账金额不可以为空"), 1, null, false)
        } else if (!/^[0-9]+\.*[0-9]*$/.test(String(amount))) {
            Toast.info(__i18n("转账金额格式不正确"), 1, null, false)
        } else {
            const pureAmount = parseInt(String(amount * 100000000), 10)
            const wallet = await load("wallet")
            prompt(
                __i18n("请输入交易密码"),
                " ",
                [
                    {text: __i18n("取消")},
                    {text: __i18n("提交"), onPress: async password => {
                        if (!password) {
                            return Toast.info(__i18n("密码不可以为空"), 1, null, false)
                        }
                        let phaseKey = getRawSeed(wallet.curWallet.phaseSeed, password)
                        if (!phaseKey) {
                            return Toast.fail(__i18n("密码错误"))
                        } else {
                            const transaction = ddn.transaction.createTransaction(
                                address,
                                pureAmount.toString(),
                                remark,
                                phaseKey,
                                undefined,
                            )
                            transaction.fee = Number(transaction.fee)
                            transaction.amount = Number(transaction.amount)
                            const result = await ddnApi.postTransfer({
                                transaction,
                            })
                            this.props.navigation.navigate("result", { result, address, amount, NO:transaction.id })
                        }
                    }},
                ],
                "secure-text",
            )
        }
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            address: "",
            amount: 0,
            remark: "",
            fee: 0.1,
            account: {
                balance: 0,
            },
        }
    }
    getAddress = (address) => {
        if (address) {
            this.setState({
                address,
            })
        }
    }
    render() {
        return (
            <View style={FULL}>
                <StatusBar barStyle="light-content" />
                <SafeAreaView style={[FULL, CONTAINER]}>
                    <View style={FORMBOX}>
                        <View style={INPUTITEM}>
                            <Image source={require("../../images/icon/wallet-icon.png")} style={INPUTLEFTICON} />
                            <View style={INPUTBOX}>
                                <TextInput
                                    style={INPUT}
                                    underlineColorAndroid="transparent"
                                    placeholder={__i18n("请输入钱包地址")}
                                    value={this.state.address}
                                    onChangeText={(address) => { this.setState({ address }) }}
                                />
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("qr", { getAddress: this.getAddress })}>
                                    <Icon size={22} name="md-qr-scanner" color={color.palette.lightGrey}></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={INPUTITEM}>
                            <Image source={require("../../images/icon/giro-circle-icon.png")} style={INPUTLEFTICON} />
                            <TextInput
                                style={INPUT}
                                underlineColorAndroid="transparent"
                                placeholder={__i18n("请输入转帐金额")}
                                onChangeText={(amount) => { this.setState({ amount: Number(amount) }) }}
                            />
                        </View>
                        <View style={ACCOUNTCONTAINER}>
                            <Text style={FEETEXT}>{__i18n("可用余额")}：<Text>{this.state.account ? this.state.account.balance / 100000000 : 0}</Text></Text>
                            <Text style={FEETEXT}>{__i18n("费用")}：{this.state.fee}</Text>
                        </View>
                        <View style={RECORDCONTAINER}>
                            <Text style={RECORDTEXT}>{__i18n("转账备注")}：</Text>
                            <TextInput
                                style={REMARKINPUT}
                                onChangeText={(remark) => this.setState({ remark })}
                                value={this.state.remark}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                    <View style={CAPION}>
                        <Icon size={16} name="md-alert" color={color.palette.redTip}></Icon>
                        <Text style={CAPIONTEXT}>{__i18n("请确认你发送正确的DDN地址，该操作不可撤销")}</Text>
                    </View>
                    <Button type="primary" style={BUTTONBOX} onClick={this.handleGiro}>{__i18n("转账")}</Button>
                </SafeAreaView>
            </View>
        )
    }
}