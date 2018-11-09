import * as React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { QRscanner } from "react-native-qr-scanner"
import { Toast } from "antd-mobile-rn"
import { color } from "../../theme"

export interface QrScreenProps extends NavigationScreenProps<{getAddress: (string) => void}> { }

export class QrScreen extends React.Component<QrScreenProps, {flashMode: boolean; zoom: number}> {
  constructor(props) {
    super(props)
    this.state = {
      flashMode: false,
      zoom: 0.2,
    }
  }

  bottomView = () =>{
    return(
    <View style={{flex:1,flexDirection:"row",backgroundColor:"#0000004D"}}>
      <TouchableOpacity style={{flex:1,alignItems:"center", justifyContent:"center"}} onPress={()=>this.setState({flashMode:!this.state.flashMode})}>
        <Text style={{color:color.palette.white}}>{__i18n("点我开启/关闭手电筒")}</Text>
      </TouchableOpacity>
    </View>
    )
  }
  onRead = (res) => {
    if (res.data) {
      const getAddress = this.props.navigation.getParam("getAddress")
      if (getAddress) {
        this.props.navigation.getParam("getAddress")(res.data)
      }
      this.props.navigation.navigate("giro", {address: res.data})
      Toast.info(__i18n("扫码成功"),1, null, false)
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: color.palette.black,
      }}>
        <QRscanner onRead={this.onRead} renderBottomView={this.bottomView} flashMode={this.state.flashMode} zoom={this.state.zoom} finderY={50} />
      </View>
    )
  }
}
