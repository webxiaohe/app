import React, { Component } from "react"
import { View, ViewStyle, Text, TextStyle, StatusBar, ImageBackground, ImageStyle, Image, SafeAreaView, TouchableOpacity, Clipboard, FlatList, Animated, Easing, ToastAndroid, BackHandler } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import Icon from "react-native-vector-icons/Ionicons"
import ddn from "ddn-js"
import moment from "moment"
import { Toast } from "antd-mobile-rn"

import { color, spacing } from "../../theme"
import ddnApi from "../../services/api/ddn-api"
import { load, remove } from "../../lib/storage"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
	justifyContent: "center",
	flexDirection: "row",
	alignItems: "center",
}
const PERSONBACK: ImageStyle = {
  height: 220,
  width: "100%",
	alignItems: "center",
	position: "relative",
}
const LOADING_VIEW: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: 100,
  zIndex: 2,
}
const PERSONCONTAINER: ViewStyle = {
	width: 300,
	height: "100%",
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
}
const AVATARIMAGE: ImageStyle = {
	width: 62,
	height: 62,
	borderRadius: 62,
}
const PUBLICKEY: ViewStyle = {
	marginTop: 1,
	flexDirection: "row",
	alignItems: "flex-end",
	justifyContent: "center",
}
const PUBLICKEYTEXT: TextStyle = {
	fontSize: 10,
	color: color.palette.offWhite,
	maxWidth: 200,
}
const PUBLICKEYICON: ImageStyle = {
	width: 14,
	height: 17,
  marginLeft: 5,
  position: "relative",
  zIndex: 88,
}
const CHOICEBOX: ViewStyle = {
	position: "absolute",
	width: "100%",
	height: 60,
	bottom: -30,
	marginLeft: 15,
	marginRight: 15,
}
const CHOICEBACK: ViewStyle = {
	flex: 1,
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
}
const EWMICON: ImageStyle = {
	width: 23,
	height: 22,
}
const GIROICON: ImageStyle = {
	width: 25,
	height: 24,
}
const QRICON: ImageStyle = {
	width: 22,
	height: 22,
}
const LISTITEM: ViewStyle = {
	marginTop: 23,
	alignItems: "center",
	flexDirection: "row",
}
const LISTITEMTEXT: ViewStyle = {
	flex: 1,
	marginLeft: 15,
	flexDirection: "row",
	justifyContent: "space-between",
	borderBottomColor: "rgba(0,0,0,0.05)",
	borderBottomWidth: 1,
}
const LISTITEMADDRESS: TextStyle = {
	fontSize: 12,
	lineHeight: 16,
	color: color.palette.inputLabel,
	marginRight: 10,
}
const LISTITEMDATE: TextStyle = {
	fontSize: 10,
	color: color.palette.greyText,
	lineHeight: 14,
}
const LISTCONTAINER: ViewStyle = {
	marginTop: 72,
	marginLeft: 15,
	flex: 1,
}
const SIGN: TextStyle = {
	fontSize: 20,
	marginRight: 2,
}
const NAVTEXT: TextStyle = {
	fontSize: 14,
	color: color.palette.gray,
	marginLeft: spacing[2],
	fontFamily: "Montserrat",
}
const TEXT: TextStyle = {
	color: color.palette.white,
}
const PERSONADDRESS: TextStyle = {
	...TEXT,
	marginTop: spacing[4],
	lineHeight: 33,
	fontSize: 24,
}
const LISTTITLE: TextStyle = {
	fontSize: 16,
	lineHeight: 22,
	color: color.palette.gray,
}
const LISTNUM: TextStyle = {
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "flex-end",
	paddingRight: 15,
	paddingBottom: 5,
	fontSize: 16,
}
const PLUS: TextStyle = {
	color: "#4765FE",
	...LISTNUM,
}
const MINUS: TextStyle = {
	color: "#FFBB33",
	...LISTNUM,
}
const EMPTYCONTAINER: ViewStyle = {
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
}
const EMPTYTIP: TextStyle = {
	fontSize: 20,
	color: color.palette.greyText,
	marginTop: 9,
}
const LOGOUTICON: TextStyle = {
	position: "absolute",
	right: 20,
	top: 20,
	zIndex: 6,
}
const LOADING: ViewStyle = {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderLeftColor: color.palette.lightGrey,
  borderTopColor: color.palette.lightGrey,
  borderBottomColor: color.palette.lightGrey,
  borderWidth: 5,
  borderRightColor: color.palette.blueText,
  position: "absolute",
  left: "50%",
  marginLeft: -15,
  top: 0,
  zIndex: 1,
}
export interface PersonScreenProps extends NavigationScreenProps<{}> { }

interface state {
	address: string
	balance: number
	transactionsList: list[]
	refreshing: boolean,
	offset: number,
	limit: number,
	count: number,
  idList: string[],
  startY: number,
  moveY: number,
  positionY: any,
}

interface list {
	key: string, amount: number, timestamp: number, senderAdr: string, recipienterAdr: string,
}
export class PersonScreen extends Component<PersonScreenProps, state> {

	constructor(props, context) {
		super(props, context)
		this.state = {
			address: "",
			balance: 0,
			transactionsList: [],
			refreshing: true,
			offset: 0,
			limit: 10,
			count: 0,
      idList: [],
      startY: 0,
      moveY: 0,
      positionY: new Animated.Value(-spacing[6]),
		}
		this._setClipboardContent = this._setClipboardContent.bind(this)
		this.renderItems = this.renderItems.bind(this)
	}
	componentDidMount = async () => {
		try {
			const wallet = await load("wallet")
			const address = wallet.curWallet.address
			const { offset } = this.state
			this.setState({
				address,
			})
			const result = await ddnApi.getUser(address)
			if (result.kind === "ok") {
				this.setState({
					balance: result.account.balance,
				})
				this.getTransactions(offset)
			} else if (result.kind === "error-result") {
				this.setState({
					refreshing: false,
				})
				Toast.fail(result.response.error)
			} else {
				this.setState({
					refreshing: false,
				})
				Toast.fail(result.kind)
			}

		} catch (e) {
			Toast.fail(e.message, 1, null, false)
			this.setState({
				refreshing: false,
			})
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
	switchRoute = async (routeName) => {
		await this.removeEvent()
		this.props.navigation.navigate(routeName)
	}
	getUserInfo = async () => {
		try {
			const wallet = await load("wallet")
			const address = wallet.curWallet.address
			const result = await ddnApi.getUser(address)
			const  { balance, offset } = this.state
			if (result.kind === "ok") {
				this.setState({
          balance: result.account.balance,
				})
				if (result.account.balance !== balance) {
					this.getTransactions(offset)
				}
        Toast.info(__i18n("刷新成功"), 1, null, false)
			}
		} catch (e) {
			Toast.fail(e.message)
		}
	}
	renderItems = (item) => {
		const { address } = this.state
		return (<View style={LISTITEM} key={item.id}>
			<Image source={require("../../images/icon/trad-icon.png")} style={{ width: 21, height: 17 }} />
			{
				address === item.recipienterAdr ? 
				<View style={LISTITEMTEXT}>
					<View style={[FULL]}>
						<Text numberOfLines={1} style={LISTITEMADDRESS}>{item.senderAdr}</Text>
						<Text style={LISTITEMDATE}>{moment(+ddn.utils.slots.beginEpochTime() + item.timestamp*1000).format("YYYY-MM-DD HH:mm")}</Text>
					</View>
					<Text style={[PLUS]}>
						<Text style={SIGN}>+</Text>
						<Text>{item.amount / 100000000}</Text>
						<Text>DDN</Text>
					</Text>
				</View>
				:
				<View style={LISTITEMTEXT}>
					<View style={[FULL]}>
						<Text numberOfLines={1} style={LISTITEMADDRESS}>{item.recipienterAdr}</Text>
						<Text style={LISTITEMDATE}>{moment(+ddn.utils.slots.beginEpochTime() + item.timestamp*1000).format("YYYY-MM-DD HH:mm")}</Text>
					</View>
					<Text style={[MINUS]}>
						<Text style={SIGN}>-</Text>
						<Text>{item.amount / 100000000}</Text>
						<Text>DDN</Text>
					</Text>
				</View>
			}
		</View>)
	}
	getTransactions = async (offset: number) => {
		try {
			const wallet = await load("wallet")
			const address = wallet.curWallet.address
			const { limit, count, transactionsList, idList } = this.state
			const transactionsResult = await ddnApi.GetTransactions(address, address, offset*limit, limit)
			const list: list[] = []
			const transactionItems = []
			if (transactionsResult.kind === "ok") {
				if (transactionsResult.transactions.count === 0) {
					this.setState({
						refreshing: false,
					})
					return
				}
				if (count >= transactionsResult.transactions.count) {
					this.setState({
						refreshing: false,
					})
					Toast.info(__i18n("已加载完"), 1, null, false)
					return
				}
				transactionsResult.transactions.transactions.map((item: { id: string; recipientId: string; amount: number, timestamp: number, senderId: string, }) => {
					if (idList.indexOf(item.id) === -1) {
						list.unshift({
							key: item.id,
							amount: item.amount,
							timestamp: item.timestamp,
							senderAdr: item.senderId,
							recipienterAdr: item.recipientId,
						})
						transactionItems.push(item.id)
					}
				})
				this.setState({
					refreshing: false,
					transactionsList: [...list, ...transactionsList],
					count: count+list.length,
					idList: idList.concat(transactionItems),
				})
				if ((offset + 1)*limit <= (count+list.length)) {
					this.setState({
						offset: offset+1,
					})
				}
			} else {
				this.setState({
					refreshing: false,
					transactionsList: [],
					count: 0,
				})
			}
		} catch (e) {
			Toast.fail(e.message)
		}
	}
	async _setClipboardContent() {
		try {
			Clipboard.setString(this.state.address)
			Toast.info(__i18n("复制地址成功"), 1, null, false)
		} catch (e) {
			Clipboard.setString(e.message)
		}
	}
	_onRefresh = () => {
		const { offset } = this.state
		Toast.info(__i18n("正在加载中"), 1, null, false)
		this.getTransactions(offset)

	}
	logout = async () => {
		try {
			const wallet = await load("wallet")
			if (wallet) {
				await remove("wallet")
				this.props.navigation.replace("login", { wallet })
			} else {
				this.props.navigation.replace("login")
			}
		} catch (e) {
			this.props.navigation.replace("login")
		}
	}
	renderFlatList = () => {
		const { transactionsList, refreshing, limit } = this.state
		return (
			<FlatList
				data={transactionsList}
				renderItem={({ item }: { item }) => this.renderItems(item)}
				initialNumToRender={limit}
				refreshing={refreshing}
				onRefresh={this._onRefresh}
			/>
		)
	}
	renderEmptyComponent = () => {
		return (
			<View style={EMPTYCONTAINER}>
				<Image source={require("../../assets/no-list.png")} />
				<Text style={EMPTYTIP}>{__i18n("暂无数据")}</Text>
			</View>
		)
  }
  startMove = (evt) => {
    this.setState({
      startY: evt.nativeEvent.pageY,
    })
  }
  releaseMove = (evt) => {
    const { startY, positionY } = this.state
    const endY = evt.nativeEvent.pageY
    const distance = endY - startY
    if (distance > spacing[7]) {
      this.getUserInfo()
    }
    Animated.timing(
      positionY,
      {
        toValue: -spacing[6],
        duration: 1000,
        easing: Easing.linear,
      },
    ).start()
  }
  move = (evt) => {
    const { startY, positionY } = this.state
    const endY = evt.nativeEvent.pageY
    const distance = endY - startY
    if (distance > spacing[6]) {
      Animated.timing(
        positionY,
        {
          toValue: evt.nativeEvent.pageY,
          duration: 10,
          easing: Easing.linear,
        },
      ).start()
    }
  }
  renderLoading = () => {
    const { positionY } = this.state
    return <Animated.View style={[LOADING, {top: positionY} ]}></Animated.View>
  }
	render() {
		const { address, balance, transactionsList, refreshing } = this.state
		return (
			<View style={FULL} >
				<StatusBar barStyle="light-content" />
				<SafeAreaView style={FULL}>
					<TouchableOpacity style={LOGOUTICON} onPress={this.logout} >
						<Icon size={26} name="md-log-out" color={color.palette.white} ></Icon>
					</TouchableOpacity>

					<ImageBackground source={require("./person-back.png")} style={PERSONBACK}>
            <View
              style={LOADING_VIEW}
              onMoveShouldSetResponder={()=> {return true}} 
              onResponderGrant={this.startMove}
              onResponderMove={this.move}
              onResponderRelease={this.releaseMove}
            >
            </View>
            {
              this.renderLoading()
            }
            <TouchableOpacity activeOpacity={1}>
              <View style={PERSONCONTAINER}>
                <Image source={require("../../assets/avatar.png")} style={AVATARIMAGE} />
                <Text style={PERSONADDRESS}>{balance / 100000000}DDN</Text>
                <TouchableOpacity activeOpacity={1} style={PUBLICKEY} onPress={this._setClipboardContent}>
                  <Text style={PUBLICKEYTEXT} numberOfLines={1}>{__i18n(address)}</Text>
                  <Image source={require("../../images/icon/copy-icon.png")} style={PUBLICKEYICON} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <View style={CHOICEBOX}>
              <ImageBackground source={require("./btn-shadow.png")} style={CHOICEBACK}>
                <TouchableOpacity style={[FULL, CONTAINER]} activeOpacity={1} onPress={() => this.switchRoute("qr")}>
                  <Image source={require("../../images/icon/ewm-icon.png")} style={EWMICON}></Image>
                  <Text style={[NAVTEXT]}>{__i18n("付款")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[FULL, CONTAINER]} activeOpacity={1} onPress={() => this.switchRoute("giro")}>
                  <Image source={require("../../images/icon/giro-icon.png")} style={GIROICON}></Image>
                  <Text style={[NAVTEXT]} >{__i18n("转帐")}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={[FULL, CONTAINER]} onPress={() => this.switchRoute("ewm")}>
                  <Image source={require("../../images/icon/qr-icon.png")} style={QRICON}></Image>
                  <Text style={[NAVTEXT]}>{__i18n("收款")}</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </ImageBackground >
					<View style={[LISTCONTAINER]}>
						<Text style={LISTTITLE}>{__i18n("交易记录")}</Text>
						{
							(!refreshing && transactionsList.length <= 0) ? this.renderEmptyComponent() : this.renderFlatList()
						}
					</View>
				</SafeAreaView>
			</View>
		)
	}
}