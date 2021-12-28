import React, { useState } from 'react';
import { Button, TextInput, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGlobalState, GlobalStateInterface } from "../store/Store";
import { RouteProp } from "@react-navigation/native";

interface LoginProps {
    route: RouteProp<any, any>
    navigation: NativeStackNavigationProp<any, any>
}

export default function Login({ route, navigation }: LoginProps) {
    const { setState } = useGlobalState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        var state: Partial<GlobalStateInterface> = { username: username, password: password, refreshList: true }
        setState((prev) => ({ ...prev, ...state }));
        navigation.navigate('List')
    };

    return (
        <View>
            <TextInput
                style={{ height: 40 }}
                placeholder="Username"
                onChangeText={nusername => setUsername(nusername)}
                value={username}
                defaultValue="test"
            />

            <TextInput
                style={{ height: 40 }}
                placeholder="Password"
                onChangeText={npassword => setPassword(npassword)}
                value={password}
                defaultValue="test"
            />

            <Button title="Login" onPress={login} />

            <Text>{route.params?.error}</Text>
        </View>
    );
};