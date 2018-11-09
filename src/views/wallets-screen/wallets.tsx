import * as React from "react"
import { TouchableOpacity, View, Dimensions, ViewStyle, Text, Image, ImageStyle, FlatList, SafeAreaView, StatusBar, TextStyle, Animated, Easing } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Toast, WhiteSpace } from "antd-mobile-rn"
import bluebird from "bluebird"

import { color, spacing } from "../../theme"
import { load, save } from "../../lib/storage"
import ddnApi from "../../services/api/ddn-api"
import { Empty } from "../shared/empty"

const width = Dimensions.get("window").width

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  justifyContent: "center",
  backgroundColor: color.palette.backgroundColor,
  paddingTop: 20,
}
const ITEM_VIEW: ViewStyle = {
  flex: 1,
  overflow: "hidden",
  flexDirection: "row",
}

const ITEM_VIEW_LEFT: ViewStyle = {
  backgroundColor: color.palette.white,
  margin: spacing[3],
  marginTop: 0,
  borderRadius: 6,
  height: 100,
  padding: spacing[4],
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: width - spacing[5],
}

const ITEM_VIEW_RIGHT: ViewStyle = {
  width: spacing[7],
  height: 100,
  backgroundColor: color.palette.redTip,
  marginLeft: spacing[0],
  justifyContent: "center",
  alignItems: "center",
}

const AVATAR: ImageStyle = {
  width: 60,
  height: 60,
  marginRight: 20,
}

const ITEM_BANLANCE: ViewStyle = {
  maxWidth: 80,
  alignItems: "center",
  marginLeft: 20,
}

const ITEM_NAME: ViewStyle = {
  flex: 1,
}

const BOTTOM: ViewStyle = {
  flexDirection: "row",
  height: 60,
  borderTopColor: color.palette.border,
  borderTopWidth: 1,
}

const BOTTOM_BUTTON: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  borderRightColor: color.palette.border,
  borderRightWidth: 1,
}

const BOTTOM_BUTTON_TEXT: TextStyle = {
  fontFamily: "PingFangSC-Medium",
  fontSize: 16,
  color: color.palette.blueText,
}

const LIST = {
  flex: 1,
  marginTop: spacing[3],
}

interface state {
  wallets: []
  refreshing: boolean,
  startX: number,
  distanceX: any,
}

export interface WalletsScreenProps extends NavigationScreenProps<{}> { }

export class WalletsScreen extends React.Component<WalletsScreenProps, state> {
  constructor(props) {
    super(props)
    this.state = {
      wallets: [],
      refreshing: false,
      startX: 0,
      distanceX: new Animated.Value(0),
    }
  }

  async componentDidMount() {
    this.getWallets()
  }

  chooseWallet = (wallet) => {
    this.props.navigation.navigate("login", { wallet })
  }

  getWallets = async () => {
    this.setState({
      refreshing: true,
    })
    try {
      const wallets = await load("wallets")
      if (wallets) {
        const newWallets = await bluebird.map(wallets, async (wallet) => {
          const { curWallet: { address } } = wallet
          const result = await ddnApi.getUser(address)
          if (result.kind === "ok") {
            return {
              ...wallet,
              curWallet: {
                ...wallet.curWallet,
                balance: result.account.balance,
                distanceX: new Animated.Value(0),
              },
            }
          } else {
            return {
              ...wallet,
              curWallet: {
                ...wallet.curWallet,
                balance: 0,
                distanceX: new Animated.Value(0),
              },
            }
          }
        })
        this.setState({ wallets: newWallets })
      }
    } catch (e) {
      Toast.fail(e.message)
    } finally {
      this.setState({
        refreshing: false,
      })
    }
  }

  _keyExtractor = (item) => item.publicKey

  startMove = (evt) => {
    this.setState({
      startX: evt.nativeEvent.pageX,
    })
  }

  move = (evt, distanceX) => {
    const { startX } = this.state
    const endX = evt.nativeEvent.pageX
    const distance = startX - endX
    if (distance > spacing[4]) {
      Animated.timing(
        distanceX,
        {
          toValue: -spacing[7],
          duration: 100,
          easing: Easing.linear,
        },
      ).start()
    } else {
      Animated.timing(
        distanceX,
        {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
        },
      ).start()
    }
  }

  releaseMove = (evt, wallet)  => {
    const { startX } = this.state
    const endX = evt.nativeEvent.pageX
    const distance = startX - endX
    if ( distance <= spacing[4] && distance >= 0) {
      this.props.navigation.navigate("login", { wallet })
    }
  }

  deleteWallet = async (item) => {
    const { wallets } = this.state
    const { curWallet: { address } } = item
    const newWallets = await bluebird.filter(wallets, async (wallet) => {
      return wallet.curWallet.address !== address
    })
    await save("wallets", newWallets)
    this.setState({wallets: newWallets})
  }

  renderItem = ({ item }) => {
    const { curWallet: { address, walletName, balance, distanceX }  } = item
    return (
      <Animated.View style={[ITEM_VIEW, [{marginLeft: distanceX}]]}>
        <View style={ITEM_VIEW_LEFT}
          onMoveShouldSetResponder={(e)=> { return true}}
          onResponderGrant={e => this.startMove(e)}
          onResponderMove={e => this.move(e, distanceX)}
          onResponderRelease={e => this.releaseMove(e, item)}
        >
        <TouchableOpacity style={ITEM_VIEW_LEFT} onPress={() => this.chooseWallet(item)} >
          <Image style={AVATAR}
            source={require("../../assets/avatar.png")}
          />
          <View style={ITEM_NAME}>
            <Text numberOfLines={1}>{walletName}</Text>
            <WhiteSpace />
            <Text numberOfLines={1}>{address}</Text>
          </View>
          <View style={ITEM_BANLANCE}>
            <Text>{__i18n("余额")}</Text>
            <WhiteSpace />
            <Text numberOfLines={1}><Text style={{ color: color.palette.blueText }}>{balance / 100000000}</Text> DDN</Text>
          </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={ITEM_VIEW_RIGHT}>
          <Text style={{color: color.palette.white}} onPress={() => this.deleteWallet(item)} >{__i18n("删除")}</Text>
        </TouchableOpacity>
      </Animated.View >
    )
  }

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={[FULL, CONTAINER]}>
          {this.state.wallets.length > 0 ? <FlatList
            style={LIST}
            data={this.state.wallets}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            refreshing={this.state.refreshing}
            onRefresh={this.getWallets}
          /> : <Empty />}
          <View style={BOTTOM}>
            <TouchableOpacity style={BOTTOM_BUTTON} onPress={() => this.props.navigation.navigate("register")}>
              <Text style={BOTTOM_BUTTON_TEXT}>{__i18n("创建新账户")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={BOTTOM_BUTTON} onPress={() => this.props.navigation.navigate("entry")}>
              <Text style={BOTTOM_BUTTON_TEXT}>{__i18n("导入账户")}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
