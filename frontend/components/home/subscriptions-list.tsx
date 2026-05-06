import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { FlatList, Text, View } from "react-native";
import SubscriptionCard from "./subscription-card";

export default function SubscriptionsList() {
  return (
    <FlatList
      scrollEnabled={false}
      data={HOME_SUBSCRIPTIONS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SubscriptionCard {...item} expanded={false} onPress={() => {}} />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="py-4">
          <Text className="text-sm font-sans-medium text-black/60">
            No subscriptions found.
          </Text>
        </View>
      }
    />
  );
}
