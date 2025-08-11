import { AppView } from '@/components/app-view';
import { API_URL } from '@/constants/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function getInitials(username) {
    if (!username) return '';
    // Take first two letters, uppercase
    return username.slice(0, 2).toUpperCase();
}

export default function Profile() {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    const getProfile = async () => {
        setLoading(true);
        const username = await AsyncStorage.getItem('username');
        const response = await fetch(API_URL + '/profiles/' + username);
        const data = await response.json();
        if (response.status === 200) {
            setUserData(data.userObj);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProfile();
    }, []);

    const hasProfileImage = userData.profileImage && userData.profileImage.length > 0;

    return (
        <AppView style={styles.container}>
            {/* Profile Pic/Initials */}
            <View style={styles.profilePicContainer}>
                <BlurView intensity={90} tint="dark" style={styles.profilePicGlass}>
                    {hasProfileImage ? (
                        <Image
                            source={{ uri: userData.profileImage }}
                            style={styles.profilePicImage}
                        />
                    ) : (
                        <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>
                                {getInitials(userData.username)}
                            </Text>
                        </View>
                    )}
                </BlurView>
            </View>

            {/* User Info glass tile */}
            <BlurView intensity={70} tint="dark" style={styles.headerBox}>
                <Text style={styles.username}>{userData.username || ''}</Text>
                <View style={styles.countsBox}>
                    <View style={styles.countBox}>
                        <Text style={styles.countNumber}>{userData.followers || 0}</Text>
                        <Text style={styles.countLabel}>Followers</Text>
                    </View>
                    <View style={styles.countBox}>
                        <Text style={styles.countNumber}>{userData.postsAmount || 0}</Text>
                        <Text style={styles.countLabel}>Posts</Text>
                    </View>
                </View>
            </BlurView>

            {/* Posts List */}
            <Text style={styles.sectionTitle}>Posts</Text>
            <FlatList
                data={userData.postsDetails || []}
                keyExtractor={(_, idx) => 'post-' + idx}
                onRefresh={getProfile}
                refreshing={loading}
                renderItem={({ item }) => (
                    <BlurView intensity={50} tint="dark" style={styles.postBox}>
                        <Text style={styles.postText}>{item.body}</Text>
                        <View style={styles.likesRow}>
                            <MaterialCommunityIcons
                                name={item.likedByCurrentUser ? 'heart' : 'heart-outline'}
                                size={22}
                                color={item.likedByCurrentUser ? '#8DFFF0' : '#14F1B2'}
                                style={item.likedByCurrentUser ? styles.likedGlow : undefined}
                            />
                            <Text style={styles.likeText}>{item.likes || 0}</Text>
                        </View>
                    </BlurView>
                )}
                contentContainerStyle={styles.postsContainer}
                showsVerticalScrollIndicator={false}
            />
        </AppView>
    );
}

const PROFILE_SIZE = 94;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        padding: 20,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    profilePicGlass: {
        borderRadius: PROFILE_SIZE / 2,
        borderWidth: 1.2,
        borderColor: 'rgba(197,255,248,0.37)',
        width: PROFILE_SIZE,
        height: PROFILE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(19,65,86,0.25)',
        overflow: 'hidden',
        shadowColor: '#14F1B2',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 3 },
    },
    profilePicImage: {
        width: PROFILE_SIZE - 8,
        height: PROFILE_SIZE - 8,
        borderRadius: PROFILE_SIZE / 2,
        resizeMode: 'cover',
    },
    initialsCircle: {
        borderRadius: (PROFILE_SIZE - 8) / 2,
        width: PROFILE_SIZE - 8,
        height: PROFILE_SIZE - 8,
        backgroundColor: 'rgba(20,241,178,0.11)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.28)',
    },
    initialsText: {
        color: '#14F1B2',
        fontSize: 38,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    headerBox: {
        alignItems: 'center',
        marginVertical: 20,
        padding: 18,
        // borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.25)',
        backgroundColor: 'rgba(19,65,86,0.45)',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8DFFF0',
        marginBottom: 16,
        textShadowColor: 'rgba(0,180,159,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    countsBox: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    countBox: {
        alignItems: 'center',
        marginHorizontal: 24,
    },
    countNumber: {
        color: '#14F1B2',
        fontSize: 22,
        fontWeight: 'bold',
    },
    countLabel: {
        color: '#C5FFF8',
        fontSize: 15,
        opacity: 0.8,
        marginTop: 4,
    },
    sectionTitle: {
        color: '#14F1B2',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        marginLeft: 6,
    },
    postsContainer: {
        paddingBottom: 18,
    },
    postBox: {
        // borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.18)',
        backgroundColor: 'rgba(19,65,86,0.45)',
    },
    postText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 22,
    },
    likesRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    likeText: {
        color: '#8DFFF0',
        fontWeight: '600',
        fontSize: 15,
    },
    likedGlow: {
        shadowColor: '#8DFFF0',
        shadowRadius: 8,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 0 },
    },
});
