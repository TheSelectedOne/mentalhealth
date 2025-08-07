import { AppView } from "@/components/app-view"
import { router } from "expo-router"
import { StyleSheet } from "react-native"
import { Button } from "react-native-paper"

const PostButtons = () => {
    return (
        <AppView style={styles.container}>
            <Button onPress={() => router.push("/main/home/post")} mode="contained" style={{ margin: 0, backgroundColor: '#14F1B2', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center' }} >What's on your mind?</Button>
        </AppView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
})

export default PostButtons