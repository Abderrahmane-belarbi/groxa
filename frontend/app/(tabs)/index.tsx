import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {

  return (
    <SafeAreaView className="flex-1 justify-center items-center" >
      <Text className="text-2xl font-bold">Welcome to Groxa!</Text>
      <View className="gap-2 my-4">
        <Link href={"/(auth)/sign-in"}>Login</Link>
        <Link href={"/(auth)/sign-up"}>Sign up</Link>
      </View>
    </SafeAreaView>
  );
}
