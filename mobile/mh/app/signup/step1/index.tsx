import { AppText } from "@/components/app-text";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ADDICTION_OPTIONS = [
    { value: 'alcohol', label: 'Alcohol', icon: 'bottle-wine' },
    { value: 'nicotine', label: 'Nicotine', icon: 'smoking-off' },
    { value: 'gambling', label: 'Gambling', icon: 'cards' },
    { value: 'drug', label: 'Drugs', icon: 'medical-bag' },
];

export default function Step1() {
    const router = useRouter();
    const [value, setValue] = React.useState('alcohol');
    const [isLoading, setIsLoading] = React.useState(false);
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
        await setStorage('addiction', value);
        router.push('/signup/step2');
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
                        <View style={styles.progressActive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                        <View style={styles.progressInactive} />
                    </View>
                    <AppText style={styles.stepText}>Step 1 of 5</AppText>
                </View>

                {/* Main Content */}
                <View style={styles.contentSection}>
                    <View style={styles.headerSection}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="help-circle" size={32} color="#8DFFF0" />
                        </View>
                        <AppText variant="headlineSmall" style={styles.title}>
                            What are you quitting?
                        </AppText>
                        <AppText style={styles.subtitle}>
                            Choose what you'd like to overcome
                        </AppText>
                    </View>

                    {/* Options Card */}
                    <BlurView intensity={20} tint="dark" style={styles.optionsCard}>
                        <LinearGradient
                            colors={['rgba(141,255,240,0.05)', 'rgba(0,180,159,0.08)']}
                            style={styles.cardGradient}
                        />

                        <View style={styles.optionsContainer}>
                            {ADDICTION_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => setValue(option.value)}
                                    style={[
                                        styles.optionItem,
                                        value === option.value && styles.optionItemSelected
                                    ]}
                                >
                                    <BlurView
                                        intensity={value === option.value ? 30 : 15}
                                        tint="dark"
                                        style={styles.optionBlur}
                                    >
                                        <LinearGradient
                                            colors={
                                                value === option.value
                                                    ? ['rgba(20,241,178,0.1)', 'rgba(141,255,240,0.1)']
                                                    : ['rgba(19,65,86,0.3)', 'rgba(19,65,86,0.1)']
                                            }
                                            style={styles.optionGradient}
                                        />

                                        <View style={styles.optionContent}>
                                            <MaterialCommunityIcons
                                                name={option.icon}
                                                size={24}
                                                color={value === option.value ? '#14F1B2' : '#8DFFF0'}
                                            />
                                            <AppText style={[
                                                styles.optionText,
                                                value === option.value && styles.optionTextSelected
                                            ]}>
                                                {option.label}
                                            </AppText>
                                            <View style={[
                                                styles.radioButton,
                                                value === option.value && styles.radioButtonSelected
                                            ]}>
                                                {value === option.value && (
                                                    <View style={styles.radioButtonInner} />
                                                )}
                                            </View>
                                        </View>
                                    </BlurView>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BlurView>
                </View>

                {/* Next Button - Fixed bottom safe area */}
                <View style={[styles.buttonSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={nextBtn}
                        disabled={isLoading}
                    >
                        <LinearGradient
                            colors={['#00B49F', '#14F1B2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <AppText style={styles.buttonText}>
                                {isLoading ? 'Loading...' : 'Continue'}
                            </AppText>
                            <MaterialCommunityIcons
                                name="arrow-right"
                                size={20}
                                color="#0E151A"
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
    optionsCard: {
        borderRadius: 24,
        padding: 24,
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
    optionsContainer: {
        gap: 12,
    },
    optionItem: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    optionItemSelected: {
        shadowColor: '#14F1B2',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    optionBlur: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.1)',
        overflow: 'hidden',
    },
    optionGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    optionText: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#14F1B2',
        fontWeight: '600',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(197,255,248,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#14F1B2',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#14F1B2',
    },
    buttonSection: {
        paddingTop: 20,
        // paddingBottom now handled dynamically above
    },
    nextButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#00B49F',
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
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
});
