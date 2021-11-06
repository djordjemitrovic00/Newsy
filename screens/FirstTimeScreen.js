import React, { useEffect, useRef, useState } from 'react';
import {View, Text, Button, TextInput, ImageBackground, SafeAreaView, Image, TouchableHighlight, TouchableWithoutFeedback, Keyboard} from 'react-native';
import auth from '@react-native-firebase/auth'
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native';
import loginStyles from '../styles/loginStyles';
import firebase from '@react-native-firebase/firestore'
import CheckBox from '@react-native-community/checkbox';
import registerStyles from '../styles/registerStyles';

const FirstTimeScreen = ({navigation}) => {

    const [username, setUsername] = useState('');
    const [usernameByMail, setUsernameByMail] = useState();
    const [availableUsername, setUsernameAvailability] = useState(true);
    const [validUsername, setUsernameValidStatus] = useState(false);
    const [signUpMethod, setSignUpMethod] = useState('');
    const [fullName, setFullName] = useState('');
    const [stateOfUsername, setStateOfUsername] = useState('notTyped');
    const [errorMessageUsername, setErrorMessageUsername] = useState();
    const [selected, setSelected] = useState();
    const [signUpBtnSelected, setSignUpBtnSelected] = useState(false);
    const [showErrorSelected, setShowErrorSelected] = useState(false);

    const refForFocus = useRef();

    useEffect(() => {

        refForFocus.current.focus()
        let mailFiltered = String(auth().currentUser.email).slice(0, String(auth().currentUser.email).indexOf('@', 0));
        auth().currentUser.providerData.forEach(item => {

            if (item.providerId == 'google.com') {

                setSignUpMethod('google')

            }
        })

        if (usernameByMail == undefined) {
            setUsernameByMail(mailFiltered);
        }

    }, [])

    useEffect(() => {

        if (usernameByMail) {
            setUsername(usernameByMail);
            setFullName(usernameByMail)
        }

    }, [usernameByMail])

    useEffect(() => {
        if (username == usernameByMail) {
            CheckForUsername()
        }
    }, [username])

    useEffect(() => {

        firestore().collection('users').where('username', '==', username).get().then(querySnapshot => {

            if (querySnapshot.size == 0) {

                setUsernameAvailability(true);

            } else {

                setUsernameAvailability(false);

            }

        }).catch(error=>console.log(error))

        if (username.length < 5) {

            setUsernameValidStatus(false);

        } else {

            setUsernameValidStatus(true)

        }
        
    },[username])

    const clickSignUpButton = () => {
        setSignUpBtnSelected(true);
    }

    const unClickSignUpButton = () => {
        setSignUpBtnSelected(false);
    }

    const handleUsernameChangeText = (value) => {
        setUsername(value);
    }

    const CheckForUsername = async () => {

        await firestore().collection('users').where('username', '==', username.toLowerCase()).get()
        .then(querySnapshot => {

            if (querySnapshot.size == 0) {
                
                if (username.length != 0) {
                    setStateOfUsername('correct');
                    setErrorMessageUsername('')
                } else {
                    setErrorMessageUsername('Please enter username!')
                    setStateOfUsername('incorrect');
                }

            } else {

                if (username.length != 0) {
                    setStateOfUsername('incorrect');
                    setErrorMessageUsername('Username is not available!')
                } else {
                    setStateOfUsername('incorrect');
                    setErrorMessageUsername('Please enter username!')
                }

            }
        })
        .catch(error=>console.log(error));
    }

    const handleNameChangeText = (value) => {
        setFullName(value);
        if (value.length != 0) {
            setChangedName(true);
        }
    }

    const continueRegister = () => {
        if (availableUsername && validUsername && selected) {
            let avatar = auth().currentUser.photoURL;

            firestore().collection('users').add({
                username: username,
                firstAndLastName: fullName,
                mail: auth().currentUser.email,
                firstTime: false,
                signUpMethod: signUpMethod,
                verifiedMail: true,
                numOfFriends: 0,
                numOfPostsMade: 0,
                friends: [],
                description: 'Hello! My name is ' + fullName,
                postsMade: [],
                avatarMethod: 'source',
                avatar: auth().currentUser.photoURL,
                numOfSentFriendRequests: 0,
                sentFriendRequests: [],
                numOfFriendRequests: 0,
                friendRequests: [],
                numOfSavedPosts: 0,
                savedPosts: []
            })

            navigation.navigate('Home')
            
        } else if (!selected) {
            setShowErrorSelected(true);
        }
    }

    const handleChangeCheckBox = (value) => {
        setSelected(value);
        if (value == true) {
            setShowErrorSelected(false)
        }
    }

    const imageToShowForUsername = (stateOfUsername == 'notTyped') ? (
        <Image source={require('../assets/icons/username.png')} style={loginStyles.usernameImage}/>
    ) : (
        (stateOfUsername == 'typing') ? (
            <Image source={require('../assets/icons/username_filled.png')} style={loginStyles.usernameImage}/>
        ) : (
            (stateOfUsername == 'correct') ? (
                <Image source={require('../assets/icons/username_filled.png')} style={loginStyles.usernameImagePurple}/>
            ) : (
                <Image source={require('../assets/icons/username_filled.png')} style={loginStyles.usernameImageRed}/>
            )
        )
    )

    const errorMessageSelected = (showErrorSelected) ? (
        <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>You must agree to terms and conditions!</Text>
        </View>
    ) : (
    <View></View>
    )

    const imageToShowForName = (fullName.length != 0) ? (
        <Image source={require('../assets/icons/username_filled.png')} style={loginStyles.usernameImagePurple}/>
    ) : (
        <Image source={require('../assets/icons/username_filled.png')} style={loginStyles.usernameImageRed}/>
    )


    return(
        <SafeAreaView style={{flex: 1,}}>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                <ImageBackground source={require('../assets/backgrounds/backgroundmain.png')} style={{flex: 1,}}>

                    <View style={{marginTop: 60,marginBottom: 40,}}>

                        <Text style={[loginStyles.loginText, {color: 'purple'}]}>Final steps...</Text>

                    </View>

                    <Text style={{textAlign:'center', fontFamily: 'Poppins-Bold', color: 'purple'}}>Your name</Text>

                    <View style={loginStyles.usernameContainer}>

                        <View style={{zIndex: 50}}>

                            {imageToShowForName}

                        </View> 

                        <TextInput ref={refForFocus}
                        onChangeText={(value) => handleNameChangeText(value)} 
                        value={fullName}
                        style={loginStyles.inputStyle}/>

                    </View>

                    <Text style={{textAlign:'center', fontFamily: 'Poppins-Bold', color: 'purple', marginTop: 20,}}>Username</Text>

                    <View style={loginStyles.usernameContainer}>

                        <View style={{zIndex: 50}}>
                            {imageToShowForUsername}
                        </View> 

                        <TextInput 
                        onChangeText={(value) => handleUsernameChangeText(value)} 
                        value={username}
                        onEndEditing={CheckForUsername}  
                        style={loginStyles.inputStyle}/>

                    </View>

                    <Text style={loginStyles.errorText}>{errorMessageUsername}</Text>

                    <View style={registerStyles.conditionsBox}>

                        <CheckBox
                            tintColors={{true: 'purple', false: 'purple'}}
                            value={selected}
                            onValueChange={(value) => handleChangeCheckBox(value)}
                            />

                        <Text style={{fontFamily: 'Poppins-regular', paddingTop: 6,}}>I accept the terms and conditions.</Text>

                    </View>

                    {errorMessageSelected}

                    <TouchableHighlight onPress={() => continueRegister()}
                        underlayColor='purple'
                        onShowUnderlay={() => clickSignUpButton()} 
                        onHideUnderlay={() => unClickSignUpButton()}
                        style={(signUpBtnSelected) ? (registerStyles.signUpBtnSelected) : (registerStyles.signUpBtnNotSelected )}>

                        <Text style={(signUpBtnSelected) ? (registerStyles.signUpBtnTextSelected) : (registerStyles.signUpBtnText)}>
                            CONTINUE
                        </Text>

                    </TouchableHighlight>
            
                </ImageBackground>

            </TouchableWithoutFeedback>

        </SafeAreaView>

    )
}

export default FirstTimeScreen;