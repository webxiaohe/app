import { createStackNavigator, NavigationRouteConfigMap } from "react-navigation"
import { HomeScreen } from "../views/home-screen"
import { LoadingScreen } from "../views/loading-screen"
import { RegisterScreen } from "../views/register-screen"
import { WalletsScreen } from "../views/wallets-screen"
import { LoginScreen } from "../views/login-screen"
import { EwmScreen } from "../views/ewm-screen"
import { GiroScreen } from "../views/giro-screen"
import { ResultScreen } from "../views/result-screen"
import { PersonScreen } from "../views/person-screen"
import { FirstScreen } from "../views/first-screen"
import { QrScreen } from "../views/qr-screen"
import { EntryScreen } from "../views/entry-screen"

import { color } from "../theme"
import { translate } from "../i18n"

const __i18n = translate
const HomeNavigatorRoutes: NavigationRouteConfigMap = {
  loading: {
    screen: LoadingScreen,
    navigationOptions: {
      header: null,
    },
  },
  home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  register: {
    screen: RegisterScreen,
    navigationOptions: {
      title: __i18n("注册"),
    },
  },
  qr: {
    screen: QrScreen,
    navigationOptions: {
      title: __i18n("扫描二维码"),
    },
  },
  login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    },
  },
  ewm: {
    screen: EwmScreen,
    navigationOptions: {
      title: "",
      headerStyle: {
        backgroundColor: color.palette.blueBack,
      },
    },
  },
  giro: {
    screen: GiroScreen,
    navigationOptions: {
      title: __i18n("转账"),
    },
  },
  result: {
    screen: ResultScreen,
    navigationOptions: {
      title: __i18n("转账结果"),
    },
  },
  person: {
    screen: PersonScreen,
    navigationOptions: {
      header: null,
    },
  },
  entry: {
    screen: EntryScreen,
    navigationOptions: {
      title: __i18n("导入账户"),
    },
  },
  first: {
    screen: FirstScreen,
    navigationOptions: {
      header: null,
    },
  },
  wallets: {
    screen: WalletsScreen,
    navigationOptions: {
      title: __i18n("账户"),
    },
  },
}

Object.keys(HomeNavigatorRoutes).forEach((key) => {
  if (HomeNavigatorRoutes[key].navigationOptions && HomeNavigatorRoutes[key].navigationOptions.header !== null) {
    if (HomeNavigatorRoutes[key].navigationOptions.headerStyle) {
      HomeNavigatorRoutes[key].navigationOptions.headerStyle = {
        backgroundColor: color.palette.header,
        ...HomeNavigatorRoutes[key].navigationOptions.headerStyle,
      }
    } else {
      HomeNavigatorRoutes[key].navigationOptions.headerStyle = {
        backgroundColor: color.palette.header,
      }
    }
    HomeNavigatorRoutes[key].navigationOptions.headerTintColor = HomeNavigatorRoutes[key].navigationOptions.headerTintColor || color.palette.white
  }
})

export const HomeNavigator = createStackNavigator(HomeNavigatorRoutes,
  {
    headerMode: "screen",
  })