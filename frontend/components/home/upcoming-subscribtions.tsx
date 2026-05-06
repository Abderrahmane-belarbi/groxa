import { FlatList, Text, View } from "react-native";
import UpcomingCard from "./upcoming-card";
import { UPCOMING_SUBSCRIPTIONS } from "@/constants/data";

export default function UpcomingSubscriptions() {
  return (
    <View className="w-full rounded-tr-[20px] rounded-bl-[20px] gap-4">
      <View className="flex-row justify-between items-center">
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="w-4" />}
          renderItem={({ item }) => (
            <UpcomingCard
              name={item.name}
              price={item.price}
              daysLeft={item.daysLeft}
              icon={item.icon}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="py-4 text-sm font-sans-medium text-black/60">
              No upcoming renewals yet.
            </Text>
          }
        />
      </View>
    </View>
  );
}
