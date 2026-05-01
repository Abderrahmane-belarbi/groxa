import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function SignUp() {
    return (
        <View>
            <Text>Sign Up</Text>
            <Link href={"/(auth)/sign-in"}>You have an account? Sign in</Link>
        </View>
    )
}