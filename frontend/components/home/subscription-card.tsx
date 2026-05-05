import { formatCurrency } from "@/lib/utils";
import { Subscription } from "@/types/types";
import { Image, Text, View } from "react-native";

export default function SubscriptionCard({ name, startDate, renewalDate, icon, price, color }: Partial<Subscription>) {
  return (
    <View className={`bg-[${color}] p-5 rounded-tr-[20px] rounded-bl-[20px] flex-row items-center justify-between gap-5`}>
      <View className="flex-row items-center gap-2">
        <Image
          className="size-8"
          source={icon}
        />
        <View className="gap-5">
          <Text className="text-lg font-sans-bold text-[#081226]">{name}</Text>
          <Text className="text-sm font-sans-semibold text-[#435875]">{startDate}</Text>
        </View>
      </View>
      <View className="gap-5">
        <Text className="text-lg font-sans-bold text-[#081226]">{formatCurrency(price || 0)}</Text>
        <Text className="text-sm font-sans-medium text-[#435875]">{renewalDate}</Text>
      </View>
    </View>
  );
}