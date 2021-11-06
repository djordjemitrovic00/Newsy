import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, TextInput, TouchableHighlight, TouchableWithoutFeedback, Image, NativeModules, ActivityIndicator, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import profileStyles from '../../styles/profileStyles';
import { utils } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import ImagePicker, {launchImageLibrary} from 'react-native-image-picker';


const EditProfile = ({route, navigation}) => {

    const [isFriendBtnClicked, setFriendBtnClicked] = useState(false);
    const [isSendMsgBtnClicked, setSendMsgBtnClicked] = useState(false);
    const [idOfProfile, setIdOfProfile] = useState();
    const [isMyFriend, setIsMyFriend] = useState(false);
    const [myId, setMyId] = useState();
    const [tiktok, setTiktokl] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        firstAndLastName: '',
        username: '',
        avatarMethod: '',
        avatar: '',
        numOfFriends: 0,
        friends: [],
        numOfPostsMade: 0,
        postsMade: [],
        description: '',

    });
    const [newProfile, setNewProfile] = useState({
        firstAndLastName: '',
        username: '',
        avatarMethod: '',
        avatar: '',
        numOfFriends: 0,
        friends: [],
        numOfPostsMade: 0,
        postsMade: [],
        description: '',

    });

    useEffect(() => {
        setIdOfProfile(route.params.myId)
        firestore().collection('users').doc(route.params.myId.toString()).get().then(res => {
            setProfile(res.data())
            setNewProfile(res.data());
            let friendsArray = res.get('friends')
            NativeModules.InternalDBModule.getId(res2 => {
                friendsArray.forEach(item => {
                    if (item == res2) {
                        setIsMyFriend(true)
                    }
                })
                setMyId(res2)

            })
            setLoading(false);
        })
    }, [])

    const sourceOfImage = () => {
        if (newProfile.avatarMethod == 'blank') {
            return require('../../assets/icons/username.png')
        } else if (newProfile.avatarMethod == 'source') {
            return {uri: newProfile.avatar}
        } else {
            const reference = storage().ref('/avatar/' + myId + '.png')
            reference.getDownloadURL().then(res => {
                return {uri: res}
            })
        }
    }

    const nav = useNavigation();

    useLayoutEffect(() => {
        nav.setOptions({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {fontFamily: 'Poppins-Bold'},
            headerStyle: {backgroundColor: '#d599e4', paddingTop: 3},
            headerRight: () => (
                <TouchableOpacity onPress={() => doneChanges()}>
                <Icon name='checkmark' size={30} color='purple'/>
                </TouchableOpacity>
            )
        })
    }, [newProfile])

    const changeProfilePhoto = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
              skipBackup: true,
              path: 'images'
            }
        };
        let filepath;
        launchImageLibrary(options, (res) => {
            if (!res.didCancel) {
            let Assets = res.assets;
            Assets.forEach(item => {
                filepath = item.uri;
            })
            const reference = storage().ref('/avatar/' + myId + '.png')
            const task = reference.putFile(filepath)
            task.then(() => {
                let imageurl = reference.getDownloadURL().then(res2 => {
                    let NewProfile = {...newProfile};
                    NewProfile.avatarMethod = 'storage'
                    NewProfile.avatar = res2
                    setNewProfile(NewProfile)
                    setTiktokl(!tiktok)
                    
                })
            })
            task.catch(err => console.log(err));
            }
        })
        
    }

    const doneChanges = () => {
        let NewProfile = newProfile
        let MyId = route.params.myId

        firestore().collection('users').doc(MyId.toString()).update({
            firstAndLastName: NewProfile.firstAndLastName,
            username: NewProfile.username,
            avatar: NewProfile.avatar,
            avatarMethod: NewProfile.avatarMethod,
            description: NewProfile.description
        }).then(() => {
            ToastAndroid.show("Changes saved.", ToastAndroid.SHORT)
            navigation.goBack()
        })
    }

    const handleNameChange = (value) => {
        let NewProfile = {...newProfile};
        NewProfile.firstAndLastName = value;
        setNewProfile(NewProfile)
    }

    const handleChangeText = (value) => {
        let newProfileEdit = {...newProfile}
        newProfileEdit.description = value;
        setNewProfile(newProfileEdit)
    }

    const addFriendClicked = () => {
        setFriendBtnClicked(true);
    }

    const addFriendUnclicked = () => {
        setFriendBtnClicked(false);
    }

    const sendMsgClicked = () => {
        setSendMsgBtnClicked(true);
    }

    const sendMsgUnclicked = () => {
        setSendMsgBtnClicked(false);
    }

    if (loading) {
        return (<ActivityIndicator size='large' color='purple' style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}/>)
    }

    return(
        <SafeAreaView style={profileStyles.container}>

            <View style={profileStyles.headerContainer}>
                
                <View style={profileStyles.headerBackground} />
                    
                <TouchableWithoutFeedback onPress={() => changeProfilePhoto()}>
                    
                    <View style={profileStyles.headerAvatar}>
                        { (tiktok) ?
                            (<Image source={sourceOfImage()} style={{width: 120, height: 120}}/>) 
                        :
                            (<Image source={sourceOfImage()} style={{width: 120, height: 120}}/>) 
                        }
                        
                        <View style={profileStyles.editAvatar}>
                        
                            <Text style={{fontFamily:'Poppins-Regular', fontSize: 20}}>Edit </Text>
                        
                            <Icon name="pencil" size={24}/>
                        
                        </View>
                    
                    </View>
                
                </TouchableWithoutFeedback>
                
            </View>

            <Text style={profileStyles.usernameText}>@{profile.username}</Text>

            <TextInput style={profileStyles.fullNameTextEdit} 
            value={newProfile.firstAndLastName} 
            onChangeText={(value) => handleNameChange(value)}
            multiline={false}/>
            
            <View style={profileStyles.buttonsLine}>
            
                {(isMyFriend) ? (null) : (
                    <TouchableHighlight 
                    underlayColor='#d599e4'
                    onShowUnderlay={() => addFriendClicked()}
                    onHideUnderlay={() => addFriendUnclicked()}
                    style={isFriendBtnClicked ? profileStyles.addFriendBtnClicked : profileStyles.addFriendBtn}
                    onPress={() => {}}>

                        <View>

                            
                            <Text style={profileStyles.addFriendBtnText}>Add a friend</Text>
                        
                        </View>
                    
                    </TouchableHighlight>   
                )}

                <TouchableHighlight style={isSendMsgBtnClicked ? profileStyles.sendMsgBtnClicked : profileStyles.sendMsgBtn}
                underlayColor='#d599e4'
                onShowUnderlay={() => sendMsgClicked()}
                onHideUnderlay={() => sendMsgUnclicked()}
                onPress={() => {
                    if (!isMyProfile) {
                        navigation.navigate('Each Message', {profileId: idOfProfile})
                    }
                }}>

                    <Text style={profileStyles.sendMsgBtnText}>Send message</Text>
                    
                </TouchableHighlight>

            </View>

            <View style={profileStyles.descriptionContainer}>

                <TextInput value={newProfile.description} 
                onChangeText={value => handleChangeText(value)}
                style={profileStyles.descriptionTextEdit} multiline={true}/>
                
            </View>

            <View style={profileStyles.numberLine}>
                    
                <TouchableWithoutFeedback style={profileStyles.friends}>
                    
                    <View style={profileStyles.friends}>
                    
                        <Text style={profileStyles.friendsText}>Friends</Text>
                    
                        <Text style={profileStyles.friendsNumberText}>{profile.numOfFriends}</Text>
                    
                    </View>
                    
                </TouchableWithoutFeedback>
                    
                <TouchableWithoutFeedback style={profileStyles.friends}>
                    
                    <View style={profileStyles.friends}>
                    
                        <Text style={profileStyles.postsText}>Posts</Text>
                    
                        <Text style={profileStyles.postsNumberText}>{profile.numOfPostsMade}</Text>
                    
                    </View>
                    
                </TouchableWithoutFeedback>
                
            </View>
            
        </SafeAreaView>

    )
}

export default EditProfile;