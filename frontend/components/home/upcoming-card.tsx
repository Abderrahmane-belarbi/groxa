import { formatCurrency } from "@/lib/utils";
import { Image, ImageSourcePropType, Text, View } from "react-native";

type UpcomingCardProps = {
  name: string;
  icon: ImageSourcePropType;
  price: number;
  daysLeft: number;
}

export default function UpcomingCard({ name, price, daysLeft, icon }: UpcomingCardProps) {
  return (
    <View className="px-[14px] py-5 mr-4 border border-[#C6BFA2] gap-3 rounded-2xl">
      <View className="flex-row items-center gap-[10px]">
        <View className="items-center justify-center size-12 rounded-[10px] bg-[#F6ECC9]">
          <Image
          className="size-8"
            source={icon}
          />
        </View>
        <View>
          <Text className="text-lg font-sans-bold text-[#081226]">{formatCurrency(price)}</Text>
          <Text className="text-sm font-sans-semibold text-[#435875]">{daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}</Text>
        </View>
      </View>
      <Text className="text-lg font-sans-bold text-[#081226] capitalize">{name}</Text>
    </View>
  );
}