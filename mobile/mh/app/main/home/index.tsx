import { useAuth } from '@/components/auth/auth-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const MILESTONE_DAYS = 30
export default function DashboardScreen() {
    const [daysFree, setDaysFree] = useState(null);
    const [reason, setReason] = useState('');
    const [addiciton, setAddiction] = useState('');
    const { signOut } = useAuth();
    const navigation = useNavigation();

    const milestoneNumber = daysFree !== null ? Math.floor(daysFree / MILESTONE_DAYS) + 1 : 1;
    const progressDays = daysFree !== null ? daysFree % MILESTONE_DAYS : 0;
    const progressPercent = (progressDays / MILESTONE_DAYS) * 100;

    useEffect(() => {
        const loadData = async () => {
            const quitDateStr = await AsyncStorage.getItem('startDate');
            const quitReason = await AsyncStorage.getItem('reason');
            const addiction = await AsyncStorage.getItem('addiction');
            setAddiction(addiction || 'No addiction provided.');
            setReason(quitReason || 'No reason provided.');

            if (quitDateStr) {
                const startDate = new Date(quitDateStr);
                const now = new Date();
                const diffMs = now.getTime() - startDate.getTime();
                setDaysFree(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            }
        };
        loadData();
    }, []);

    const handleSignOut = async () => {
        signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerArea}>
                <Text style={styles.headerText}>You're {daysFree !== null ? daysFree : '--'} days {addiciton} free</Text>
                <View style={styles.reasonBox}>
                    <Text style={styles.reasonTitle}>Your Reason for Quitting:</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    <Text style={styles.progressText}>
                        Milestone {milestoneNumber}: {progressDays}/{MILESTONE_DAYS} days
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => navigation.navigate('post')}
                >
                    <Text style={styles.postButtonText}>Make a Post</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    progressBarBackground: {
        width: '100%',
        height: 26,
        backgroundColor: '#134156',
        borderRadius: 13,
        overflow: 'hidden',
        marginBottom: 30,
        justifyContent: 'center',
    },
    progressBarFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#14F1B2',
        borderRadius: 13,
    },
    progressText: {
        color: '#0E151A',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        zIndex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        justifyContent: 'space-between',
    },
    centerArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    headerText: {
        color: '#14F1B2',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    reasonBox: {
        width: '100%',
        backgroundColor: '#134156',
        borderRadius: 12,
        padding: 18,
        marginBottom: 24,
    },
    reasonTitle: {
        color: '#14F1B2',
        fontWeight: '600',
        marginBottom: 5,
        fontSize: 17,
    },
    reasonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: '#14F1B2',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 40,
        marginTop: 16,
    },
    postButtonText: {
        color: '#0E151A',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signOutButton: {
        alignSelf: 'center',
        marginBottom: 28,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#14F1B2',
        backgroundColor: 'transparent',
    },
    signOutText: {
        color: '#14F1B2',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
