import { createStackNavigator } from "react-navigation"
import { HomeNavigator } from "./home-navigator"

export const RootNavigator = createStackNavigator(
  {
    rootStack: { screen: HomeNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
)
