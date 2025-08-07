import { useAuth } from '@/components/auth/auth-provider';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AuthLandingScreen() {
    const { signIn, isLoading } = useAuth(); // Assuming you have a useAuth hook to manage authentication state
    const handleSignIn = async () => {
        const account = await signIn();
        console.log(account);
        router.replace('/')
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleSignIn()}
            >
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { borderColor: '#14F1B2', backgroundColor: 'transparent' }]}
                onPress={() => router.push('/signup/step1')}
            >
                <Text style={[styles.buttonText, { color: '#14F1B2' }]}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E151A',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        color: '#14F1B2',
        fontWeight: 'bold',
        marginBottom: 40,
    },
    button: {
        width: '80%',
        backgroundColor: '#14F1B2',
        paddingVertical: 16,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#14F1B2',
    },
    buttonText: {
        color: '#0E151A',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
