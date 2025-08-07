import { API_URL } from '@/constants/app-config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const mockPosts = [
    // Replace with API data
    { id: "1", user: "Alice", text: "Feeling great today!", likes: 5, liked: false, date: "2025-08-06", isFollowed: true },
    { id: "2", user: "Bob", text: "Just checked in!", likes: 3, liked: true, date: "2025-08-05", isFollowed: false },
    { id: "3", user: "Charlie", text: "Another milestone!", likes: 8, liked: false, date: "2025-08-07", isFollowed: true },
];

export default function PostFeedScreen() {
    const [posts, setPosts] = useState([]); // Replace with fetch in real use
    const [filter, setFilter] = useState("recent"); // or "following"
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getRecentPosts = async () => {
        // setLoading(true);
        const response = await fetch('http://192.168.1.132:3000/posts/recent');
        const data = await response.json();
        console.log('pelmeen');
        const formattedData = await data.posts.map((post: any) => ({
            id: post.id,
            user: post.user_id,
            text: post.body,
            likes: post.likes || 0,
            liked: false, // Default to false, handle like state separately
            date: new Date(Number(post.time)).toLocaleDateString(),
            isFollowed: post.isFollowed || false, // Assuming API provides this
        }));
        // setLoading(false);
        console.log("formattedData", formattedData);
        setPosts(formattedData);
    }

    const onRefresh = async () => {
        await getRecentPosts();
    }

    // Filter posts for "recent" and "following"
    useEffect(() => {
        getRecentPosts();
    }, []);

    // useEffect(() => {
    //     let filteredPosts = [...mockPosts];

    //     if (filter === "following") {
    //         filteredPosts = filteredPosts.filter(post => post.isFollowed);
    //     }
    //     // Sort by date descending
    //     filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    //     // Search user
    //     if (search.trim()) {
    //         filteredPosts = filteredPosts.filter(post =>
    //             post.user.toLowerCase().includes(search.toLowerCase())
    //         );
    //     }
    //     setPosts(filteredPosts);
    // }, [filter, search]);

    // Like/Unlike handler
    const handleLike = async (id) => {
        setPosts(posts => posts.map(post =>
            post.id === id
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));

        const response = await fetch(API_URL + id + '/like', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: await AsyncStorage.getItem('username') }), // Assuming you have a username stored
        })
        const data = await response.json();
        console.log(data);
        if (response.status === 201) {
            console.log('Data sent successfully');
        }
        else {
            console.log('Error sending data');
        }
        // TODO: send POST/DELETE request to backend
    };

    // Render each post
    const renderPost = ({ item }) => (
        <View style={styles.postBox}>
            <Text style={styles.username}>{item.user}</Text>
            <Text style={styles.postText}>{item.text}</Text>
            <View style={styles.postFooter}>
                <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeRow}>
                    <MaterialCommunityIcons
                        name={item.liked ? "heart" : "heart-outline"}
                        size={22}
                        color={item.liked ? "#14F1B2" : "#14F1B2"}
                    />
                    <Text style={styles.likeCount}>{item.likes}</Text>
                </TouchableOpacity>
                <Text style={styles.postDate}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search users..."
                placeholderTextColor="gray"
                value={search}
                onChangeText={setSearch}
            />
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === "recent" && styles.activeButton]}
                    onPress={() => setFilter("recent")}
                >
                    <Text style={filter === "recent" ? styles.activeButtonText : styles.buttonText}>Recent</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === "following" && styles.activeButton]}
                    onPress={() => setFilter("following")}
                >
                    <Text style={filter === "following" ? styles.activeButtonText : styles.buttonText}>Following</Text>
                </TouchableOpacity>
            </View>
            {loading
                ? <ActivityIndicator color="#14F1B2" style={{ marginTop: 30 }} />
                : (
                    <FlatList
                        data={posts}
                        renderItem={renderPost}
                        keyExtractor={item => item.id}
                        refreshing={loading}
                        onRefresh={onRefresh}
                        contentContainerStyle={{ paddingBottom: 18 }}
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
        paddingTop: 32,
    },
    searchBar: {
        backgroundColor: '#134156',
        color: '#14F1B2',
        borderRadius: 10,
        padding: 10,
        marginBottom: 14,
        fontSize: 16,
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: 18,
        justifyContent: 'center',
    },
    filterButton: {
        paddingVertical: 7,
        paddingHorizontal: 22,
        backgroundColor: 'transparent',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#14F1B2',
        marginHorizontal: 7,
    },
    activeButton: {
        backgroundColor: '#14F1B2',
    },
    buttonText: {
        color: '#14F1B2',
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeButtonText: {
        color: '#0E151A',
        fontWeight: 'bold',
        fontSize: 16,
    },
    postBox: {
        backgroundColor: '#134156',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
    },
    username: {
        color: '#14F1B2',
        fontWeight: 'bold',
        marginBottom: 7,
        fontSize: 15,
    },
    postText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 12,
    },
    postFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        color: '#14F1B2',
        fontWeight: 'bold',
        marginLeft: 3,
        fontSize: 16,
    },
    postDate: {
        color: '#7daabb',
        fontSize: 12,
    },
});
