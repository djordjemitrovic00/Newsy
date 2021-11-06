import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, NativeModules} from 'react-native';
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Signout = () => {

    useEffect(() => {
        NativeModules.InternalDBModule.disconnect();
        GoogleSignin.signOut()
        auth().signOut();  
    })

    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator style={{width: 200, height: 200}} size='large'/>
        </View>

    )
}

export default Signout;