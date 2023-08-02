import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';



function LogOutButton({onPress}) {
    return (
        <View style={{height: "5%", width: "112%", position:"absolute", marginTop: -100, marginLeft: -20, alignItems:"flex-end"}}>
            <TouchableOpacity onPress={onPress} style={{flexDirection:"row"}}>
                <Icon name='logout' color="white" size={30} style={{top: 1}}></Icon>
            </TouchableOpacity>
        </View>
    );
}

export default LogOutButton;