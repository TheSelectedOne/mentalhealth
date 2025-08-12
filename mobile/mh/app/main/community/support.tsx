import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    Alert, SafeAreaView, Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SupportScreen() {
    // 1. Use useSearchParams to grab query params
    const { postId, author } = useLocalSearchParams<{ postId: string; author: string }>();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const insets = useSafeAreaInsets();

    const handleSupport = async () => {
        if (!message.trim()) {
            Alert.alert('Please write a message to support.');
            return;
        }
        setSending(true);
        try {
            await fetch(`https://your-api/posts/${postId}/support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            Alert.alert('Sent', `Your support message was sent to ${author}.`);
            setMessage('');
            router.back();      // 2. Use router.back() to go back
        } catch {
            Alert.alert('Error', 'Could not send support. Please try again.');
        }
        setSending(false);
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <BlurView intensity={30} tint="dark" style={styles.card}>
                    <LinearGradient
                        colors={['rgba(141,255,240,0.05)', 'rgba(0,180,159,0.1)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={styles.header}>
                        <MaterialCommunityIcons name="heart-multiple" size={28} color="#8DFFF0" />
                        <Text style={styles.headerText}>Support {author}</Text>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your supportive message…"
                        placeholderTextColor="rgba(197,255,248,0.6)"
                        multiline
                        value={message}
                        onChangeText={setMessage}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSupport}
                        disabled={sending}
                    >
                        <LinearGradient
                            colors={['#14F1B2', '#8DFFF0']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.submitText}>
                                {sending ? 'Sending…' : 'Send Support'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </BlurView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#0E151A' },
    card: {
        width: width - 40,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(197,255,248,0.15)',
        backgroundColor: 'rgba(19,65,86,0.35)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    headerText: { fontSize: 20, fontWeight: '600', color: '#8DFFF0' },
    textInput: {
        height: 140,
        backgroundColor: 'rgba(19,65,86,0.25)',
        borderRadius: 14,
        padding: 14,
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
    },
    submitButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#8DFFF0',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 16,
    },
    submitText: {
        color: '#0E151A',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
