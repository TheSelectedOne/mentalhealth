import { API_URL } from '@/constants/app-config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, FlatList, StyleSheet, Text, TextInput,
    TouchableOpacity, View, Platform
} from 'react-native';
import { BlurView } from 'expo-blur';

export default function PostFeedScreen() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('recent');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getRecentPosts = async () => {
        setLoading(true);
        const response = await fetch(API_URL + '/posts/recent?user_id=' + await AsyncStorage.getItem('username'));
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
        }));
        setPosts(formattedData);
        setLoading(false);
    };

    const onRefresh = async () => {
        await getRecentPosts();
    };

    useEffect(() => {
        getRecentPosts();
    }, []);

    // Filtering by search and "following"
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
    };

    const renderPost = ({ item }) => (
        <BlurView intensity={70} tint="dark" style={styles.postBox}>
            <View style={styles.postHeader}>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.postDate}>{item.date}</Text>
            </View>
            <Text style={styles.postText}>{item.text}</Text>
            <View style={styles.postFooter}>
                <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeRow}>
                    <MaterialCommunityIcons
                        name={item.liked ? 'heart' : 'heart-outline'}
                        size={22}
                        color={item.liked ? '#8DFFF0' : '#14F1B2'}
                        style={item.liked ? styles.likedGlow : undefined}
                    />
                    <Text style={styles.likeCount}>{item.likes}</Text>
                </TouchableOpacity>
            </View>
        </BlurView>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search users..."
                placeholderTextColor="#8DFFF0"
                value={search}
                onChangeText={setSearch}
            />
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'recent' && styles.activeButton]}
                    onPress={() => setFilter('recent')}
                >
                    <Text style={filter === 'recent' ? styles.activeButtonText : styles.buttonText}>Recent</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'following' && styles.activeButton]}
                    onPress={() => setFilter('following')}
                >
                    <Text style={filter === 'following' ? styles.activeButtonText : styles.buttonText}>Following</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator color="#14F1B2" style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={filteredPosts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    refreshing={loading}
                    onRefresh={onRefresh}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        paddingHorizontal: 14,
        paddingTop: Platform.OS === 'ios' ? 44 : 32,
    },
    searchBar: {
        backgroundColor: 'rgba(19,65,86,0.7)',
        color: '#C5FFF8',
        //borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.17)',
        shadowColor: '#00B49F',
        shadowRadius: 7,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: 18,
        justifyContent: 'center',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 26,
        backgroundColor: 'rgba(20,241,178,0.07)',
        //borderRadius: 20,
        borderWidth: 1.4,
        borderColor: '#14F1B2',
        marginHorizontal: 8,
    },
    activeButton: {
        backgroundColor: 'rgba(141,255,240,0.17)',
        borderColor: '#8DFFF0',
    },
    buttonText: {
        color: '#14F1B2',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.2,
    },
    activeButtonText: {
        color: '#8DFFF0',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.2,
    },
    postBox: {
        marginBottom: 22,
        //borderRadius: 16,
        overflow: 'hidden',
        padding: 20,
        backgroundColor: 'rgba(19,65,86,0.65)',
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.21)',
        shadowColor: '#00B49F',
        shadowOpacity: 0.14,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 16,
        // BlurView will handle the rest!
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 9,
    },
    username: {
        color: '#14F1B2',
        fontWeight: 'bold',
        fontSize: 15.5,
        letterSpacing: 0.16,
        textShadowColor: '#14F1B231',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    postDate: {
        color: '#C5FFF8',
        fontSize: 12,
        opacity: 0.76,
    },
    postText: {
        color: '#fff',
        fontSize: 16.5,
        lineHeight: 23,
        marginBottom: 14,
        textShadowColor: '#13415644',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    postFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 6,
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        color: '#8DFFF0',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 16.5,
        textShadowColor: '#0E151A',
        textShadowRadius: 1,
    },
    likedGlow: {
        shadowColor: '#8DFFF0',
        shadowRadius: 8,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 0 },
    },
});
