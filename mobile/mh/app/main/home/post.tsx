import { API_URL } from '@/constants/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreatePostScreen() {
    const [postText, setPostText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()

    const handlePost = async () => {
        if (postText.trim().length === 0) {
            Alert.alert('Please write something before posting.');
            return;
        }
        setLoading(true);
        try {
            // TODO: Replace this with your actual API call
            // await new Promise((res) => setTimeout(res, 800)); // Simulated request
            const category = await AsyncStorage.getItem('addiction'); // Assuming you have a category stored
            const dataObj = {
                body: postText,
                user_id: await AsyncStorage.getItem('username'),// Assuming you have a username stored
                categories: [category], // Assuming addiction is stored
            }
            const response = await fetch(API_URL + '/posts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataObj),
            })
            const data = await response.json();
            console.log(data);
            if (response.status === 201) {
                console.log('Data sent successfully');
            }
            else {
                console.log('Error sending data');
            }
            Alert.alert('Success', 'Your post has been submitted!');
            setPostText('');
            navigation.goBack(); // or navigate as needed
        } catch (e) {
            Alert.alert('Error', 'Failed to post.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setPostText('');
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.title}>New Post</Text>
            <TextInput
                style={styles.textArea}
                placeholder="What's on your mind?"
                placeholderTextColor="#134156"
                value={postText}
                onChangeText={setPostText}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
            />
            {loading ? (
                <ActivityIndicator color="#14F1B2" style={{ marginVertical: 16 }} />
            ) : (
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                    >
                        <Text style={[styles.buttonText, { color: '#14F1B2' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.postButton]}
                        onPress={handlePost}
                    >
                        <Text style={[styles.buttonText, { color: '#0E151A' }]}>Post</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        color: '#14F1B2',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        alignSelf: 'center',
    },
    textArea: {
        backgroundColor: '#134156',
        color: '#14F1B2',
        borderRadius: 10,
        padding: 16,
        fontSize: 17,
        minHeight: 120,
        marginBottom: 36,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 34,
    },
    cancelButton: {
        borderWidth: 2,
        borderColor: '#14F1B2',
        backgroundColor: 'transparent',
        marginRight: 10,
    },
    postButton: {
        backgroundColor: '#14F1B2',
        marginLeft: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 17,
    },
});
