import { Text, View } from "react-native";

export default function Login() {
  return (
    <View>
      <Text className="text-gray-500">Login</Text>
      <Text className="text-gray-100">
        Don't have an account? <Text className="text-blue-500">Sign up</Text>
      </Text>
    </View>
  );
}
