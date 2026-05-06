import { formatCurrency, formatSubscriptionDateTime } from "@/lib/utils";
import { Subscription } from "@/types/types";
import { Image, Pressable, Text, View } from "react-native";

export default function SubscriptionCard({
  name,
  category,
  currency,
  paymentMethod,
  plan,
  startDate,
  status,
  renewalDate,
  billing,
  icon,
  price,
  color,
  expanded,
  onPress,
}: Partial<Subscription> & { expanded: boolean; onPress: () => void }) {
  return (
    <Pressable
      className="p-6 mb-4 rounded-tr-3xl rounded-bl-3xl"
      style={{ backgroundColor: expanded ? "#FFFFFF" : color || "#ffffff" }}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between gap-5">
        <View className="flex-row items-center gap-4">
          <Image className="size-8" source={icon} />
          <View className="gap-2">
            <Text className="text-lg font-sans-bold text-[#081226]">
              {name}
            </Text>
            <Text className="text-sm font-sans-semibold text-[#435875]">
              {renewalDate
                ? formatSubscriptionDateTime(renewalDate)
                : "No renewal date"}
            </Text>
          </View>
        </View>
        <View className="gap-2">
          <Text className="text-lg font-sans-bold text-[#081226]">
            {formatCurrency(price || 0)}
          </Text>
          <Text className="text-sm font-sans-medium text-[#435875]">
            {billing}
          </Text>
        </View>
      </View>
      {expanded && (
        <View className="gap-4 mt-4">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-sans-medium text-[#435875]">Category:</Text>
            <Text className="text-sm font-sans-bold text-[#081226]">
              {category}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-sans-medium text-[#435875]">Plan:</Text>
            <Text className="text-sm font-sans-bold text-[#081226]">{plan}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-sans-medium text-[#435875]">Payment Method:</Text>
            <Text className="text-sm font-sans-bold text-[#081226]">
              {paymentMethod}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-sans-medium text-[#435875]">Start Date:</Text>
            <Text className="text-sm font-sans-bold text-[#081226]">
              {formatSubscriptionDateTime(startDate)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-sans-medium text-[#435875]">Status:</Text>
            <Text className="text-sm font-sans-bold text-[#081226]">
              {status}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-sans-medium text-[#435875]">Currency:</Text>
            <Text className="text-sm font-sans-bold text-[#081226]">
              {currency}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
