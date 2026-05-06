import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { FlatList, Text, View } from "react-native";
import SubscriptionCard from "./subscription-card";
import { useState } from "react";

export default function SubscriptionsList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <FlatList
      scrollEnabled={false}
      data={HOME_SUBSCRIPTIONS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SubscriptionCard {...item} expanded={expandedId === item.id} onPress={() => setExpandedId(expandedId === item.id ? null : item.id)} />
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
