import { Redirect, Stack } from "expo-router";
export default function AuthLayout() {
  const isSignedIn = true;
  if (isSignedIn) {
        return <Redirect href="/(tabs)" />;
    }
  return <Stack/>;
}
