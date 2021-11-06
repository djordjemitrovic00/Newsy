import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, Text, SafeAreaView, TextInput, Button, ImageBackground, TouchableWithoutFeedback, Keyboard, Image, TouchableHighlight, TouchableWithoutFeedbackBase} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { validate } from 'jest-validate';
import validator from 'validator';
import registerStyles from '../../styles/registerStyles';
import loginStyles from '../../styles/loginStyles';
import CheckBox from '@react-native-community/checkbox';

const Register = () => {

    const [name, setName] = useState('');
    const [changedName, setChangedName] = useState(false);
    const [username, setUsername] = useState('');
    const [availableUsername, setAvailableUsernameStatus] = useState(true);
    const [password, setPassword] = useState('');
    const [isStrongPassword, setPasswordStrongStatus] = useState(true);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [samePassword, setSamePasswordStatus] = useState(false);
    const [age, setAge] = useState(18);
    const [isEighteenPlus, setAgeStatus] = useState(true);
    const [mail, setMail] = useState('');
    const [validMail, setValidMail] = useState(false);
    const [availableMail, setAvailableMailStatus] = useState(true);
    const [valid, setValidStatus] = useState(false);
    const [toShowCheckmarkName, setToShowCheckmarkName] = useState(false);
    const [toShowBadCheckmarkName, setToShowBadCheckmarkName] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selected, setSelected] = useState(false);
    const [signUpBtnSelected, setSignUpBtnSelected] = useState(false);
    const [showErrorSelected, setShowErrorSelected] = useState(false);


    const ages = [...Array(70).keys()]

    
    useEffect(() => {
        if (password == passwordConfirm) {
            setSamePasswordStatus(true)
        } else {
            setSamePasswordStatus(false)
        }
    },[password, passwordConfirm])

    useEffect(() => {
        if (validator.isStrongPassword(password)) {
            setPasswordStrongStatus(true);
        } else {
            setPasswordStrongStatus(false);
        }
    }, [password])

    useEffect(() => {
        firestore().collection('users').where('mail', '==', mail).get().then(querySnapshot => {
            if (querySnapshot.size == 0) {
                setAvailableMailStatus(true);
            } else {
                setAvailableMailStatus(false);
            }
        })
    }, [mail])

    const handleUsernameChangeText = (value) => {
        setUsername(value);
        CheckUsernameAvailability(value);
    }

    const handlePasswordChangeText = (value) => {
        setPassword(value);
    }

    const handlePasswordConfirmChangeText = (value) => {
        setPasswordConfirm(value);
    }

    const handleMailChangeText = (value) => {
        setMail(value);
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        if (validator.isEmail(value) == true) {
            setValidMail(true)
        } else {
            setValidMail(false)
        }
        
    }

    const refka = useRef()

    const CheckUsernameAvailability = async (value) => {
        await firestore().collection('users').where('username', '==', value).get().then((querySnapshot) => {
            if (querySnapshot.size == 0) {
                setAvailableUsernameStatus(true);
            } else {
                setAvailableUsernameStatus(false);
            }
        }).catch(error=>console.log(error))
    }

    const CheckCredentials = async () => {
        
        if (availableUsername && availableMail && samePassword && validMail && isStrongPassword && name.length > 0 && selected) {
            setValidStatus(true);
            return Promise.resolve()
        } else {
            setValidStatus(false);
            if (!selected) {
                showSelectedErrorMessage();
            }
            return Promise.reject()
        }
    }

    const registerUser = () => {
        CheckCredentials().then(() => {
                auth().createUserWithEmailAndPassword(mail, password).then(() => {
                    firestore().collection('users').add({
                        username: username,
                        mail: mail,
                        description: 'Hello! My name is ' + name,
                        firstAndLastName: name,
                        firstTime: false,
                        signUpMethod: 'manual',
                        verifiedMail: false,
                        avatar: 'blank',
                        avatarMethod: 'blank', // 'blank', 'source', 'custom',
                        numOfFriends: 0,
                        friends: [],
                        numOfPostsMade: 0,
                        postsMade: [],
                        numOfFriendRequests: 0,
                        friendRequests: [],
                        numOfSentFriendRequests: 0,
                        sentFriendRequests: [],
                        numOfSavedPosts: 0,
                        savedPosts: []

                    })
                }).catch(error=>console.log(error))
    }).catch((err) => console.log(err))     
    }

    const handleNameChangeText = (value) => {
        setName(value);
    }

    useEffect(() => {
        if (name.length > 0) {
            setChangedName(true);
            setToShowCheckmarkName(true);
            setToShowBadCheckmarkName(false);
        }
        if (name.length == 0 && changedName == true) {
            setToShowBadCheckmarkName(true);
            setToShowCheckmarkName(false);
        }
    }, [name])

    const showSelectedErrorMessage = () => {
        setShowErrorSelected(true);
    }

    const errorMessageSelected = (showErrorSelected) ? (
        <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>You must agree to terms and conditions!</Text>
        </View>
    ) : (<View></View>)

    const checkmarkName = (toShowCheckmarkName) ? (
        <View>
            <Icon name="checkcircle" color="#6840a8" size={26} style={loginStyles.checkmarkIcon}/>
        </View>
    ) : (
        (toShowBadCheckmarkName) ? (
            <View>
                <Icon name="exclamationcircleo" color="red" size={26} style={loginStyles.checkmarkIcon}/>
            </View>
        ) : (<View></View>)
    )

    const checkmarkUsername = (availableUsername && username.length > 4) ? (
        <View>
            <Icon name="checkcircle" color="#6840a8" size={26} style={loginStyles.checkmarkIcon}/>
        </View>
    ) : (
        (username.length > 0 || !availableUsername) ? (
            <View>
                <Icon name="exclamationcircleo" color="red" size={26} style={loginStyles.checkmarkIcon}/>
            </View>
        ) : (<View></View>)
    )

    const checkmarkPassword = (isStrongPassword && password.length > 7) ? (
        <View>
            <Icon name="checkcircle" color="#6840a8" size={26} style={loginStyles.checkmarkIcon}/>
        </View>
    ) : (
        (password.length != 0 ) ? (
            <View>
                <Icon name="exclamationcircleo" color="red" size={26} style={loginStyles.checkmarkIcon}/>
            </View>
        ) : (<View></View>)
    )

    const errorMessageUsername = (username.length < 5) ? (
        (username.length != 0) ? (
            <View style={loginStyles.errorTextContainer}>
                <Text style={loginStyles.errorTextBold}>Username must contain at least 5 letters!</Text>
            </View>
        ) : (
            <View></View>
        )
    ) : (
        (!availableUsername) ? (
            <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>Username is not available!</Text>
        </View>
        ) : (
            <View></View>
        )
    )

    const errorMessagePassword = (password.length < 8) ? (
        (password.length != 0) ? (
            <View style={loginStyles.errorTextContainer}>
                <Text style={loginStyles.errorTextBold}>Password must contain at least 8 letters!</Text>
            </View>
        ) : (
            <View></View>
        )
    ) : (
        (!isStrongPassword) ? (
            <View style={{marginHorizontal: 50,}}>
            <View style={loginStyles.errorTextContainer}>
                <Text style={loginStyles.errorTextBold}>Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol!</Text>
            </View>
            </View>
        ) : (<View></View>)
    )

    const checkmarkPasswordConfirm = (samePassword && passwordConfirm.length > 0) ? (
        <View>
            <Icon name="checkcircle" color="#6840a8" size={26} style={loginStyles.checkmarkIcon}/>
        </View>
    ) : (
        (passwordConfirm.length > 0) ? (
            <View>
                <Icon name="exclamationcircleo" color="red" size={26} style={loginStyles.checkmarkIcon}/>
            </View>
        ) : (<View></View>)
    )

    const errorMessagePasswordConfirm = (passwordConfirm.length > 0 && !samePassword) ? (
        <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>Password must be same!</Text>
        </View>
    ) : (<View></View>)

    const checkmarkMail = (validMail && availableMail && mail.length > 0) ? (
        <View>
            <Icon name="checkcircle" color="#6840a8" size={26} style={loginStyles.checkmarkIcon}/>
        </View>
    ) : (
        (mail.length != 0) ? (
            <View>
                <Icon name="exclamationcircleo" color="red" size={26} style={loginStyles.checkmarkIcon}/>
            </View>
        ) : (
            <View></View>
        )
    )

    const errorMessageMail = (mail.length != 0) ? (
        (!validMail) ? (
            <View style={loginStyles.errorTextContainer}>
            <Text style={loginStyles.errorTextBold}>Mail must be valid!</Text>
        </View>
        ) : (
            (!availableMail) ? (
                <View style={loginStyles.errorTextContainer}>
                    <Text style={loginStyles.errorTextBold}>Mail is not available!</Text>
                </View>
            ) : (
                <View></View>
            )
        )
    ) : (
        <View></View>
    )

    const clickSignUpButton = () => {
        setSignUpBtnSelected(true);
        
    }

    const unClickSignUpButton = () => {
        setSignUpBtnSelected(false);
        
    }

    const handleChangeCheckBox = (value) => {
        setSelected(value);
        if (value) {
        if (showErrorSelected) {
            setShowErrorSelected(false);
        }
    }
    }

    return(
        <SafeAreaView style={{flex: 1,}}>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                <ImageBackground source={require('../../assets/backgrounds/backgroundmain.png')} style={{flex: 1,}}>

                <View style={registerStyles.registerTextContainer}>

                    <Text style={registerStyles.registerText}>Register</Text>

                </View>

                <View style={registerStyles.inputContainer}>

                    <TextInput
                    placeholder="Your name" onChangeText={value => handleNameChangeText(value)} style={registerStyles.inputStyle}/>

                    {checkmarkName}

                </View>

                <View style={registerStyles.inputContainer}>

                    <TextInput placeholder='Username' onChangeText={value => handleUsernameChangeText(value)} style={registerStyles.inputStyle}/>            
                    
                    {checkmarkUsername}

                </View>
                
                {errorMessageUsername}

                <View style={registerStyles.inputContainer}>

                    <TextInput 
                    secureTextEntry={(showPassword) ? false : true} 
                    placeholder='Password' 
                    onChangeText={value => handlePasswordChangeText(value)} 
                    style={registerStyles.inputStylePassword}/>

                    <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (<Icon name="eye" color="#6840a8" size={29} style={registerStyles.showPasswordIcon}/>) :
                        (<Icon name="eyeo" color="#6840a8" size={29} style={registerStyles.showPasswordIcon}/>)}

                    </TouchableWithoutFeedback>

                    {checkmarkPassword}

                </View>

                {errorMessagePassword}

                <View style={registerStyles.inputContainer}>

                    <TextInput secureTextEntry={(showPassword) ? false : true}
                    placeholder='Confirm password' onChangeText={value => handlePasswordConfirmChangeText(value)} 
                    style={registerStyles.inputStyle}/>

                    {checkmarkPasswordConfirm}

                </View>

                {errorMessagePasswordConfirm}

                <View style={registerStyles.inputContainer}>

                    <TextInput 
                    placeholder='Mail' 
                    onChangeText={value => handleMailChangeText(value)} 
                    style={registerStyles.inputStyle}/>

                    {checkmarkMail}

                </View>

                {errorMessageMail}

                <View style={registerStyles.conditionsBox}>
                
                <CheckBox
                    tintColors={{true: 'purple', false: 'purple'}}
                    value={selected}
                    onValueChange={(value) => handleChangeCheckBox(value)}
                    />
                    <Text style={{fontFamily: 'Poppins-regular', paddingTop: 6,}}>I accept the terms and conditions.</Text>

                </View>

                {errorMessageSelected}

                <TouchableHighlight onPress={() => registerUser()}
                            underlayColor='purple'
                            onShowUnderlay={() => clickSignUpButton()} 
                            onHideUnderlay={() => unClickSignUpButton()}
                            style={(signUpBtnSelected) ? (registerStyles.signUpBtnSelected) : (registerStyles.signUpBtnNotSelected )}>

                            <Text style={(signUpBtnSelected) ? (registerStyles.signUpBtnTextSelected) : (registerStyles.signUpBtnText)}>SIGN UP</Text>

                </TouchableHighlight>

                <View style={registerStyles.continueWithBox}>
                
                    <Text style={registerStyles.continueWithText}>Or continue with: </Text>
                
                    <View style={registerStyles.googlefacebook}>

                        <TouchableWithoutFeedback>
                        
                            <Image source={require('../../assets/icons/google.png')} style={{height: 50, width: 50,}}/>
                        
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback>
                            
                            <Image source={require('../../assets/icons/facebook.png')} style={{width: 50, height: 50}}/>
                        
                        </TouchableWithoutFeedback>
                    
                    </View>

                </View>

                </ImageBackground>
            </TouchableWithoutFeedback>
        </SafeAreaView>

    )
}

export default Register;