import { Text, TouchableOpacity, View } from "react-native";

type ListHeadingProps = {
  title: string;
  link: string;
}

export default function ListHeading({ title, link }: ListHeadingProps) {
  return (
    <View className="w-full mb-4 flex-row items-center justify-between">
      <Text className="text-xl font-sans-bold text-[#081226]">{title}</Text>
      <TouchableOpacity className="border border-[#C6BFA2] py-[10px] px-[14px] rounded-[40px]">
        <Text className="text-[16px] font-sans-semibold">View All</Text>
      </TouchableOpacity>
    </View>
  )
}