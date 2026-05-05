import { formatCurrency } from "@/lib/utils";
import { Text, View } from "react-native";
import dayjs from "dayjs";

type BalanceCardProps = {
  balance: number;
  date: Date;
};

export default function BalanceCard({ balance, date }: BalanceCardProps) {
  return (
    <View className="w-full bg-[#EA7A53] py-[26px] px-5 rounded-tr-[20px] rounded-bl-[20px] gap-4">
      <Text className="text-xl font-sans-semibold text-white">Balance</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-3xl font-sans-extrabold text-white">{formatCurrency(balance)}</Text>
        <Text className="font-sans-semibold text-xl text-white">{dayjs(date).format("DD/MM")}</Text>
      </View>
    </View>
  );
}
