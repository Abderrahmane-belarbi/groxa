import { ImageSourcePropType } from "react-native";

export const icons = {
  home: require("@/assets/icons/home.png"),
  wallet: require("@/assets/icons/wallet.png"),
  setting: require("@/assets/icons/setting.png"),
  activity: require("@/assets/icons/activity.png"),
  add: require("@/assets/icons/add.png"),
  back: require("@/assets/icons/back.png"),
  menu: require("@/assets/icons/menu.png"),
  plus: require("@/assets/icons/plus.png"),
  notion: require("@/assets/icons/notion.png"),
  dropbox: require("@/assets/icons/dropbox.png"),
  openai: require("@/assets/icons/openai.png"),
  adobe: require("@/assets/icons/adobe.png"),
  medium: require("@/assets/icons/medium.png"),
  figma: require("@/assets/icons/figma.png"),
  spotify: require("@/assets/icons/spotify.png"),
  github: require("@/assets/icons/github.png"),
  claude: require("@/assets/icons/claude.png"),
  canva: require("@/assets/icons/canva.png"),
} as const satisfies Record<string, ImageSourcePropType>;
