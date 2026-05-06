import BalanceCard from "@/components/home/balance-card";
import HomeHeader from "@/components/home/home-header";
import SubscriptionsList from "@/components/home/subscriptions-list";
import UpcomingSubscriptions from "@/components/home/upcoming-subscribtions";
import ListHeading from "@/components/shared/list-heading";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center p-4 bg-[#FFF7E5]" >
      <HomeHeader />
      <BalanceCard balance={1250.5} date={new Date()} />
      <View className="w-full mt-4 mb-2">
        <ListHeading title="Upcoming" link="/subscriptions" />
        <UpcomingSubscriptions />
      </View>
      <View className="w-full mt-4 mb-2">
        <ListHeading title="All Subscriptions" link="/subscriptions" />
        <SubscriptionsList />
      </View>
    </SafeAreaView>
  );
}
