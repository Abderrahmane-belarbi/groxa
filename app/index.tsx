import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen....</Text>
      <Link href={"/login"} style={{ marginTop: 20 }}>
        Go to Login
      </Link>
      <Link href={"/register"} style={{ marginTop: 20 }}>
        Go to Sign up
      </Link>
    </View>
  );
}
