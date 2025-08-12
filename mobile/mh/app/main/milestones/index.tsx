import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BOX_SIZE = (width - 60) / 2;  // two columns with 20px padding and 20px gap
const MILESTONES = [
    { days: 30, label: '30 Days', image: require('./icon.png') },
    { days: 60, label: '60 Days', image: require('./icon.png') },
    { days: 90, label: '90 Days', image: require('./icon.png') },
    { days: 180, label: '180 Days', image: require('./icon.png') },
    { days: 365, label: '365 Days', image: require('./icon.png') },
];

export default function MilestonesScreen() {
    const [daysFree, setDaysFree] = useState(0);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        (async () => {
            const startDateStr = await AsyncStorage.getItem('startDate');
            if (startDateStr) {
                const start = new Date(startDateStr);
                const now = new Date();
                const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
                setDaysFree(diff);
            }
        })();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={['#0E151A', '#134156', '#0E151A']}
                style={StyleSheet.absoluteFill}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Milestones</Text>
                <Text style={styles.subheader}>
                    Celebrate each step of your journey
                </Text>

                <View style={styles.grid}>
                    {MILESTONES.map((m) => {
                        const unlocked = daysFree >= m.days;
                        return (
                            <BlurView
                                key={m.days}
                                tint="dark"
                                intensity={50}
                                style={[styles.box, unlocked && styles.boxUnlocked]}
                            >
                                <LinearGradient
                                    colors={['rgba(141,255,240,0.03)', 'rgba(0,180,159,0.06)']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <Image
                                    source={m.image}
                                    style={[styles.image, unlocked ? null : { opacity: 0.3 }]}
                                />
                                {unlocked && (
                                    <View style={styles.checkIcon}>
                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={24}
                                            color="#14F1B2"
                                        />
                                    </View>
                                )}
                                <Text style={[styles.label, unlocked ? styles.textUnlock : styles.textLock]}>
                                    {m.label}
                                </Text>
                                <Text style={[styles.status, unlocked ? styles.textUnlock : styles.textLock]}>
                                    {unlocked ? 'Unlocked!' : 'Locked'}
                                </Text>
                            </BlurView>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0E151A' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#8DFFF0',
        marginTop: 20,
        marginBottom: 4,
    },
    subheader: {
        fontSize: 16,
        color: '#C5FFF8',
        marginBottom: 20,
        opacity: 0.8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 20,
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderRadius: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.15)',
        backgroundColor: 'rgba(19,65,86,0.3)',
        overflow: 'hidden',
    },
    boxUnlocked: {
        borderColor: '#14F1B2',
        backgroundColor: 'rgba(20,241,178,0.08)',
    },
    image: {
        width: BOX_SIZE * 0.5,
        height: BOX_SIZE * 0.5,
        marginBottom: 12,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        opacity: 0.8,
    },
    textUnlock: { color: '#14F1B2' },
    textLock: { color: '#7daabb' },
});
