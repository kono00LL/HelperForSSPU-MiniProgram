import { SplashScreen, Tabs } from "expo-router";
import {
  Image,
  ImageBackground,
  Text,
  View,
} from "react-native";
//@ts-ignore
import { icons } from "@/constants/icons";
import { useFonts } from 'expo-font';
import { useEffect } from "react";
SplashScreen.preventAutoHideAsync();

function TabIcon({ focused, icon, title, size = 24 }: any) {
  const [loaded] = useFonts({
    'OPPOSans-Light': require('@/assets/OPPOSans Light.ttf'),
    'OPPOSans-Regular': require('@/assets/OPPOSans Regular.ttf'),
    'OPPOSans-Bold': require('@/assets/OPPOSans Bold.ttf'),
  });
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  
  if (focused) {
    return (
      <View >
        <ImageBackground className="flex flex-1 size-full justify-center items-center">
          <Image source={icon} style={{ width: size, height: size }}></Image>
          <Text className=" text-base font-semibold">
            {title}
          </Text>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View className="flex flex-1 size-full justify-center items-center">
      <Image source={icon} style={{ width: size, height: size }} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },


        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderRadius: 5,
          marginHorizontal: 0,
          marginBottom: 0,
          paddingTop: 4,
          height: 48 + 16,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.home}
              title="首页"
              className="size-5"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="exchange"
        options={{
          title: "Exchange",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.global}
              title="交流"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.post}
              title="发布"
              size={30}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.message}
              title="消息"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.profile}
              title="个人"
            />
          ),
        }}
      />


      {/* <Tabs.Screen
        name="wechat-test"
        options={{
          title: "WechatTest",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.profile}
              title="WechatTest"
            />
          ),
        }}
      /> */}
    </Tabs>

  );
}
