import { AppView } from '@/components/app-view';
import { API_URL } from '@/constants/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function getInitials(username) {
    if (!username) return '';
    return username.slice(0, 2).toUpperCase();
}

export default function Profile() {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [daysSinceStart, setDaysSinceStart] = useState(0);
    const insets = useSafeAreaInsets();

    const getProfile = async () => {
        setLoading(true);
        try {
            const username = await AsyncStorage.getItem('username');
            const response = await fetch(`${API_URL}/profiles/${username}`);
            const data = await response.json();

            if (response.status === 200) {
                setUserData(data.userObj);
            }

            // Calculate days since start
            const startDate = await AsyncStorage.getItem('startDate');
            if (startDate) {
                const start = new Date(startDate);
                const now = new Date();
                const diffMs = now.getTime() - start.getTime();
                setDaysSinceStart(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProfile();
    }, []);

    const hasProfileImage = userData.profileImage && userData.profileImage.length > 0;
    const milestoneCount = Math.floor(daysSinceStart / 30);

    const renderJourneyPost = (item, index) => (
        <BlurView key={`post-${index}`} intensity={15} tint="dark" style={styles.journeyPost}>
            <LinearGradient
                colors={['rgba(141,255,240,0.02)', 'rgba(0,180,159,0.03)']}
                style={styles.postGradient}
            />
            <Text style={styles.postContent}>{item.body}</Text>
            <View style={styles.postFooter}>
                <View style={styles.postStats}>
                    <MaterialCommunityIcons name="heart" size={16} color="#8DFFF0" />
                    <Text style={styles.likesText}>{item.likes || 0}</Text>
                </View>
                <Text style={styles.postDate}>
                    {new Date(Number(item.time || Date.now())).toLocaleDateString()}
                </Text>
            </View>
        </BlurView>
    );

    return (
        <LinearGradient
            colors={['#0E151A', '#134156', '#0E151A']}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <AppView style={styles.appView}>
                {/* Header - Fixed at top */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Feather name="chevron-left" size={24} color="#8DFFF0" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Journey</Text>
                    <TouchableOpacity style={styles.editButton}>
                        <Feather name="edit-3" size={20} color="#8DFFF0" />
                    </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={getProfile}
                            tintColor="#14F1B2"
                            colors={['#14F1B2']}
                        />
                    }
                >
                    {/* Profile Section */}
                    <BlurView intensity={20} tint="dark" style={styles.profileCard}>
                        <LinearGradient
                            colors={['rgba(141,255,240,0.05)', 'rgba(0,180,159,0.08)']}
                            style={styles.profileGradient}
                        />

                        {/* Profile Picture */}
                        <View style={styles.profilePictureContainer}>
                            <BlurView intensity={40} tint="dark" style={styles.profilePictureGlass}>
                                {hasProfileImage ? (
                                    <Image
                                        source={{ uri: userData.profileImage }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <View style={styles.initialsContainer}>
                                        <Text style={styles.initialsText}>
                                            {getInitials(userData.username)}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.statusIndicator}>
                                    <MaterialCommunityIcons name="check-circle" size={16} color="#14F1B2" />
                                </View>
                            </BlurView>
                        </View>

                        {/* User Info */}
                        <Text style={styles.displayName}>{userData.username || 'Anonymous Warrior'}</Text>
                        <Text style={styles.journeyDays}>{daysSinceStart} days strong</Text>

                        {/* Stats Row */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <View style={styles.statIconContainer}>
                                    <MaterialCommunityIcons name="calendar-check" size={20} color="#00B49F" />
                                </View>
                                <Text style={styles.statNumber}>{milestoneCount}</Text>
                                <Text style={styles.statLabel}>Milestones</Text>
                            </View>

                            <View style={styles.statDivider} />

                            <View style={styles.statItem}>
                                <View style={styles.statIconContainer}>
                                    <MaterialCommunityIcons name="account-heart" size={20} color="#14F1B2" />
                                </View>
                                <Text style={styles.statNumber}>{userData.followers || 0}</Text>
                                <Text style={styles.statLabel}>Supporters</Text>
                            </View>

                            <View style={styles.statDivider} />

                            <View style={styles.statItem}>
                                <View style={styles.statIconContainer}>
                                    <MaterialCommunityIcons name="notebook-edit" size={20} color="#8DFFF0" />
                                </View>
                                <Text style={styles.statNumber}>{userData.postsAmount || 0}</Text>
                                <Text style={styles.statLabel}>Stories</Text>
                            </View>
                        </View>
                    </BlurView>

                    {/* Achievement Badges */}
                    <View style={styles.achievementsSection}>
                        <Text style={styles.sectionTitle}>Recent Achievements</Text>
                        <View style={styles.badgesContainer}>
                            <BlurView intensity={15} tint="dark" style={styles.achievementBadge}>
                                <MaterialCommunityIcons name="star" size={24} color="#14F1B2" />
                                <Text style={styles.badgeText}>7 Day Streak</Text>
                            </BlurView>
                            <BlurView intensity={15} tint="dark" style={styles.achievementBadge}>
                                <MaterialCommunityIcons name="heart-multiple" size={24} color="#00B49F" />
                                <Text style={styles.badgeText}>Community Love</Text>
                            </BlurView>
                            <BlurView intensity={15} tint="dark" style={styles.achievementBadge}>
                                <MaterialCommunityIcons name="trophy" size={24} color="#8DFFF0" />
                                <Text style={styles.badgeText}>First Milestone</Text>
                            </BlurView>
                        </View>
                    </View>

                    {/* Journey Stories */}
                    <View style={styles.storiesSection}>
                        <Text style={styles.sectionTitle}>My Recovery Stories</Text>
                        {userData.postsDetails && userData.postsDetails.map((item, index) =>
                            renderJourneyPost(item, index)
                        )}
                    </View>

                    {/* Bottom spacing for safe scrolling */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </AppView>
        </LinearGradient>
    );
}

// Updated styles
const PROFILE_SIZE = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileCard: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.15)',
        backgroundColor: 'rgba(19,65,86,0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    profileGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    profilePictureContainer: {
        marginBottom: 16,
    },
    profilePictureGlass: {
        width: PROFILE_SIZE,
        height: PROFILE_SIZE,
        borderRadius: PROFILE_SIZE / 2,
        borderWidth: 3,
        borderColor: 'rgba(20,241,178,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,180,159,0.1)',
        shadowColor: '#14F1B2',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    profileImage: {
        width: PROFILE_SIZE - 12,
        height: PROFILE_SIZE - 12,
        borderRadius: (PROFILE_SIZE - 12) / 2,
        resizeMode: 'cover',
    },
    initialsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#14F1B2',
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#0E151A',
        borderRadius: 12,
        padding: 2,
    },
    displayName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8DFFF0',
        marginBottom: 4,
        textShadowColor: 'rgba(141,255,240,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    journeyDays: {
        fontSize: 16,
        color: '#14F1B2',
        fontWeight: '600',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(141,255,240,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#14F1B2',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#C5FFF8',
        opacity: 0.8,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(197,255,248,0.2)',
        marginHorizontal: 16,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(141,255,240,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#8DFFF0',
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(141,255,240,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    achievementsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#14F1B2',
        marginBottom: 12,
        marginLeft: 4,
    },
    badgesContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    achievementBadge: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.1)',
        backgroundColor: 'rgba(19,65,86,0.3)',
    },
    badgeText: {
        fontSize: 11,
        color: '#C5FFF8',
        fontWeight: '500',
        marginTop: 6,
        textAlign: 'center',
    },
    storiesSection: {
        marginBottom: 20,
    },
    journeyPost: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.08)',
        backgroundColor: 'rgba(19,65,86,0.2)',
        position: 'relative',
        overflow: 'hidden',
    },
    postGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    postContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#FFFFFF',
        marginBottom: 12,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    likesText: {
        fontSize: 14,
        color: '#8DFFF0',
        fontWeight: '500',
    },
    postDate: {
        fontSize: 12,
        color: '#C5FFF8',
        opacity: 0.7,
    },
    bottomSpacing: {
        height: 40, // Extra space at bottom for comfortable scrolling
    },
});
