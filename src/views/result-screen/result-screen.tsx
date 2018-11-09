import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { View, ViewStyle, Text, TextStyle, ImageStyle, StatusBar, SafeAreaView } from "react-native"
import moment from "moment"
import { color } from "../../theme"
import { Toast } from "antd-mobile-rn"
import Icon from "react-native-vector-icons/Ionicons"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { 
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: color.palette.white,
}
const RESULTICON: ImageStyle = {
    marginTop: 51,
}
const RESULTTEXT: TextStyle = {
    fontSize: 22,
    marginTop: 17,
    lineHeight: 30,
}
const RESULTINFO: ViewStyle = {
    marginTop: 30,
    paddingTop: 16,
    paddingBottom: 17,
    paddingLeft: 30,
    paddingRight: 30,
    borderWidth: 1,
    borderColor: "rgba(72,101,254, 0.2)",
    width: "100%",
}
const ERRORRESULTINFO: ViewStyle = {
    marginTop: 30,
    paddingTop: 16,
    paddingBottom: 17,
    paddingLeft: 30,
    paddingRight: 30,
    borderWidth: 1,
    borderColor: "rgba(253,107,108, 0.2)",
    width: "100%",
}
const INFOITEM: ViewStyle = {
    flexDirection: "row",
    justifyContent: "flex-start",
}
const INFOTEXT: TextStyle = {
    textAlign: "left",
    fontSize: 12,
    color: color.palette.inputLabel,
    lineHeight: 17,
}
const INFORIGHT: TextStyle = {
    marginLeft: 5,
}
const SECONDITEM: ViewStyle = {
    marginTop: 9,
}
export interface ResultScreenProps extends NavigationScreenProps<{address: string; amount: number; NO:string; result: {kind: string;response: {error: string}}}>{ }

interface state {
    address: string
    amount: number
    NO: string
    result: boolean
}

export class ResultScreen extends React.Component<ResultScreenProps, state> {

    constructor(props, context) {
        super(props, context)
        this.state = {
            address: "",
            amount: 0,
            NO: "",
            result: false,
        }
    }
    componentDidMount () {
        try {
            const address = this.props.navigation.getParam("address")
            const amount = this.props.navigation.getParam("amount")
            const result = this.props.navigation.getParam("result")
            const NO = this.props.navigation.getParam("NO")
            this.setState({
                address,
                amount,
                NO,
            })
            if (result.kind === "ok") {
                this.setState({
                    result: true,
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
    backScreen = () => {
        this.props.navigation.goBack()
    }
    render () {
        const { address, amount, NO, result } = this.state
        return (
            <View style={FULL}>
                <StatusBar barStyle="light-content" />
                <SafeAreaView style={[CONTAINER, FULL]}>
                    {
                        result ? 
                        <View>
                            <Icon size={100} name="md-checkmark-circle" color={color.palette.blueText} style={RESULTICON}></Icon>
                            <Text style={[RESULTTEXT, {color: color.palette.blueText}]}>{__i18n("转账成功")}</Text>
                        </View>
                        :
                        <View>
                            <Icon size={100} name="md-close-circle" color={color.palette.redTip} style={RESULTICON}></Icon>
                            <Text style={[RESULTTEXT, {color: color.palette.angry}]}>{__i18n("转账失败")}</Text>
                        </View>

                    }
                    
                    <View style={result ? RESULTINFO : ERRORRESULTINFO}>
                        <View style={INFOITEM}>
                            <Text style={INFOTEXT}>{__i18n("接收账号")}:</Text>
                            <Text style={[INFORIGHT, INFOTEXT]}>{address}</Text>
                        </View>
                        <View style={[INFOITEM, SECONDITEM]}>
                            <Text style={INFOTEXT}>{__i18n("转账金额")}:</Text>
                            <Text style={[INFORIGHT, INFOTEXT]}>{amount}DDN</Text>
                        </View>
                        <View style={[INFOITEM, SECONDITEM]}>
                            <Text style={INFOTEXT}>{__i18n("编号")}:</Text>
                            <Text style={[INFORIGHT, INFOTEXT]}>{NO}</Text>
                        </View>
                        <View style={[INFOITEM, SECONDITEM]}>
                            <Text style={INFOTEXT}>{__i18n("时间")}:</Text>
                            <Text style={[INFORIGHT, INFOTEXT]}>{moment().format("YYYY-MM-DD")}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
