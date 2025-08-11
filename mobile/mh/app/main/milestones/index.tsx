import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MILESTONES = [
    { days: 30, label: '30 Days', image: require('./icon.png') },
    { days: 60, label: '60 Days', image: require('./icon.png') },
    { days: 90, label: '90 Days', image: require('./icon.png') },
    { days: 180, label: '180 Days', image: require('./icon.png') },
    { days: 365, label: '365 Days', image: require('./icon.png') },
];

export default function MilestonesScreen() {
    const [daysFree, setDaysFree] = useState(null);

    useEffect(() => {
        const loadDaysFree = async () => {
            const quitDateStr = await AsyncStorage.getItem('startDate');
            if (quitDateStr) {
                const startDate = new Date(quitDateStr);
                const now = new Date();
                const diffMs = now.getTime() - startDate.getTime();
                setDaysFree(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            }
        };
        loadDaysFree();
    }, []);

    const renderMilestone = ({ item }) => {
        const unlocked = daysFree !== null && daysFree >= item.days;

        return (
            <BlurView intensity={70} tint="dark" style={styles.milestoneBox}>
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={[styles.milestoneImage, unlocked ? styles.unlockedImage : styles.lockedImage]} />
                    {unlocked && (
                        <View style={styles.checkIconContainer}>
                            <MaterialCommunityIcons name="check-circle" size={22} color="#14F1B2" />
                        </View>
                    )}
                </View>
                <Text style={[styles.milestoneLabel, unlocked ? styles.unlockedText : styles.lockedText]}>
                    {item.label}
                </Text>
                <Text style={[styles.milestoneStatus, unlocked ? styles.unlockedText : styles.lockedText]}>
                    {unlocked ? 'Unlocked' : 'Locked'}
                </Text>
            </BlurView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Milestones</Text>
            {daysFree === null ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={MILESTONES}
                    renderItem={renderMilestone}
                    keyExtractor={(item) => item.days.toString()}
                    horizontal={false}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const BOX_SIZE = 140;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#14F1B2',
        marginBottom: 24,
        textAlign: 'center',
    },
    loadingText: {
        color: '#14F1B2',
        textAlign: 'center',
        marginTop: 20,
    },
    listContainer: {
        justifyContent: 'space-between',
    },
    milestoneBox: {
        flex: 1,
        margin: 10,
        maxWidth: BOX_SIZE,
        aspectRatio: 1,
        // borderRadius: 20,
        padding: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(20, 180, 159, 0.3)',
        backgroundColor: 'rgba(19, 65, 86, 0.5)',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    milestoneImage: {
        width: 72,
        height: 72,
        // borderRadius: 36,
    },
    unlockedImage: {
        opacity: 1,
    },
    lockedImage: {
        opacity: 0.3,
    },
    checkIconContainer: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#0E151A',
        borderRadius: 16,
    },
    milestoneLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    milestoneStatus: {
        fontSize: 14,
    },
    unlockedText: {
        color: '#14F1B2',
    },
    lockedText: {
        color: '#7daabb',
    },
});
