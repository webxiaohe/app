import * as React from "react"
import { View, Text, Image, ViewStyle, Dimensions, ImageStyle, TextStyle } from "react-native"

import { color } from "../../../theme"
import { EmptyProps } from "./empty.props"

interface EmptyState { }

const width = Dimensions.get("window").width

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  backgroundColor: color.palette.backgroundColor,
  flex: 1,
  alignItems: "center",
}

const EMPTY_IMAGE: ImageStyle = {
  width: width / 2,
  height: width / 2,
  overflow: "visible",
}

const TEXT: TextStyle = {
  color: color.palette.greyText,
  marginTop: 20,
}

export class Empty extends React.PureComponent<EmptyProps, EmptyState> {

  /**
   * Render the component.
   */
  render() {
    const { type = "list", style = {} } = this.props
    return (
      <View style={[CONTAINER, style]}>
        {type === "list" ? <Image style={EMPTY_IMAGE}
          source={require("../../../assets/no-list.png")}
        /> : <Image style={EMPTY_IMAGE}
          source={require("../../../assets/no-content.png")}
          />}
        <Text style={TEXT}>暂无数据</Text>
      </View>
    )
  }
}
