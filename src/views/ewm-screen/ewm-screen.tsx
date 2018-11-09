import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { View, ViewStyle, Text, TextStyle, SafeAreaView, ImageBackground, StatusBar, Clipboard } from "react-native"
import { color } from "../../theme"
import { Button, Toast } from "antd-mobile-rn"
import QRCode from "react-native-qrcode"
import { load } from "../../lib/storage"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
    marginLeft: 15, 
    marginRight: 15, 
    marginTop: 35, 
    backgroundColor: color.palette.white, 
    borderRadius: 10, 
    paddingTop: 41, 
    paddingBottom: 55, 
    alignItems: "center",
}
const ADDRESSTEXT: TextStyle = {
    marginTop: 48, 
    width: 198, 
    textAlign: "center", 
    fontSize: 14, 
    color: color.palette.blueText, 
    lineHeight: 20,
}
const BTNCONTAINER: ViewStyle = {
    marginTop: 25, 
    width: 140, 
    height: 44,
}
export interface EwmScreenProps extends NavigationScreenProps<{}>{ }

interface state {
    address: string
}

export class EwmScreen extends React.Component<EwmScreenProps, state> {
    constructor(props, context) {
        super(props, context)
        this.state = {
            address: "",
        }
        this._setClipboardContent = this._setClipboardContent.bind(this)
    }
    componentWillMount = async () => {
        try {
            const wallet = await load("wallet")
            const address = wallet.curWallet.address
            this.setState({
                address,
            })
        } catch (e) {
            Toast.fail(e.message)
        }
    }
    async _setClipboardContent () {
        try {
            Clipboard.setString(this.state.address)
            Toast.info(__i18n("复制地址成功"), 1, null, false)
        } catch (e) {
            Clipboard.setString(e.message)
        }
    }
    render () {
        const { address } = this.state
        return (
            <SafeAreaView style={[FULL]}>
                <StatusBar barStyle="light-content" />
                <ImageBackground source={require("./back.png")} style={FULL}>
                    <View style={CONTAINER}>
                        <QRCode
                            value={this.state.address}
                            size={184}
                            bgColor={color.palette.black}
                            fgColor={color.palette.white}/>
                        <Text style={ADDRESSTEXT}>{address}</Text>
                        <Button type="primary" style={BTNCONTAINER} onClick={this._setClipboardContent}>{__i18n("复制地址")}</Button>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        )
    }
}