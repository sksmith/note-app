import { useState, useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGlobalState, GlobalStateInterface } from "../store/Store";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import base64 from 'react-native-base64'
import { SafeAreaView } from "react-native-safe-area-context";

interface ListProps {
    navigation: NativeStackNavigationProp<any, any>
}

interface Notes {
    notes: Array<Note>
}

interface Note {
    id: string
    title: string
    created: Date
    updated: Date
}

interface Error {
    status: string
}

export default function List({ navigation }: ListProps) {
    const { state } = useGlobalState();
    const [error, setError] = useState<Partial<Error>>({})
    const [items, setItems] = useState<Partial<Notes>>({})
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = () => {
        setRefreshing(true)
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Authorization', 'Basic ' + base64.encode(state.username + ":" + state.password));

        fetch("https://notes.seanksmith.me/api/v1/note", {
            headers: requestHeaders
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setRefreshing(false)
                    setItems(result);
                },
                (error) => {
                    console.error(error)
                    setRefreshing(false)
                    setError(error);
                }
            )
    }

    const wait = (timeout: number) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    if (error.status) {
        return <Text>Error: {error.status}</Text>
    } else if (refreshing) {
        return <Text>Loading...</Text>
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.scrollView}
                    data={items.notes}
                    renderItem={({ item }) => <Text>{item.title}</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchData}
                        />
                    }
                />
                <TouchableOpacity
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
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
});