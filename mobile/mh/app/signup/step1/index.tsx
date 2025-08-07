import { AppText } from "@/components/app-text";
import { AppView } from "@/components/app-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "expo-router";
import React from 'react';
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import { Button, RadioButton } from "react-native-paper";



export default function Step1() {
    const navigation = useNavigation();
    const [value, setValue] = React.useState('alcohol');
    const setStorage = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };
    const nextBtn = async () => {
        await setStorage('addiction', value);
        navigation.navigate('step2');
    }
    return (
        <AppView style={styles.container}>
            <View style={styles.flexItemTop}>
                <View style={styles.roundActive} />
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.round} />
            </View>
            <AppText variant="headlineSmall" style={styles.textCenter} >What are you quitting?</AppText>
            <RadioButton.Group
                onValueChange={value => setValue(value)}
                value={value}>
                <View style={styles.padItem} >
                    <Pressable android_ripple={{ color: '#14F1B2' }} onPress={() => setValue('alcohol')} style={styles.flexItem}>
                        <RadioButton value="alcohol" color="#14F1B2" />
                        <AppText style={styles.textColor}>Alcohol</AppText>
                    </Pressable>
                    <Pressable android_ripple={{ color: '#14F1B2' }} onPress={() => setValue('nicotine')} style={styles.flexItem}>
                        <RadioButton value="nicotine" color="#14F1B2" />
                        <AppText style={styles.textColor}>Nicotine</AppText>
                    </Pressable>
                    <Pressable android_ripple={{ color: '#14F1B2' }} onPress={() => setValue('gambling')} style={styles.flexItem}>
                        <RadioButton value="gambling" color="#14F1B2" />
                        <AppText style={styles.textColor}>Gambling</AppText>
                    </Pressable>
                    <Pressable android_ripple={{ color: '#14F1B2' }} onPress={() => setValue('drug')} style={styles.flexItem}>
                        <RadioButton value="drug" color="#14F1B2" />
                        <AppText style={styles.textColor}>Drugs</AppText>
                    </Pressable>
                </View>
            </RadioButton.Group>
            <View>
                <Button
                    mode="contained"
                    onPress={() => nextBtn()}
                    style={{ margin: 8, backgroundColor: '#14F1B2', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center' }}
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