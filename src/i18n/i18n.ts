import I18n from "react-native-i18n"

const en = require("./en")
const zhCN = require("./zh-CN")

I18n.fallbacks = true
I18n.translations = { en, zhCN }
