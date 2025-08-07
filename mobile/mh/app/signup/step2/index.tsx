import { AppText } from "@/components/app-text";
import { AppView } from "@/components/app-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function Step2() {
    const navigation = useNavigation();
    const [value, setValue] = React.useState('');
    const setStorage = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };
    const nextBtn = async () => {
        await setStorage('reason', value);
        navigation.navigate('step3');
    }
    return (
        <AppView style={styles.container}>
            <View style={styles.flexItemTop}>
                <View style={styles.round} />
                <View style={styles.roundActive} />
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.round} />
            </View>
            <AppText variant="headlineSmall" style={styles.textCenter} >What is your reason?</AppText>
            <View style={styles.padItem}>
                <TextInput onChangeText={(text) => setValue(text)} underlineColorAndroid="transparent" placeholderTextColor={'gray'} textColor="#fff" outlineColor="#134156" multiline={true} numberOfLines={5} mode="outlined" placeholder="My reason is..." style={styles.textarea} />
            </View>
            <View>
                <Button
                    mode="contained"
                    onPress={() => nextBtn()}
                    style={{ margin: 16, backgroundColor: '#14F1B2' }}
                >
                    <AppText>Next</AppText>
                </Button>
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
        color: "#ffffff"
    },
    container: {
        backgroundColor: '#0E151A',
        height: '100%',
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        paddingTop: StatusBar.currentHeight
    },
    flexItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#14F1B2',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 6,

    },
    padItem: {
        padding: 8
    },
    bottomButton: {

    },
    textarea: {
        height: 180, // Adjust as needed
        borderColor: '#134156',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        fontSize: 16,
        textAlignVertical: 'top',
        marginTop: 16,
        backgroundColor: '#0E151A',
        color: '#ffffff',
    },
    flexItemTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,

        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 6,

    },
    round: {
        borderRadius: 50,
        width: 8,
        height: 8,
        backgroundColor: '#134156'
    },
    roundActive: {
        borderRadius: 50,
        width: 8,
        height: 8,
        backgroundColor: '#14F1B2'
    }
})