import firestore, { firebase } from '@react-native-firebase/firestore'
import React, { useEffect, useState } from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {View, Text, ActivityIndicator, Image, TouchableHighlight, TouchableWithoutFeedback, NativeModules, TouchableOpacity} from 'react-native';
import profileStyles from '../../styles/profileStyles';
import storage from '@react-native-firebase/storage'

const Profile = ({route, navigation}) => {
    const [myId, setMyId] = useState();
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [idOfProfile, setIdOfProfile] = useState();
    const [loading, setLoading] = useState(true);
    const [sentRequest, setSentRequest] = useState(false);
    const [isMyFriend, setIsMyFriend] = useState(false);
    const [tiktok, setTiktok] = useState(false);
    const [isHeaderImage, setIsHeaderImage] = useState(false);
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
    const [isFriendBtnClicked, setFriendBtnClicked] = useState(false);
    const [isSendMsgBtnClicked, setSendMsgBtnClicked] = useState(false);

    useEffect(() => {
        if (myId) {
            firestore().collection('users').doc(myId).get().then(res => {
                let friendsArray = res.get('sentFriendRequests')
                if (friendsArray.indexOf(idOfProfile) != -1) {
                    setSentRequest(true);
                }
            })
        }
    }, [myId])

    useEffect(() => {
        NativeModules.InternalDBModule.getId((res) => {
            setMyId(res);
        })
    },[]);

    const nav = useNavigation();

    useEffect(() => {
        if (idOfProfile && myId) {
            setTiktok(!tiktok)
        if (idOfProfile == myId) {
            setIsMyProfile(true);
        } else {
            setIsMyProfile(false);
        }
    }
    }, [idOfProfile, myId])

    useEffect(() => {
        if (isMyProfile == true) {
            setNav(true)
        } else {
            setNav(false);
        }
    }, [isMyProfile])

    const setNav = (value) => {
        if (value == true) {
            nav.setOptions({
                headerTitle: (
                    <Image 
                        source={require('../../assets/logo/logoTransparentWhite.png')} 
                        style={{width: 108, height: 40}}
                    />),
                headerStyle: {backgroundColor: '#d599e4'},
                headerTitleAlign: 'center',
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Edit Profile', {myId: myId})}>
                        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 17,marginTop: 4,}}>
                            Edit
                        </Text>
                    </TouchableOpacity>
                )
            })
        } else {
            nav.setOptions({
                headerTitle: () => (
                    <Image 
                        source={require('../../assets/logo/logoTransparentWhite.png')} 
                        style={{width: 108, height: 40}}
                    />),
                headerStyle: {backgroundColor: '#d599e4'},
                headerTitleAlign: 'center',
            })
        }
    }

    useEffect(() => {
        setIdOfProfile(route.params.profileId)
        const subscriber = firestore().collection('users').doc(route.params.profileId.toString()).onSnapshot((res) => {
            setProfile(res.data())
            let friendsArray = res.get('friends')
            NativeModules.InternalDBModule.getId(res2 => {
                friendsArray.forEach(item => {
                    if (item == res2) {
                        setIsMyFriend(true)
                    }
                })
            })
        }, (err) => {
            console.log(err)
        })
        setLoading(false)
        return () => subscriber()
        }, [])

    const sourceOfImage = () => {
        if (profile.avatarMethod == 'blank') {
            return require('../../assets/icons/username_filled.png')
        } else {
            return {uri: profile.avatar}
        }
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

    const sendFriendRequest = () => {
        if (!isMyProfile) {
            if (sentRequest) {
                firestore().collection('users').doc(myId.toString()).update({
                    numOfSentFriendRequests: firebase.firestore.FieldValue.increment(-1),
                    sentFriendRequests: firebase.firestore.FieldValue.arrayRemove(idOfProfile)
                }).then(() => {
                    firestore().collection('users').doc(idOfProfile.toString()).update({
                        numOfFriendRequests: firebase.firestore.FieldValue.increment(-1),
                        friendRequests: firebase.firestore.FieldValue.arrayRemove(myId)
                    }).then(() => {
                        setSentRequest(false)
                    })
                })
            } else {
                firestore().collection('users').doc(myId.toString()).update({
                    numOfSentFriendRequests: firebase.firestore.FieldValue.increment(1),
                    sentFriendRequests: firebase.firestore.FieldValue.arrayUnion(idOfProfile)
                }).then(() => {
                    firestore().collection('users').doc(idOfProfile.toString()).update({
                        numOfFriendRequests: firebase.firestore.FieldValue.increment(1),
                        friendRequests: firebase.firestore.FieldValue.arrayUnion(myId)
                    }).then(() => {
                        setSentRequest(true)
                    })
                })
            }
        }
    }
    
    if (loading) {
        return (<ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>)
    }

    return(
        <View style={profileStyles.container}>

            <View style={profileStyles.headerContainer}>
                
            <View style={profileStyles.headerBackground} />

                { (tiktok) ?
                    (<Image source={sourceOfImage()} style={(isHeaderImage) ? (profileStyles.headerAvatarImage) : (profileStyles.headerAvatar)}/>) 
                :
                    (<Image source={sourceOfImage()} style={(isHeaderImage) ? (profileStyles.headerAvatarImage) : (profileStyles.headerAvatar)}/>) 
                }
            
            </View>
            
            <Text style={profileStyles.usernameText}>@{profile.username}</Text>
            
            <Text style={profileStyles.fullNameText}>{profile.firstAndLastName}</Text>
        
            <View style={profileStyles.buttonsLine}>
        
                {(isMyFriend) ? (null) : (
                    <TouchableHighlight 
                    underlayColor='#d599e4'
                    onShowUnderlay={() => addFriendClicked()}
                    onHideUnderlay={() => addFriendUnclicked()}
                    style={isFriendBtnClicked ? profileStyles.addFriendBtnClicked : profileStyles.addFriendBtn}
                    onPress={() => sendFriendRequest()}>

                        <View>

                            {(!sentRequest) ? (<Text style={profileStyles.addFriendBtnText}>Add a friend</Text>)
                            : (<Text style={profileStyles.addFriendBtnText}>Sent request</Text>)}
                        
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
            
                <Text style={profileStyles.descriptionText}>{profile.description}</Text>
            
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
            
        </View>

    )
}

export default Profile;