import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function ConstButton({ onPress, title, name, disabled }) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        disable = {disabled}
        style={{
          backgroundColor: '#395CDB',
          height: 55,
          borderRadius: 17,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          flexDirection: 'row',
        }}
      >
        <Icon name={name} size={30} color="white"></Icon>
        <Text style={{ marginLeft: 20, fontSize: 16, color: 'white' }}>{title}</Text>
      </TouchableOpacity>
    </>
  );
}

export default ConstButton;
