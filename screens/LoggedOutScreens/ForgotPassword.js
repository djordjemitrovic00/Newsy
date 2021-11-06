import React, { useEffect, useState } from 'react';
import {View, Text, Button} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ForgotPassword = () => {

    const [mail, setMail] = useState('')

    useEffect(()=>{
        console.log('ForgotPassword strana')
    },[]);

    const handleAction = () => {
        auth().sendPasswordResetEmail(mail)
    }
    return(
        <View>
            <Text>ForgotPassword Screen</Text>
            <Button title="forgot pass" onPress={() =>handleAction()}/>
        </View>

    )
}

export default ForgotPassword;