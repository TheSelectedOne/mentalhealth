import { useAuth } from '@/components/auth/auth-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const MILESTONE_DAYS = 30;

export default function DashboardScreen() {
    const [daysFree, setDaysFree] = useState(null);
    const [reason, setReason] = useState('');
    const [addiction, setAddiction] = useState('');
    const { signOut } = useAuth();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const milestoneNumber = daysFree !== null ? Math.floor(daysFree / MILESTONE_DAYS) + 1 : 1;
    const progressDays = daysFree !== null ? daysFree % MILESTONE_DAYS : 0;
    const progressPercent = (progressDays / MILESTONE_DAYS) * 100;

    useEffect(() => {
        const loadData = async () => {
            const quitDateStr = await AsyncStorage.getItem('startDate');
            const quitReason = await AsyncStorage.getItem('reason');
            const addictionType = await AsyncStorage.getItem('addiction');
            setAddiction(addictionType || 'addiction');
            setReason(quitReason || 'Taking back control of my life');

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
        <LinearGradient
            colors={['#0E151A', '#134156', '#0E151A']}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>Welcome back</Text>
                        <Text style={styles.dayCounter}>
                            {daysFree !== null ? daysFree : '--'} days
                        </Text>
                        <Text style={styles.addictionText}>{addiction} free</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleSignOut()} style={styles.profileButton}>
                        <Feather name="user" size={24} color="#8DFFF0" />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentArea}>
                    {/* Main Progress Card */}
                    <BlurView intensity={20} tint="dark" style={styles.mainCard}>
                        <LinearGradient
                            colors={['rgba(141,255,240,0.05)', 'rgba(0,180,159,0.1)']}
                            style={styles.cardGradient}
                        />

                        {/* Circular Progress */}
                        <View style={styles.progressCircleContainer}>
                            <View style={styles.progressCircle}>
                                <Text style={styles.progressPercentage}>
                                    {Math.round(progressPercent)}%
                                </Text>
                                <Text style={styles.progressLabel}>milestone</Text>
                            </View>
                        </View>

                        <View style={styles.milestoneInfo}>
                            <Text style={styles.milestoneText}>
                                Milestone {milestoneNumber}
                            </Text>
                            <Text style={styles.milestoneProgress}>
                                {progressDays} of {MILESTONE_DAYS} days
                            </Text>
                        </View>
                    </BlurView>

                    {/* Reason Card */}
                    <BlurView intensity={15} tint="dark" style={styles.reasonCard}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="heart" size={20} color="#00B49F" />
                        </View>
                        <View style={styles.reasonContent}>
                            <Text style={styles.reasonTitle}>Your why</Text>
                            <Text style={styles.reasonText} numberOfLines={2}>
                                {reason}
                            </Text>
                        </View>
                    </BlurView>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('post')}
                        >
                            <LinearGradient
                                colors={['#00B49F', '#14F1B2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.buttonGradient}
                            >
                                <MaterialCommunityIcons name="pencil-plus" size={20} color="#0E151A" />
                                <Text style={styles.primaryButtonText}>Share Journey</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton}>
                            <Feather name="trending-up" size={18} color="#8DFFF0" />
                            <Text style={styles.secondaryButtonText}>View Progress</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Navigation */}
                {/* <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navButton}>
                        <MaterialCommunityIcons name="view-dashboard" size={22} color="#14F1B2" />
                        <Text style={styles.activeNavText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton}>
                        <MaterialCommunityIcons name="account-group" size={22} color="#8DFFF0" />
                        <Text style={styles.navText}>Community</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={handleSignOut}>
                        <MaterialCommunityIcons name="logout" size={22} color="#C5FFF8" />
                        <Text style={styles.navText}>Sign Out</Text>
                    </TouchableOpacity>
                </View> */}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 20,
        paddingBottom: 30,
    },
    greetingContainer: {
        flex: 1,
    },
    greetingText: {
        fontSize: 16,
        color: '#C5FFF8',
        opacity: 0.8,
        marginBottom: 4,
    },
    dayCounter: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#8DFFF0',
        marginBottom: 2,
        textShadowColor: 'rgba(141,255,240,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    addictionText: {
        fontSize: 18,
        color: '#14F1B2',
        fontWeight: '500',
    },
    profileButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(141,255,240,0.1)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    contentArea: {
        flex: 1,
        paddingBottom: 20,
    },
    mainCard: {
        borderRadius: 24,
        padding: 32,
        marginBottom: 20,
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
    progressCircleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    progressCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0,180,159,0.15)',
        borderWidth: 3,
        borderColor: '#14F1B2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#14F1B2',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    progressPercentage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#14F1B2',
    },
    progressLabel: {
        fontSize: 12,
        color: '#8DFFF0',
        opacity: 0.8,
        marginTop: 2,
    },
    milestoneInfo: {
        alignItems: 'center',
    },
    milestoneText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8DFFF0',
        marginBottom: 4,
    },
    milestoneProgress: {
        fontSize: 14,
        color: '#C5FFF8',
        opacity: 0.7,
    },
    reasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.1)',
        backgroundColor: 'rgba(19,65,86,0.25)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,180,159,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    reasonContent: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#14F1B2',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 16,
        color: '#C5FFF8',
        lineHeight: 22,
    },
    actionButtons: {
        gap: 12,
    },
    primaryButton: {
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
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0E151A',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.3)',
        backgroundColor: 'rgba(141,255,240,0.05)',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8DFFF0',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(19,65,86,0.4)',
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.1)',
    },
    navButton: {
        alignItems: 'center',
        gap: 4,
    },
    activeNavText: {
        fontSize: 12,
        color: '#14F1B2',
        fontWeight: '600',
    },
    navText: {
        fontSize: 12,
        color: '#8DFFF0',
        opacity: 0.7,
    },
});
