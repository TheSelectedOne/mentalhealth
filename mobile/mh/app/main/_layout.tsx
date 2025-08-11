import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#134156",
                    // borderTopWidth: 0,
                    // height: 66,
                    // paddingBottom: 8,
                    // paddingTop: 8,
                },
                tabBarActiveTintColor: "#14F1B2",
                tabBarInactiveTintColor: "#7daabb",
            }}
        >
            <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "home" : "home-outline"}
                            color={color}
                            size={size ?? 24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    tabBarLabel: "Community",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "people" : "people-outline"}
                            color={color}
                            size={size ?? 24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather
                            name="user"
                            color={color}
                            size={size ?? 24}
                            style={{ opacity: focused ? 1 : 0.6 }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="milestones"
                options={{
                    tabBarLabel: "Milestones",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather
                            name='award'
                            color={color}
                            size={size ?? 24}
                            style={{ opacity: focused ? 1 : 0.6 }}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
