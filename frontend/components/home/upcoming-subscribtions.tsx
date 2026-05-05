import { FlatList, View } from "react-native";
import UpcomingCard from "./upcoming-card";
import { UPCOMING_SUBSCRIPTIONS } from "@/constants/data";

export default function UpcomingSubscriptions() {
  return (
    <View className="w-full py-4 px-5 rounded-tr-[20px] rounded-bl-[20px] gap-4">
      <View className="flex-row justify-between items-center gap-4">
        <FlatList 
          data={UPCOMING_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={ ({item}) => <UpcomingCard name={item.name} price={item.price} daysLeft={item.daysLeft} icon={item.icon} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  )
}