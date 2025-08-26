import { AppText } from "@/components/app-text";
import { useAuth } from "@/components/auth/auth-provider";
import { API_URL } from "@/constants/app-config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function LinkWallet() {
    const { signIn, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const sendData = async () => {
        const addiction = await AsyncStorage.getItem("addiction");
        const reason = await AsyncStorage.getItem("reason");
        const startDate = await AsyncStorage.getItem("startDate");
        const username = await AsyncStorage.getItem("username");
        const signInData = await signIn();
        if (!signInData.publicKey) throw new Error("No public key");
        const dataObj = {
            addiction,
            reason,
            date: startDate,
            id: signInData.publicKey.toString(),
            username
        };
        const response = await fetch(API_URL + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObj)
        });
        return response.json();
    };

    const nextBtn = async () => {
        setLoading(true);
        try {
            const data = await sendData();
            if (data.success) router.push("/main/home");
            else console.log("Error sending data", data);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };

    return (
        <LinearGradient
            colors={["#0E151A", "#134156", "#0E151A"]}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top || StatusBar.currentHeight }]}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressActive} />
                    </View>
                    <AppText style={styles.stepText}>Step 5 of 5</AppText>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                    <View style={styles.headerSection}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="wallet" size={32} color="#8DFFF0" />
                        </View>
                        <AppText variant="headlineSmall" style={styles.title}>
                            Link Your Wallet
                        </AppText>
                        <AppText style={styles.subtitle}>
                            Connect your Solana wallet to complete sign-up
                        </AppText>
                    </View>

                    <BlurView intensity={20} tint="dark" style={styles.card}>
                        <LinearGradient
                            colors={["rgba(141,255,240,0.05)", "rgba(0,180,159,0.08)"]}
                            style={StyleSheet.absoluteFill}
                        />
                        <AppText style={styles.cardText}>
                            We use your wallet address to secure your account and enable features.
                        </AppText>
                    </BlurView>
                </View>

                {/* Button */}
                <View style={[styles.buttonSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TouchableOpacity
                        style={[styles.nextButton, (loading || authLoading) && styles.nextButtonDisabled]}
                        onPress={nextBtn}
                        disabled={loading || authLoading}
                    >
                        <LinearGradient
                            colors={loading || authLoading ? ["rgba(0,180,159,0.3)", "rgba(20,241,178,0.3)"] : ["#00B49F", "#14F1B2"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <AppText style={[styles.buttonText, (loading || authLoading) && styles.buttonTextDisabled]}>
                                {loading || authLoading ? "Linking..." : "Link Wallet"}
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
        width: 32,
        height: 6,
        backgroundColor: "#14F1B2",
        borderRadius: 3,
        shadowColor: "#14F1B2",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 }
    },
    progressInactive: {
        width: 12,
        height: 6,
        backgroundColor: "rgba(197,255,248,0.3)",
        borderRadius: 3
    },
    stepText: { color: "#C5FFF8", fontSize: 14, opacity: 0.8 },
    contentSection: { flex: 1, justifyContent: "center" },
    headerSection: { alignItems: "center", marginBottom: 32 },
    iconContainer: {
        width: 64,
        height: 64,
        backgroundColor: "rgba(141,255,240,0.1)",
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(141,255,240,0.2)"
    },
    title: {
        color: "#8DFFF0",
        textAlign: "center",
        marginBottom: 8,
        fontSize: 24,
        fontWeight: "bold"
    },
    subtitle: {
        color: "#C5FFF8",
        textAlign: "center",
        fontSize: 16,
        opacity: 0.8
    },
    card: {
        borderRadius: 24,
        padding: 24,
        backgroundColor: "rgba(19,65,86,0.3)",
        borderWidth: 1,
        borderColor: "rgba(197,255,248,0.15)",
        overflow: "hidden"
    },
    cardText: {
        color: "#C5FFF8",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 22
    },
    buttonSection: { paddingTop: 20 },
    nextButton: {
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#00B49F",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 }
    },
    nextButtonDisabled: { shadowOpacity: 0.1 },
    buttonGradient: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 24
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0E151A"
    },
    buttonTextDisabled: { color: "rgba(14,21,26,0.5)" }
});
