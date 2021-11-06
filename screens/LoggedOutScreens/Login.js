import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ScrollView, View, Text, SafeAreaView, Button, TextBase, Image, ImageBackground, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TouchableHighlight, Dimensions} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import globalStyles from '../../styles/globalStyles';
import { TextInput } from 'react-native-gesture-handler';
import loginStyles from '../../styles/loginStyles';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId: '', //YOUR CLIENT ID
});

const Login = ({route, navigation}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stateOfUsername, setStateOfUsername] = useState('notTyped');
    const [stateOfPassword, setStateOfPassword] = useState('notTyped');
    const [isFocusedUsername, setFocusUsername] = useState(false);
    const [isFocusedPassword, setFocusPassword] = useState(false);
    const [isCorrect, setCorrect] = useState(false);
    const [isTyping, setTyping] = useState(false);
    const [errorMessageUsername, setErrorMessageUsername] = useState();
    const [errorMessagePassword, setErrorMessagePassword] = useState();
    const [googleBtnSelected, setGoogleBtnSelected] = useState(false);
    const [facebookBtnSelected, setFacebookBtnSelected] = useState(false);

    async function onGoogleButtonPress() {

        const { idToken } = await GoogleSignin.signIn();

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        return auth().signInWithCredential(googleCredential);
    }

    async function onFacebookButtonPress() {

        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }

        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
          throw 'Something went wrong obtaining access token';
        }

        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        return auth().signInWithCredential(facebookCredential);
    }

    useEffect(() => {

        if (stateOfUsername != 'notTyped') {
            if (!isTyping) {
                setTyping(true);
            }

            timer = setTimeout(()=> {
                setTyping(false);
                CheckForUsername();
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [username]);

    useEffect(() => {
        if (stateOfUsername == 'correct') { 
            setCorrect(true)
        } else { 
            setCorrect(false)
        }
    }, [stateOfUsername])

    useEffect(() => {
        if (password.length != 0) {
            setStateOfPassword('typing');
        }
    },[password])

    const textInputRef = useRef();
    
    let timer;

    const LoginAttempt = () => {
        
        if (stateOfUsername == 'correct' && stateOfPassword != 'incorrect') {

            firestore().collection('users').where('username', '==', username).get()
            .then(querySnapshot => {
                let mail;

                querySnapshot.forEach(data => {
                    mail = data.data().mail;
                })

                auth().signInWithEmailAndPassword(mail, password)
                .then(() => {})
                .catch(error => {
                    if (error.code == 'auth/wrong-password') {
                        setErrorMessagePassword('Wrong password!')
                        setStateOfPassword('incorrect')
                    }
                })
            }).catch(error => console.log(error))
        }
    }

    const FocusingHandler = () => {
        if (stateOfUsername == 'notTyped') setStateOfUsername('typing');
        setFocusUsername(true);
    }

    const onEndHandler = () => {
        setFocusUsername(false);
        if (username.length == 0) {
            setStateOfUsername('incorrect')
            setErrorMessageUsername('Please enter username!')
        }
    }

    const CheckForUsername = async () => {

            await firebase.firestore().collection('users').where('username', '==', username).get()
            .then(querySnapshot => {

                if (querySnapshot.size == 0) {

                    setStateOfUsername('incorrect');
                    if (username.length != 0) {
                        setErrorMessageUsername('Username not found!')
                    } else {
                        setErrorMessageUsername('Please enter username!')
                    }

                } else {

                    if (username.length != 0) {
                        setStateOfUsername('correct');
                    } else {
                        setStateOfUsername('incorrect');
                        setErrorMessageUsername('Please enter username!')
                    }

                }

            }).catch(error=>console.log(error));
    }

    const FocusingHandlerPassword = () => {
        setFocusPassword(true);
    }

    const onEndHandlerPassword = () => {
        setFocusPassword(false);
        if (password.length < 5) {
            setStateOfPassword('incorrect')
            setErrorMessagePassword('Password must contain atleast 8 characters!')
        }
    }

    const ChangeHandler = (value) => {
        setUsername(value);
    }

    const PressGoogleBtn = () => {
        setGoogleBtnSelected(true)
    }

    const UnPressGoogleBtn = () => {
        setGoogleBtnSelected(false);
    }

    const PressFacebookBtn = () => {
        setFacebookBtnSelected(true);
    }

    const UnPressFacebookBtn = () => {
        setFacebookBtnSelected(false);
    }

    const imageToShowForUsername = (stateOfUsername == 'notTyped') ? (
        <Image source={require('../../assets/icons/username.png')} style={loginStyles.usernameImage}/>
    ) : (
        (stateOfUsername == 'typing') ? (
            <Image source={require('../../assets/icons/username_filled.png')} style={loginStyles.usernameImage}/>
        ) : (
            (stateOfUsername == 'correct') ? (
                <Image source={require('../../assets/icons/username_filled.png')} style={loginStyles.usernameImagePurple}/>
            ) : (
                <Image source={require('../../assets/icons/username_filled.png')} style={loginStyles.usernameImageRed}/>
            )
        )
    )

    const imageToShowForPassword = (stateOfPassword == 'notTyped') ? (
        <Image source={require('../../assets/icons/password.png')} style={loginStyles.passwordImage}/>
    ) : (
        (stateOfPassword == 'typing') ? (
            <Image source={require('../../assets/icons/password_filled.png')} style={loginStyles.passwordImage}/>
        ) : (
            <Image source={require('../../assets/icons/password_filled.png')} style={loginStyles.passwordImageRed}/>
        )
    )

    const errorShownUsername = (stateOfUsername == 'incorrect') ? (
        <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>{errorMessageUsername}</Text>
        </View>
    ) : (<></>)

    const errorShownPassword = (stateOfPassword == 'incorrect') ? (
        <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>{errorMessagePassword}</Text>
        </View>
    ) : (<View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}></Text>
        </View>
    )

    const ShowOfCheckmark = (isCorrect) ? (
        <View>
            <Icon name="checkcircle" color="#6840a8" size={26} style={loginStyles.checkmarkIcon}/>
        </View>
    ) : (
        <></>
    )

    return(

        <SafeAreaView style={globalStyles.container}>

            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>

                <ImageBackground source={require('../../assets/backgrounds/bgimage.png')} style={globalStyles.backgroundImageContainer}>
            
                    <View style={loginStyles.loginContainer}>

                        <View style={loginStyles.loginTextContainer}>

                            <Text style={loginStyles.loginText}>Login</Text>

                        </View>

                        <View style={loginStyles.loginComponentsContainer}>

                            <View style={loginStyles.usernameContainer}>

                                <View style={{zIndex: 50}}>
                                    {imageToShowForUsername}
                                </View>

                                <TextInput ref={textInputRef} 
                                onChangeText={(value) => ChangeHandler(value)} 
                                style={(isFocusedUsername) ? (loginStyles.inputStyleFocused) : (loginStyles.inputStyle)} 
                                onFocus={() => FocusingHandler()} 
                                onEndEditing={() => onEndHandler()} 
                                placeholder="Username..."/>

                                {ShowOfCheckmark}

                            </View>

                            {errorShownUsername}

                            <View style={loginStyles.passwordContainer}>

                                <View style={{zIndex: 50}}>

                                    {imageToShowForPassword}

                                </View>

                            <TextInput  onChangeText={(value) => setPassword(value)}                     
                            style={(isFocusedPassword) ? (loginStyles.inputStyleFocused) : (loginStyles.inputStyle)} 
                            onFocus={() => FocusingHandlerPassword()} onEndEditing={()=> onEndHandlerPassword()}
                            secureTextEntry={true} 
                            placeholder="Password..."/>

                            </View>


                            {errorShownPassword}

                            <TouchableOpacity onPress={() => LoginAttempt()} style={loginStyles.loginBtn}>

                                <Text style={loginStyles.loginBtnText}>Sign in</Text>

                            </TouchableOpacity>


                            <View style={loginStyles.forgotPasswordContainer}>

                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>

                                    <Text style={loginStyles.forgotPasswordFirstText}>Forgot your password?</Text>

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={loginStyles.buttonsContainer}>

                            <View style={(googleBtnSelected) ? (loginStyles.loginWithGoogleContainerSelected) : (loginStyles.loginWithGoogleContainer )}>

                                <TouchableHighlight onPress={() => onGoogleButtonPress().then(console.log('Signed in with Google!'))}
                                    underlayColor='#d599e4'
                                    onShowUnderlay={() => PressGoogleBtn()} onHideUnderlay={() => UnPressGoogleBtn()}
                                    style={(googleBtnSelected) ? (loginStyles.googleBtnSelected) : (loginStyles.googleBtnNotSelected )}>

                                    <Text style={(googleBtnSelected) ? (loginStyles.loginWithGoogleBtnTextSelected) : (loginStyles.loginWithGoogleBtnText)}>SIGN IN WITH GOOGLE</Text>

                                </TouchableHighlight>

                            </View>


                            <View style={(facebookBtnSelected) ? (loginStyles.loginWithFacebookContainerSelected) : (loginStyles.loginWithFacebookContainer )}>

                            <TouchableHighlight onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
                            underlayColor='#d599e4'
                            onShowUnderlay={() => PressFacebookBtn()} onHideUnderlay={() => UnPressFacebookBtn()}
                            style={(facebookBtnSelected) ? (loginStyles.facebookBtnSelected) : (loginStyles.facebookBtnNotSelected )}>

                                <Text style={(facebookBtnSelected) ? (loginStyles.loginWithFacebookBtnTextSelected) : (loginStyles.loginWithFacebookBtnText)}>SIGN IN WITH FACEBOOK</Text>

                            </TouchableHighlight>

                            </View>

                        </View>

                    </View>

                </ImageBackground>

           </TouchableWithoutFeedback>

        </SafeAreaView>

    )
}

export default Login;