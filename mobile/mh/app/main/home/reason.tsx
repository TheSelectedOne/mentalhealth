import { AppText } from "@/components/app-text";
import { AppView } from "@/components/app-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View } from "react-native";

const Reason = () => {
    const reasonText = async () => await AsyncStorage.getItem('reason');
    return (
        <AppView style={styles.container}>
            <AppText variant="headlineSmall" style={styles.textColor} >Remember your reason</AppText>
            <View style={styles.card}>
                <AppText variant="titleMedium" style={styles.textColor} >{reasonText()}</AppText>
            </View>
        </AppView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        marginTop: 24,
    },
    card: {
        backgroundColor: "#00B49F",
        padding: 24,
        borderRadius: 12,
    },
    textColor: {
        color: "#ffffff"
    },
})

export default Reason