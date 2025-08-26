import { AppText } from "@/components/app-text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Step4() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const setStorage = async (key, val) => {
        try {
            await AsyncStorage.setItem(key, val);
        } catch (e) { console.log(e); }
    };

    const nextBtn = async () => {
        if (!value.trim()) return;
        setIsLoading(true);
        await setStorage("username", value.trim());
        router.push("/signup/linkwallet");
        setIsLoading(false);
    };

    return (
        <LinearGradient
            colors={["#0E151A", "#134156", "#0E151A"]}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressActive} />
                        <View style={styles.progressInactive} />
                    </View>
                    <AppText style={styles.stepText}>Step 4 of 5</AppText>
                </View>

                {/* Header */}
                <View style={styles.headerSection}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name="account-circle-outline"
                            size={32}
                            color="#8DFFF0"
                        />
                    </View>
                    <AppText variant="headlineSmall" style={styles.title}>
                        Choose a username
                    </AppText>
                    <AppText style={styles.subtitle}>
                        This will identify you in the community
                    </AppText>
                </View>

                {/* Input Card */}
                <BlurView intensity={20} tint="dark" style={styles.inputCard}>
                    <LinearGradient
                        colors={["rgba(141,255,240,0.05)", "rgba(0,180,159,0.08)"]}
                        style={styles.cardGradient}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Your username"
                        placeholderTextColor="rgba(197,255,248,0.6)"
                        value={value}
                        onChangeText={setValue}
                        maxLength={20}
                    />
                </BlurView>

                {/* Next Button */}
                <View style={[styles.buttonSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TouchableOpacity
                        style={[styles.nextButton, (!value.trim() || isLoading) && styles.nextButtonDisabled]}
                        onPress={nextBtn}
                        disabled={!value.trim() || isLoading}
                    >
                        <LinearGradient
                            colors={
                                value.trim()
                                    ? ["#00B49F", "#14F1B2"]
                                    : ["rgba(0,180,159,0.3)", "rgba(20,241,178,0.3)"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <AppText style={[
                                styles.buttonText,
                                (!value.trim() || isLoading) && styles.buttonTextDisabled
                            ]}>
                                {isLoading ? "Saving..." : "Continue"}
                            </AppText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, paddingHorizontal: 20 },
    progressSection: { alignItems: "center", paddingTop: 20, paddingBottom: 30 },
    progressContainer: { flexDirection: "row", gap: 12, marginBottom: 8 },
    progressActive: {
        width: 32, height: 6, backgroundColor: "#14F1B2",
        borderRadius: 3, shadowColor: "#14F1B2",
        shadowOpacity: 0.5, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }
    },
    progressInactive: {
        width: 12, height: 6, backgroundColor: "rgba(197,255,248,0.3)",
        borderRadius: 3
    },
    stepText: { color: "#C5FFF8", fontSize: 14, opacity: 0.8 },
    headerSection: { alignItems: "center", marginBottom: 32 },
    iconContainer: {
        width: 64, height: 64, backgroundColor: "rgba(141,255,240,0.1)",
        borderRadius: 32, justifyContent: "center", alignItems: "center",
        marginBottom: 16, borderWidth: 1, borderColor: "rgba(141,255,240,0.2)"
    },
    title: {
        color: "#8DFFF0", textAlign: "center",
        marginBottom: 8, fontSize: 24, fontWeight: "bold"
    },
    subtitle: {
        color: "#C5FFF8", textAlign: "center",
        fontSize: 16, opacity: 0.8
    },
    inputCard: {
        borderRadius: 24, padding: 24, marginBottom: 16,
        borderWidth: 1, borderColor: "rgba(197,255,248,0.15)",
        backgroundColor: "rgba(19,65,86,0.3)", overflow: "hidden"
    },
    cardGradient: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0
    },
    textInput: {
        backgroundColor: "rgba(19,65,86,0.4)", color: "#FFFFFF",
        borderRadius: 16, padding: 16, fontSize: 16
    },
    buttonSection: { paddingTop: 20 },
    nextButton: {
        borderRadius: 16, overflow: "hidden",
        shadowColor: "#00B49F", shadowOpacity: 0.4,
        shadowRadius: 12, shadowOffset: { width: 0, height: 4 }
    },
    nextButtonDisabled: {
        shadowOpacity: 0.1
    },
    buttonGradient: {
        alignItems: "center", justifyContent: "center",
        paddingVertical: 16, paddingHorizontal: 24
    },
    buttonText: {
        fontSize: 16, fontWeight: "bold", color: "#0E151A"
    },
    buttonTextDisabled: {
        color: "rgba(14,21,26,0.5)"
    }
});
