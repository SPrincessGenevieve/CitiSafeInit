import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';



function BackButton({onPress}) {
    return (
        <View style={{height: "5%", width: "25%", position:"absolute", marginTop: -100, marginLeft: -20}}>
            <TouchableOpacity onPress={onPress} style={{flexDirection:"row"}}>
                <Icon name='back' color="white" size={30} style={{top: 1}}></Icon>
                <Text style={{fontSize: 20, marginLeft: 10}}></Text>
            </TouchableOpacity>
        </View>
    );
}

export default BackButton;