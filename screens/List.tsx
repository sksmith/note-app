import { useState, useEffect } from "react";
import { ListRenderItem, FlatList, RefreshControl, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useGlobalState, GlobalStateInterface } from "../store/Store";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import base64 from 'react-native-base64'
import { useIsFocused } from "@react-navigation/native";
import AddButon from "../components/AddButton";

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

export default function List({ navigation }: ListProps) {
    const { state, setState } = useGlobalState();
    const isFocused = useIsFocused();
    const [items, setItems] = useState<Partial<Notes>>({})
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = () => {
        setRefreshing(true)
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Authorization', 'Basic ' + base64.encode(state.username + ":" + state.password));

        fetch("https://notes.seanksmith.me/api/v1/note", {
            headers: requestHeaders
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    if (res.status === 401) {
                        throw Error("Invalid username or password")
                    } else {
                        console.error(res)
                        throw Error("An unexpected error has occurred")
                    }
                }
            }).then(
                (result) => {
                    setRefreshing(false)
                    setItems(result)
                },
                (error) => {
                    setRefreshing(false)
                    navigation.navigate('Login', { error: error.message })
                }
            );
    }

    useEffect(() => {
        if (state.refreshList) {
            fetchData();
            var newState: Partial<GlobalStateInterface> = { refreshList: false }
            setState((prev) => ({ ...prev, ...newState }));
        }
    }, [isFocused])

    const renderItem: ListRenderItem<Note> = ({ item }) => {
        return (
            <TouchableOpacity style={[styles.item]} onPress={() => navigation.navigate('Edit', { id: item.id })}>
                <Text style={[styles.title]}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    if (refreshing) {
        return <Text>Loading...</Text>
    } else {
        return (
            <>
                <FlatList
                    data={items.notes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchData}
                        />
                    }
                />
                <AddButon onPress={() => navigation.navigate("Edit")} />
            </>
        );
    }
};

const styles = StyleSheet.create({
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