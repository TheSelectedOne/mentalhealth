import { useAuth } from '@/components/auth/auth-provider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AuthLandingScreen() {
    const { signIn, isLoading } = useAuth();
    const insets = useSafeAreaInsets();

    const handleSignIn = async () => {
        const account = await signIn();
        console.log(account);
        router.replace('/');
    };

    return (
        <LinearGradient
            colors={['#0E151A', '#134156', '#0E151A']}
            locations={[0, 0.6, 1]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Welcome Section */}
                <View style={styles.headerSection}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="heart-pulse" size={48} color="#8DFFF0" />
                    </View>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>
                        Start your journey to wellness
                    </Text>
                </View>

                {/* Auth Card */}
                <BlurView intensity={20} tint="dark" style={styles.authCard}>
                    <LinearGradient
                        colors={['rgba(141,255,240,0.05)', 'rgba(0,180,159,0.08)']}
                        style={styles.cardGradient}
                    />

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSignIn}
                        disabled={isLoading}
                    >
                        <LinearGradient
                            colors={['#00B49F', '#14F1B2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <MaterialCommunityIcons name="login" size={20} color="#0E151A" />
                            <Text style={styles.primaryButtonText}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/signup/step1')}
                        disabled={isLoading}
                    >
                        <MaterialCommunityIcons name="account-plus" size={20} color="#8DFFF0" />
                        <Text style={styles.secondaryButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>New to recovery?</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Info Text */}
                    <Text style={styles.infoText}>
                        Join a supportive community on your path to wellness and recovery.
                    </Text>
                </BlurView>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Your journey matters. Take the first step today.
                    </Text>
                </View>
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
        justifyContent: 'space-between',
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 60,
        flex: 1,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(141,255,240,0.1)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(141,255,240,0.2)',
        shadowColor: '#8DFFF0',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#8DFFF0',
        marginBottom: 8,
        textShadowColor: 'rgba(141,255,240,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#C5FFF8',
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 40,
    },
    authCard: {
        borderRadius: 24,
        padding: 28,
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
    primaryButton: {
        borderRadius: 16,
        marginBottom: 16,
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
        gap: 10,
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
        marginBottom: 20,
        gap: 10,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8DFFF0',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(197,255,248,0.2)',
    },
    dividerText: {
        fontSize: 14,
        color: '#C5FFF8',
        opacity: 0.7,
        marginHorizontal: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#C5FFF8',
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.8,
    },
    footer: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#8DFFF0',
        textAlign: 'center',
        opacity: 0.7,
        fontStyle: 'italic',
    },
});
