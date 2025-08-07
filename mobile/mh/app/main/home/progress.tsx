import { AppText } from "@/components/app-text";
import { AppView } from "@/components/app-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ProgressBar } from "react-native-paper";

const Progress = () => {
    const getAddiction = async () => await AsyncStorage.getItem('addiction');
    const startDate = new Date('2025-07-01'); // Replace with actual start date
    const today = new Date();
    const timeDiff = today.getTime() - startDate.getTime();
    const days = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

    const [daysElapsed, setDaysElapsed] = useState(null);

    useEffect(() => {
        const calculateTimeElapsed = async () => {
            // Load date string from AsyncStorage
            const storedDateStr = await AsyncStorage.getItem('startDate'); // Change to your key
            if (storedDateStr) {
                // Parse date string to Date object (YYYY-MM-DD format works)
                const storedDate = new Date(storedDateStr);
                const now = new Date();
                // Calculate time difference in milliseconds
                const diffMs = now - storedDate;
                // Convert ms to days (1 day = 24 * 60 * 60 * 1000)
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                setDaysElapsed(diffDays);
            }
        };
        calculateTimeElapsed();
    }, []);


    return (
        <AppView>
            <AppText style={styles.textColor} >You've been {getAddiction()} free for</AppText>
            <AppText variant="headlineMedium" style={[styles.textColor, styles.fontBold]} >{daysElapsed} Days!</AppText>
            <View style={styles.container}>
                <AppText variant="titleMedium" style={[styles.textColor, styles.fontBold, styles.textLeft]}>Next Milestone: 1000 Days</AppText>
                <ProgressBar style={styles.bar} progress={daysElapsed / 1000} color="#14F1B2" />
                <AppText style={styles.goingText}>Keep going!</AppText>
            </View>

        </AppView>
    )
}

const styles = StyleSheet.create({
    textCenter: {
        textAlign: "center",
        color: "#ffffff"
    },
    textColor: {
        color: "#ffffff",
        textAlign: "center",
    },
    fontBold: {
        fontWeight: 'bold',
    },
    textLeft: {
        textAlign: "left",
    },
    container: {
        padding: 24,
    },
    bar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00B49F',
        marginVertical: 16,
    },
    goingText: {
        color: '#14F1B2',
    }
})

export default Progress