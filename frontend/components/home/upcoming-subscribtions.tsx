import { Text, View } from "react-native";

export default function UpcomingSubscriptions() {
  return (
    <View className="w-full bg-[#F5F5F5] py-4 px-5 rounded-tr-[20px] rounded-bl-[20px] gap-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-sans-semibold text-[#081226]">Netflix</Text>
        <Text className="font-sans-semibold text-lg text-[#C6BFA2]">Tomorrow</Text>
      </View>
    </View>
  )
}