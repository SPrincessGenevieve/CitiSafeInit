import React from 'react';
import { Text, TextInput } from 'react-native';
function ConstInput({placeholder, text}) {
    return (
        <>
            <Text style={{fontSize: 15, color: "white", marginBottom: 15}}>{text}</Text>
            <TextInput placeholder={placeholder} placeholderTextColor="white" style={{color:"white", borderWidth: 0.9, borderRadius: 10, padding: 10, borderColor:"white", fontSize: 17, marginBottom: 25}}></TextInput>
        </>
    );
}

export default ConstInput;