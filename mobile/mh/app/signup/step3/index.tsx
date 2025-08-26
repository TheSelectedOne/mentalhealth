import { AppText } from "@/components/app-text";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Step3() {
    const [selected, setSelected] = useState('');
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const setStorage = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };

    const nextBtn = async () => {
        setIsLoading(true);
        await setStorage('startDate', value);
        router.push('/signup/step4');
        setIsLoading(false);
    };

    return (
        <LinearGradient
            colors={['#0E151A', '#134156', '#0E151A']}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Progress Indicator */}
                <View style={styles.progressSection}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressActive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                    </View>
                    <AppText style={styles.stepText}>Step 3 of 5</AppText>
                </View>

                {/* Main Content */}
                <View style={styles.contentSection}>
                    <View style={styles.headerSection}>

                        <AppText variant="headlineSmall" style={styles.title}>
                            When did you start?
                        </AppText>
                        <AppText style={styles.subtitle}>
                            Select the date you began your journey
                        </AppText>
                    </View>

                    {/* Calendar Card */}
                    <BlurView intensity={20} tint="dark" style={styles.calendarCard}>
                        <LinearGradient
                            colors={['rgba(141,255,240,0.05)', 'rgba(0,180,159,0.08)']}
                            style={styles.cardGradient}
                        />

                        <Calendar
                            onDayPress={day => {
                                setValue(day.dateString);
                                setSelected(day.dateString);
                            }}
                            markedDates={{
                                [selected]: {
                                    selected: true,
                                    disableTouchEvent: true,
                                    selectedColor: '#14F1B2',
                                    selectedTextColor: '#0E151A',
                                },
                            }}
                            maxDate={new Date().toISOString().split('T')[0]} // Can't select future dates
                            style={styles.calendar}
                            theme={{
                                backgroundColor: 'transparent',
                                calendarBackground: 'transparent',
                                textSectionTitleColor: '#8DFFF0',
                                textSectionTitleDisabledColor: 'rgba(141,255,240,0.5)',
                                selectedDayBackgroundColor: '#14F1B2',
                                selectedDayTextColor: '#0E151A',
                                todayTextColor: '#00B49F',
                                dayTextColor: '#FFFFFF',
                                textDisabledColor: 'rgba(255,255,255,0.3)',
                                arrowColor: '#14F1B2',
                                monthTextColor: '#8DFFF0',
                                indicatorColor: '#14F1B2',
                                textDayFontWeight: '500',
                                textMonthFontWeight: '600',
                                textDayHeaderFontWeight: '600',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14,
                            }}
                        />
                    </BlurView>

                    {/* Selected Date Display */}
                    {selected && (
                        <BlurView intensity={15} tint="dark" style={styles.selectedDateCard}>
                            <View style={styles.selectedDateContent}>
                                <MaterialCommunityIcons name="check-circle" size={20} color="#14F1B2" />
                                <AppText style={styles.selectedDateText}>
                                    Journey started: {new Date(selected).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </AppText>
                            </View>
                        </BlurView>
                    )}
                </View>

                {/* Next Button */}
                <View style={[styles.buttonSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TouchableOpacity
                        style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
                        onPress={nextBtn}
                        disabled={isLoading || !selected}
                    >
                        <LinearGradient
                            colors={
                                selected
                                    ? ['#00B49F', '#14F1B2']
                                    : ['rgba(0,180,159,0.3)', 'rgba(20,241,178,0.3)']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <AppText style={[
                                styles.buttonText,
                                !selected && styles.buttonTextDisabled
                            ]}>
                                {isLoading ? 'Saving...' : 'Continue'}
                            </AppText>
                            <MaterialCommunityIcons
                                name="arrow-right"
                                size={20}
                                color={selected ? '#0E151A' : 'rgba(14,21,26,0.5)'}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    progressSection: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    progressActive: {
        width: 32,
        height: 6,
        backgroundColor: '#14F1B2',
        borderRadius: 3,
        shadowColor: '#14F1B2',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    progressInactive: {
        width: 12,
        height: 6,
        backgroundColor: 'rgba(197,255,248,0.3)',
        borderRadius: 3,
    },
    stepText: {
        color: '#C5FFF8',
        fontSize: 14,
        opacity: 0.8,
    },
    contentSection: {
        flex: 1,
        justifyContent: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        backgroundColor: 'rgba(141,255,240,0.1)',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    title: {
        color: '#8DFFF0',
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#C5FFF8',
        textAlign: 'center',
        fontSize: 16,
        opacity: 0.8,
    },
    calendarCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.15)',
        backgroundColor: 'rgba(19,65,86,0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    calendar: {
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    selectedDateCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(20,241,178,0.2)',
        backgroundColor: 'rgba(20,241,178,0.05)',
        overflow: 'hidden',
    },
    selectedDateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectedDateText: {
        color: '#14F1B2',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    buttonSection: {
        paddingTop: 20,
    },
    nextButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#00B49F',
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    nextButtonDisabled: {
        shadowOpacity: 0.1,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0E151A',
    },
    buttonTextDisabled: {
        color: 'rgba(14,21,26,0.5)',
    },
});
