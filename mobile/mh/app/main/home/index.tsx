import { useAuth } from '@/components/auth/auth-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const MILESTONE_DAYS = 30;

export default function DashboardScreen() {
    const [daysFree, setDaysFree] = useState(null);
    const [reason, setReason] = useState('');
    const [addiction, setAddiction] = useState('');
    const { signOut } = useAuth();
    const navigation = useNavigation();

    const milestoneNumber = daysFree !== null ? Math.floor(daysFree / MILESTONE_DAYS) + 1 : 1;
    const progressDays = daysFree !== null ? daysFree % MILESTONE_DAYS : 0;
    const progressPercent = (progressDays / MILESTONE_DAYS) * 100;

    useEffect(() => {
        const loadData = async () => {
            const quitDateStr = await AsyncStorage.getItem('startDate');
            const quitReason = await AsyncStorage.getItem('reason');
            const addictionType = await AsyncStorage.getItem('addiction');
            setAddiction(addictionType || 'No addiction provided.');
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

    const handleSignOut = () => {
        signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerArea}>
                <Text style={styles.headerText}>
                    You're {daysFree !== null ? daysFree : '--'} days {addiction} free
                </Text>

                {/* Reason Box */}
                <BlurView intensity={70} tint="dark" style={styles.reasonBox}>
                    <Text style={styles.reasonTitle}>Your Reason for Quitting:</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                </BlurView>

                {/* Glassmorphic Progress Bar */}
                <BlurView intensity={70} tint="dark" style={styles.progressBarBackground}>
                    <LinearGradient
                        colors={['#14F1B2', '#8DFFF0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                    />
                    <Text style={styles.progressText}>
                        Milestone {milestoneNumber}: {progressDays}/{MILESTONE_DAYS} days
                    </Text>
                </BlurView>

                {/* Post Button */}
                <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate('post')}>
                    <Text style={styles.postButtonText}>Make a Post</Text>
                </TouchableOpacity>
            </View>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        color: '#8DFFF0',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 180, 159, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    reasonBox: {
        width: '100%',
        // borderRadius: 16,
        padding: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(197, 255, 248, 0.4)',
        overflow: 'hidden',
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
    progressBarBackground: {
        width: '100%',
        height: 30,
        // borderRadius: 15,
        marginBottom: 30,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(197, 255, 248, 0.4)',
        overflow: 'hidden',
        shadowColor: '#14F1B2',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    progressBarFill: {
        height: '100%',
        // borderRadius: 15,
    },
    progressText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: 'rgba(0, 180, 159, 0.3)',
        // borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 40,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#00B49F',
        shadowColor: '#00B49F',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    postButtonText: {
        color: '#C5FFF8',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signOutButton: {
        alignSelf: 'center',
        marginBottom: 28,
        paddingVertical: 12,
        paddingHorizontal: 30,
        // borderRadius: 10,
        borderWidth: 1,
        borderColor: '#14F1B2',
        backgroundColor: 'rgba(20, 241, 178, 0.1)',
    },
    signOutText: {
        color: '#14F1B2',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
