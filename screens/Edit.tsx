import { useState, useEffect, useCallback } from "react";
import { View, FlatList, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';
import { useGlobalState, GlobalStateInterface } from "../store/Store";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import base64 from 'react-native-base64'
import { SafeAreaView } from "react-native-safe-area-context";
import AddButon from "../components/AddButton";
import { RouteProp } from "@react-navigation/native";

interface ListProps {
    navigation: NativeStackNavigationProp<any, any>
    route: RouteProp<any, any>
}

interface Note {
    id: string
    title: string
    data: string
    created: Date
    updated: Date
}

interface Error {
    status: string
}

export default function Edit({ route, navigation }: ListProps) {
    const { state, setState } = useGlobalState();
    const [error, setError] = useState<Partial<Error>>({})
    const [note, setNote] = useState<Partial<Note>>({})
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = (noteId: string) => {
        setRefreshing(true)
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Authorization', 'Basic ' + base64.encode(state.username + ":" + state.password));

        fetch("https://notes.seanksmith.me/api/v1/note/" + noteId, {
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
            })
            .then(
                (result) => {
                    setRefreshing(false)
                    setNote(result)
                },
                (error) => {
                    setRefreshing(false)
                    navigation.navigate('Login', { error: error.message })
                }
            );
    }

    const save = () => {
        setRefreshing(true)
        const headers: HeadersInit = new Headers();
        headers.set('Authorization', 'Basic ' + base64.encode(state.username + ":" + state.password));
        headers.set("content-type", "application/json")

        fetch("https://notes.seanksmith.me/api/v1/note", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(note)
        })
            .then(res => {
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
            })
            .then(
                (result) => {
                    var state: Partial<GlobalStateInterface> = { refreshList: true }
                    setState((prev) => ({ ...prev, ...state }));
                    navigation.navigate('List')
                }, (error) => {
                    navigation.navigate('Login', { error: error.message })
                }
            );
    }

    useEffect(() => {
        if (route.params?.id) {
            fetchData(route.params.id);
        }
    }, [])

    const slugify = (str: string) => {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    if (error.status) {
        return <Text>Error: {error.status}</Text>
    } else if (refreshing) {
        return <Text>Loading...</Text>
    } else {
        return (
            <SafeAreaView
                style={styles.container}>
                <TextInput
                    style={styles.input}
                    editable={false}
                    value={note.id}
                    placeholder="ID"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={title => setNote({ ...note, title: title, id: slugify(title) })}
                    value={note.title}
                    placeholder="Title"
                />
                <View
                    style={{
                        borderColor: '#000000',
                        borderWidth: 1,
                        margin: 12
                    }}>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        onChangeText={data => setNote({ ...note, data: data })}
                        value={note.data}
                        placeholder="Your note!"
                        style={{ padding: 10, textAlignVertical: "top" }}
                    />
                </View>
                <AddButon onPress={save} />
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});