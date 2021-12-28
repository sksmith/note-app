import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGlobalState, GlobalStateInterface } from "../store/Store";

interface LoginProps {
    navigation: NativeStackNavigationProp<any, any>
}

export default function Login({ navigation }: LoginProps) {

    const { state, setState } = useGlobalState();
    const [username, setUsername] = useState('test');
    const [password, setPassword] = useState('test');

    const login = () => {
        var state: Partial<GlobalStateInterface> = { username: username, password: password }
        setState((prev) => ({ ...prev, ...state }));
        navigation.navigate('List')
    };

    return (
        <View>
            <TextInput
                style={{ height: 40 }}
                placeholder="Username"
                onChangeText={username => setUsername(username)}
                defaultValue={state.username}
            />

            <TextInput
                style={{ height: 40 }}
                placeholder="Password"
                onChangeText={password => setPassword(password)}
                defaultValue={state.password}
            />

            <Button title="Login" onPress={login} />
        </View>
    );
};