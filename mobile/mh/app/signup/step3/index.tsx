import { AppText } from "@/components/app-text";
import { AppView } from "@/components/app-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { Button } from "react-native-paper";

export default function Step3() {
    const [selected, setSelected] = useState('');
    const [value, setValue] = useState('');
    const navigation = useNavigation();
    const setStorage = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };
    const nextBtn = async () => {
        console.log(value);
        await setStorage('startDate', value);
        navigation.navigate('step4');
    }
    return (
        <AppView style={styles.container}>
            <View style={styles.flexItemTop}>
                <View style={styles.round} />
                <View style={styles.round} />
                <View style={styles.roundActive} />
                <View style={styles.round} />
                <View style={styles.round} />
            </View>
            <AppText variant="headlineSmall" style={styles.textCenter} >When did you start sobrierty?</AppText>
            <Calendar
                onDayPress={day => { setValue(day.dateString); setSelected(day.dateString); }}
                markedDates={{
                    [selected]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedDotColor: 'orange',
                    },
                }}
                style={{
                    height: 350,
                    backgroundColor: '#0E151A',
                }}
                theme={{
                    backgroundColor: '#0E151A',
                    calendarBackground: '#0E151A',
                    textSectionTitleColor: '#ffffff',
                    selectedDayBackgroundColor: '#14F1B2',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#ffffff',
                    dayTextColor: '#ffffff',
                    textDisabledColor: '#555555',
                    arrowColor: '#14F1B2',
                    monthTextColor: '#ffffff',
                }}
            />
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