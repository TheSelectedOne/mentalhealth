import { API_URL } from '@/constants/app-config';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, FlatList, StyleSheet, Text, TextInput,
    TouchableOpacity, View, Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('recent');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const router = useRouter();

    const getRecentPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://192.168.1.132:3000/posts/recent?user_id=' + await AsyncStorage.getItem('username'));
            const data = await response.json();
            console.log('Fetched posts:', data.posts);
            const formattedData = data.posts.map((post) => ({
                id: post.id,
                user: post.user_id,
                text: post.body,
                likes: post.likes || 0,
                liked: post.likedByCurrentUser || false,
                date: new Date(Number(post.time)).toLocaleDateString(),
                isFollowed: post.isFollowed || false,
                supportType: Math.random() > 0.5 ? 'milestone' : 'support', // Mock data
                daysClean: Math.floor(Math.random() * 365) + 1, // Mock data
            }));
            setPosts(formattedData);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    const onRefresh = async () => {
        await getRecentPosts();
    };

    useEffect(() => {
        getRecentPosts();
    }, []);

    const filteredPosts = posts.filter((post) => (
        (filter === 'recent' || post.isFollowed) &&
        (search.trim() === '' || post.user.toLowerCase().includes(search.toLowerCase()))
    ));

    const handleLike = async (id) => {
        setPosts((posts) =>
            posts.map((post) =>
                post.id === id
                    ? {
                        ...post,
                        liked: !post.liked,
                        likes: post.liked ? post.likes - 1 : post.likes + 1,
                    }
                    : post
            )
        );

        try {
            await fetch(API_URL + '/posts/' + id + '/like', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: await AsyncStorage.getItem('username'),
                }),
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const renderPost = ({ item }) => (
        <BlurView intensity={20} tint="dark" style={styles.postCard}>
            <LinearGradient
                colors={['rgba(141,255,240,0.02)', 'rgba(0,180,159,0.05)']}
                style={styles.cardGradient}
            />

            {/* Post Header */}
            <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <BlurView intensity={40} tint="dark" style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {item.user.slice(0, 2).toUpperCase()}
                            </Text>
                        </BlurView>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.username}>{item.user}</Text>
                        <View style={styles.badgeContainer}>
                            {item.supportType === 'milestone' ? (
                                <View style={styles.milestoneBadge}>
                                    <MaterialCommunityIcons name="star" size={12} color="#00B49F" />
                                    <Text style={styles.badgeText}>{item.daysClean} days strong</Text>
                                </View>
                            ) : (
                                <View style={styles.supportBadge}>
                                    <MaterialCommunityIcons name="heart" size={12} color="#8DFFF0" />
                                    <Text style={styles.badgeText}>Offering support</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <Text style={styles.postTime}>{item.date}</Text>
            </View>

            {/* Post Content */}
            <Text style={styles.postContent}>{item.text}</Text>

            {/* Post Actions */}
            <View style={styles.postActions}>
                <TouchableOpacity
                    onPress={() => handleLike(item.id)}
                    style={[styles.actionButton, item.liked && styles.likedButton]}
                >
                    <MaterialCommunityIcons
                        name={item.liked ? 'heart' : 'heart-outline'}
                        size={20}
                        color={item.liked ? '#8DFFF0' : '#C5FFF8'}
                    />
                    <Text style={[styles.actionText, item.liked && styles.likedText]}>
                        {item.likes}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push({
                    pathname: '/main/community/support',
                    params: { author: item.user, postId: item.id },
                })} style={styles.actionButton}>
                    <MaterialCommunityIcons name="comment-outline" size={20} color="#C5FFF8" />
                    <Text style={styles.actionText}>Support</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Feather name="share" size={18} color="#C5FFF8" />
                </TouchableOpacity>
            </View>
        </BlurView>
    );

    return (
        <LinearGradient
            colors={['#0E151A', '#134156', '#0E151A']}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Community</Text>
                    <Text style={styles.headerSubtitle}>Supporting each other's journey</Text>
                </View>
                <TouchableOpacity style={styles.headerAction}>
                    <MaterialCommunityIcons name="account-plus" size={24} color="#8DFFF0" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <BlurView intensity={15} tint="dark" style={styles.searchContainer}>
                <Feather name="search" size={18} color="#8DFFF0" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find support or inspiration..."
                    placeholderTextColor="#8DFFF0"
                    value={search}
                    onChangeText={setSearch}
                />
            </BlurView>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'recent' && styles.activeFilter]}
                    onPress={() => setFilter('recent')}
                >
                    <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color={filter === 'recent' ? '#0E151A' : '#8DFFF0'}
                    />
                    <Text style={filter === 'recent' ? styles.activeFilterText : styles.filterText}>
                        Recent Stories
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterTab, filter === 'following' && styles.activeFilter]}
                    onPress={() => setFilter('following')}
                >
                    <MaterialCommunityIcons
                        name="account-heart"
                        size={16}
                        color={filter === 'following' ? '#0E151A' : '#8DFFF0'}
                    />
                    <Text style={filter === 'following' ? styles.activeFilterText : styles.filterText}>
                        My Circle
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Posts Feed */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#14F1B2" size="large" />
                    <Text style={styles.loadingText}>Loading inspiring stories...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    refreshing={loading}
                    onRefresh={onRefresh}
                    contentContainerStyle={styles.feedContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8DFFF0',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#C5FFF8',
        opacity: 0.8,
    },
    headerAction: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(141,255,240,0.1)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.15)',
        backgroundColor: 'rgba(19,65,86,0.3)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#C5FFF8',
    },
    filterContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.3)',
        backgroundColor: 'rgba(141,255,240,0.05)',
        gap: 6,
    },
    activeFilter: {
        backgroundColor: '#14F1B2',
        borderColor: '#14F1B2',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8DFFF0',
    },
    activeFilterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0E151A',
    },
    feedContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    postCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.1)',
        backgroundColor: 'rgba(19,65,86,0.25)',
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
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
        backgroundColor: 'rgba(0,180,159,0.1)',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#14F1B2',
    },
    userDetails: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8DFFF0',
        marginBottom: 4,
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    milestoneBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,180,159,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 4,
    },
    supportBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(141,255,240,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#C5FFF8',
    },
    postTime: {
        fontSize: 12,
        color: '#C5FFF8',
        opacity: 0.7,
    },
    postContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
    },
    likedButton: {
        transform: [{ scale: 1.05 }],
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#C5FFF8',
    },
    likedText: {
        color: '#8DFFF0',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#8DFFF0',
        opacity: 0.8,
    },
});
