import { Tabs } from "expo-router";
import {
  Image,
  ImageBackground,
  Text,
  View,
} from "react-native";
//@ts-ignore
import { icons } from "@/constants/icons";

function TabIcon({ focused, icon, title }: any) {
  if (focused) {
    return (
      <View className="bg-blue-500">
        <ImageBackground className="flex flex-1 size-full justify-center items-center">
          <Image source={icon} className="size-6"></Image>
          <Text className=" text-base font-semibold">
            {title}
          </Text>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View className="flex flex-1 size-full justify-center items-center">
      <Image source={icon} className="size-6" />
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
        /**
         * 导航栏应该是375*48，icon是24*24，文字是16，加上文字是24*40，
         */
        tabBarStyle: {
          backgroundColor: "#DCDCDC",
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
              icon={icons.home}
              title="发布"
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
    </Tabs>
  );
}
