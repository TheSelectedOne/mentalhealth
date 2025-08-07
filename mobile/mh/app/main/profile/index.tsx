import { AppView } from '@/components/app-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

// Sample user data
// const user = {
//     username: 'JaneDoe',
//     followers: 1240,
//     posts: 32,
//     userPosts: [
//         { text: 'This is my first post!', likes: 37 },
//         { text: 'Absolutely loving React Native.', likes: 54 },
//         { text: 'Here’s another update from my week.', likes: 23 },
//         { text: 'Excited for new features coming soon!', likes: 78 },
//     ],
// };

export default function Profile() {
    const [userData, setUserData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const getProfile = async () => {
        const username = await AsyncStorage.getItem('username');
        const response = await fetch('http://192.168.1.132:3000/profiles/' + username);
        const data = await response.json();
        console.log('uuserData', data.userObj.postsDetails);
        if (response.status === 200) {
            console.log('Data sent successfully');
            setUserData(data.userObj)
        }
        else {
            console.log('Error sending data');
        }
    }

    useEffect(() => {
        getProfile();
    }, []);


    return (
        <AppView style={styles.container}>
            {/* User Info */}
            <View style={styles.headerBox}>
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
            </View>

            {/* Posts List */}
            <Text style={styles.sectionTitle}>Posts</Text>
            <FlatList
                data={userData.postsDetails || []}
                keyExtractor={(_, idx) => 'post-' + idx}
                onRefresh={getProfile}
                refreshing={loading}
                renderItem={({ item }) => (
                    <View style={styles.postBox}>
                        <Text style={styles.postText}>{item.body}</Text>
                        <View style={styles.likesRow}>
                            <Text style={styles.likeText}>❤️ {item.likes || 0}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.postsContainer}
            />
        </AppView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        padding: 20,
    },
    headerBox: {
        alignItems: 'center',
        marginVertical: 24,
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#14F1B2',
        marginBottom: 16,
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
        color: '#134156',
        fontSize: 16,
        marginTop: 4,
    },
    sectionTitle: {
        color: '#14F1B2',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    postsContainer: {
        paddingBottom: 16,
    },
    postBox: {
        backgroundColor: '#134156',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
    },
    postText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    likesRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    likeText: {
        color: '#14F1B2',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
