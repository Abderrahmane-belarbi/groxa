import { Image, Pressable, Text, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="w-full flex-row items-center justify-between mb-4">
      <View className="flex-row gap-2 items-center">
        <Image source={require("@/assets/images/avatar.png")} className="w-10 h-10 rounded-full" />
        <Text className="text-xl font-sans-bold text-[#081226]">Abderrahmane Belarbi</Text>
      </View>
      <Pressable className="w-10 h-10 rounded-full border border-[#C6BFA2] flex items-center justify-center">
        <Image source={require("@/assets/icons/plus.png")} className="w-5 h-5" />
      </Pressable>
    </View>
  )
}