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
      <Text>Welcome to Groxa!</Text>
      <Link href={"/(auth)/sign-in"}>Login</Link>
      <Link href={"/(auth)/sign-up"} style={{ marginTop: 20 }}>
        Sign up
      </Link>
    </View>
  );
}
