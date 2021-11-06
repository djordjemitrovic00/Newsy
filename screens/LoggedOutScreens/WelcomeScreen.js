import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {View, Text, ImageBackground, SafeAreaView, Button, TouchableWithoutFeedback, ScrollView, Dimensions, Image, Keyboard, TouchableHighlight } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import welcomeStyles from '../../styles/welcomeStyles';

const WelcomeScreen = ({navigation}) => {

    const [isLoginBtnPressed, setLoginBtnPressed] = useState(false);
    const [isRegisterBtnPressed, setRegisterBtnPressed] = useState(false);

    const loginPressed = () => {
        setLoginBtnPressed(true);
    }

    const loginNotPressed = () => {
        setLoginBtnPressed(false);
    }

    const registerPressed = () => {
        setRegisterBtnPressed(true);
    }

    const registerNotPressed = () => {
        setRegisterBtnPressed(false);
    }

    return(
        <SafeAreaView style={globalStyles.container}>
            
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            
                <ImageBackground source={require('../../assets/backgrounds/bgW.png')} 
                style={welcomeStyles.bgImage}>
                
                


                <View style={welcomeStyles.logoWithText}>

                    <Text style={welcomeStyles.textBeforeLogo}>I see, You see,</Text>

                    <Image source={require('../../assets/logo/logoTransparentWhite.png')}/> 

                </View>

                <View style={welcomeStyles.description}>

                    <Text style={welcomeStyles.descriptionTitleText}>
                        STAY INFORMED
                    </Text>

                    <Text style={welcomeStyles.descriptionContentText}>
                        Find out the latest news and comment it with community
                    </Text>

                </View>

                <View style={welcomeStyles.signButtons}>

                    <TouchableHighlight onPress={() => navigation.navigate('Register')} 
                    underlayColor='#d599e4'
                    onShowUnderlay={() => registerPressed()} 
                    onHideUnderlay={() => registerNotPressed()}
                    style={isRegisterBtnPressed ? welcomeStyles.registerBtnPressed : welcomeStyles.registerBtn} >
                        
                        <Text style={isRegisterBtnPressed ? welcomeStyles.registerBtnTextPressed : welcomeStyles.registerBtnText}>
                            NEW TO NEWSY?
                            </Text>

                    </TouchableHighlight>


                    <TouchableHighlight onPress={() => navigation.navigate('Login')} 
                    underlayColor='#d599e4'
                    onShowUnderlay={() => loginPressed()} 
                    onHideUnderlay={() => loginNotPressed()}
                    style={(isLoginBtnPressed) ? welcomeStyles.loginBtnPressed : welcomeStyles.loginBtn}>

                        <Text style={(isLoginBtnPressed) ? welcomeStyles.loginBtnTextPressed : welcomeStyles.loginBtnText}>
                            SIGN IN
                        </Text>
                    
                    </TouchableHighlight>


                </View>



                </ImageBackground>

            </TouchableWithoutFeedback>

        </SafeAreaView>

    )
}

export default WelcomeScreen;