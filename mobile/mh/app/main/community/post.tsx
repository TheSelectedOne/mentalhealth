import { AppText } from "@/components/app-text"
import { AppView } from "@/components/app-view"
import { Pressable, StatusBar, StyleSheet, View } from "react-native"

export default function Post() {
    return (
        <AppView style={styles.container}>
            <View style={styles.padItem}>
                <View>
                    <AppText variant="titleSmall" style={styles.textColor} >@username</AppText>
                </View>
                <View>
                    <AppText variant="titleMedium" style={styles.textColor} >This is a post text right here and we want it to be very good so user will love it</AppText>
                </View>
                <View style={styles.flexItem}>
                    <Pressable android_ripple={{ color: '#14F1B2' }} style={styles.likeBtn}>
                        <AppText style={styles.textColor}>Like</AppText>
                    </Pressable>
                    <AppText style={styles.textColor}>10</AppText>
                </View>
            </View>

        </AppView>
    )
}


const styles = StyleSheet.create({
    likeBtn: {
        borderColor: '#14F1B2',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 6,
        borderWidth: 1,
        width: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCenter: {
        textAlign: "center",
        color: "#ffffff"
    },
    textColor: {
        color: "#ffffff"
    },
    container: {
        backgroundColor: '#0E151A',
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        paddingTop: StatusBar.currentHeight
    },
    flexItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    padItem: {
        padding: 8
    },
    bottomButton: {

    },
    textarea: {
        height: 180, // Adjust as needed
        borderColor: '#134156',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        fontSize: 16,
        textAlignVertical: 'top',
        marginTop: 16,
        backgroundColor: '#0E151A',
        color: '#ffffff',
    },
    flexItemTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,

        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 6,

    },
    round: {
        borderRadius: 50,
        width: 8,
        height: 8,
        backgroundColor: '#134156'
    },
    roundActive: {
        borderRadius: 50,
        width: 8,
        height: 8,
        backgroundColor: '#14F1B2'
    }
})