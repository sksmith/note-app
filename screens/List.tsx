import { useState, useEffect, useCallback } from "react";
import { ListRenderItem, FlatList, RefreshControl, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useGlobalState, GlobalStateInterface } from "../store/Store";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import base64 from 'react-native-base64'
import { SafeAreaView } from "react-native-safe-area-context";
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

interface Error {
    status: string
}

export default function List({ navigation }: ListProps) {
    const { state, setState } = useGlobalState();
    const isFocused = useIsFocused();
    const [error, setError] = useState<Partial<Error>>({})
    const [items, setItems] = useState<Partial<Notes>>({})
    const [refreshing, setRefreshing] = useState(false)
    const [selectedId, setSelectedId] = useState("")

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

    if (error.status) {
        return <Text>Error: {error.status}</Text>
    } else if (refreshing) {
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