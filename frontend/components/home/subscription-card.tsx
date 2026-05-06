import { formatCurrency, formatSubscriptionDateTime } from "@/lib/utils";
import { Subscription } from "@/types/types";
import { Image, Text, View } from "react-native";

export default function SubscriptionCard({ name, renewalDate, billing, icon, price, color }: Partial<Subscription>) {
  return (
    <View 
      className={`p-6 mb-4 rounded-tr-3xl rounded-bl-3xl flex-row items-center justify-between gap-5`}
      style={{ backgroundColor: color || '#ffffff' }}
    >
      <View className="flex-row items-center gap-4">
        <Image
          className="size-8"
          source={icon}
        />
        <View className="gap-2">
          <Text className="text-lg font-sans-bold text-[#081226]">{name}</Text>
          <Text className="text-sm font-sans-semibold text-[#435875]">{renewalDate ? formatSubscriptionDateTime(renewalDate) : 'No renewal date'}</Text>
        </View>
      </View>
      <View className="gap-2">
        <Text className="text-lg font-sans-bold text-[#081226]">{formatCurrency(price || 0)}</Text>
        <Text className="text-sm font-sans-medium text-[#435875]">{billing}</Text>
      </View>
    </View>
  );
}