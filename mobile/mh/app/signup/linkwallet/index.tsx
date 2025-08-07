import { AppText } from "@/components/app-text";
import { AppView } from "@/components/app-view";
import { useAuth } from "@/components/auth/auth-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from 'react';
import { StatusBar, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";


export default function LinkWallet() {
    const { signIn, isLoading } = useAuth(); // Assuming you have a useAuth hook to manage authentication state
    const sendData = async () => {
        const addiciton = await AsyncStorage.getItem('addiction');
        const reason = await AsyncStorage.getItem('reason');
        const date = await AsyncStorage.getItem('date');
        const username = await AsyncStorage.getItem('username');
        console.log(addiciton, reason, date);
        const signInData = await signIn();
        if (!signInData.publicKey) return console.log('No public key found');
        const dataObj = {
            addiction: addiciton,
            reason: reason,
            date: date,
            id: signInData?.publicKey.toString(),
            username: username,
        }
        console.log(dataObj);
        console.log(JSON.stringify(dataObj));
        const response = await fetch('http://192.168.1.132:3000/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj),
        })
        const data = await response.json();
        console.log(data);
        if (data.success) {
            console.log('Data sent successfully');
        }
        else {
            console.log('Error sending data');
        }
    }
    const nextBtn = async () => {
        await sendData();
        router.push('/main/home');
    }
    return (
        <AppView style={styles.container}>
            <View style={styles.flexItemTop}>
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.roundActive} />
            </View>
            <AppText variant="headlineSmall" style={styles.textCenter} >Link your Solana wallet!</AppText>
            <AppText variant="titleMedium" style={styles.textCenter} >One last step: connect your favorite wallet!</AppText>
            <Button
                mode="contained"
                onPress={() => nextBtn()}
                style={{ margin: 16, backgroundColor: '#14F1B2' }}
            ><AppText>Link Wallet</AppText></Button>
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
    padItem: {
        padding: 8
    },
    bottomButton: {

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
