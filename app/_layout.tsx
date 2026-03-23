import { initWechat } from "@/Utils/wechat";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./globals.css";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'OPPOSans-Light': require('@/assets/OPPOSans Light.ttf'),
    'OPPOSans-Regular': require('@/assets/OPPOSans Regular.ttf'),
    'OPPOSans-Bold': require('@/assets/OPPOSans Bold.ttf'),
  });

  useEffect(() => {
    initWechat();
  }, []);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="posts/[post_id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="users/[user_id]"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}
