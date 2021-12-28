import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGlobalState, GlobalStateInterface } from "../store/Store";

interface LoginProps {
    navigation: NativeStackNavigationProp<any, any>
}

export default function Login({ navigation }: LoginProps) {

    const { state, setState } = useGlobalState();
    const [username, setUsername] = useState("test");
    const [password, setPassword] = useState("test");

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
                onChangeText={username => setUsername(username)}
                value={state.username}
                defaultValue={"test"}
            />

            <TextInput
                style={{ height: 40 }}
                placeholder="Password"
                onChangeText={password => setPassword(password)}
                value={state.password}
                defaultValue={"test"}
            />

            <Button title="Login" onPress={login} />
        </View>
    );
};