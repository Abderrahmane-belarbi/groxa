import { tabs } from "@/constants/data";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, 20),
          height: 70,
          marginHorizontal: 20,
          borderRadius: 32,
          backgroundColor: "#111",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarIconStyle: {
            width: 48,
            height: 48,
            alignItems: "center",
          }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
      <Tabs.Screen name="subscriptions/[id]" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ focused, icon }: { focused: boolean; icon: string }) {
  return (
    <View className="size-12 items-center justify-center">
      <View
        className={`size-12 items-center justify-center rounded-full bg-transparent ${focused && "#fff"}`}
      >
        <Image src={icon} resizeMode="contain" className="size-6" />
      </View>
    </View>
  );
}
