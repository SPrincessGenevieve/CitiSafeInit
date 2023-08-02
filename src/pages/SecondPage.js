import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TextInput, VirtualizedList } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ConstButton from '../components/ConstButton';
import ConstInput from '../components/ConstInput';


export default function SecondPage({onPress}){

    return(
        <View style={styles.container}>
                <Image style={{height: "90%", width:"100%", position:"absolute", top: 1}} source={require('./../assets/images/header.png')}/>           
                <GradientBackground></GradientBackground>
            <View style={{backgroundColor:"transparent", height: "50%", width: "90%", position:"absolute", top: 1, marginTop: 80}}>
                <ConstInput text="Input your username" placeholder="username"></ConstInput>
                <ConstInput text="Input your password" placeholder="password"></ConstInput>
                <View style={{marginTop: 30}}>
                    <ConstButton name="login" onPress={onPress} title="Sign In"></ConstButton>
                </View>
                <View style={{alignItems:"center", marginTop: 20}}>
                    <TouchableOpacity>
                        <  Text style={{color:"white", fontSize: 17}}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"white",
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
  