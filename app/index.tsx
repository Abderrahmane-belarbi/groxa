import { Link } from "expo-router";
import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-800 mb-10">
        Edit <Text className="text-blue-500 text-3xl">app/index.tsx</Text> to
        get started!
      </Text>
      <Link href={"/login"}>Go to Login</Link>
      <Link href={"/register"} style={{ marginTop: 20 }}>
        Go to Sign up
      </Link>
    </View>
  );
}
