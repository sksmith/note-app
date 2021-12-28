import { TouchableOpacity, GestureResponderEvent, Text, StyleSheet } from 'react-native';

interface AddButtonProps {
    onPress: (event: GestureResponderEvent) => void
}

export default function AddButon({ onPress }: AddButtonProps) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                position: 'absolute',
                bottom: 10,
                right: 10,
                height: 70,
                backgroundColor: '#fff',
                borderRadius: 100,
            }}
        >
            <Text style={{ fontSize: 48 }}>+</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    item: {
        backgroundColor: "lightblue",
        padding: 8,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 16,
    },
});