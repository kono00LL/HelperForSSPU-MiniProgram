import { initWechat } from "@/Utils/wechat";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout() {
  useEffect(() => {
    initWechat();
  }, []);
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
