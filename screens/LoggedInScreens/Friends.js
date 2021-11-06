import React, {useState, useEffect} from 'react';
import {View, Text, NativeModules, Button, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback} from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebase } from '@react-native-firebase/messaging';


const Friends = ({navigation, route}) => {
    const [listOfFriends, setListOfFriends] = useState([]);
    const [listOfFriendsFiltered, setListOfFriendsFiltered] = useState([]);
    const [numOfFriends, setNumOfFriends] = useState(0);
    const [hasFriends, setHasFriends] = useState(false)
    const [listOfSentRequests, setListOfSentRequests] = useState([])
    const [listOfMyRequests, setListOfMyRequests] = useState([]);
    const [numOfMyRequests, setNumOfMyRequests] = useState(0);
    const [listOfMyRequestsFiltered, setListOfMyRequestsFiltered] = useState([]);
    const [myId, setMyId] = useState()
    const [stackNavigation, setStackNavigation] = useState();
    const [tiktok, setTiktok] = useState(false);

    const navig = useNavigation()

    useEffect(() => {
        NativeModules.InternalDBModule.getId(res => {
            setMyId(res);
        })
        setStackNavigation(route.params.naviga);
        navig.setOptions({
            headerStyle: {backgroundColor: '#d599e4'},
            headerTitleStyle: {fontFamily: 'Poppins-Bold', paddingTop: 4, color: 'purple'},
            headerLeft: () => (<TouchableOpacity onPress={() => navigation.goBack()}><View><Icon name='arrow-back' size={27} style={{marginLeft: 10,}}/></View></TouchableOpacity>)
        })
    }, [])

    useEffect(() => {
        if (myId) {
            refreshFriends()
        }
    }, [myId])

    const refreshFriends = () => {
        firestore().collection('users').doc(myId.toString()).get().then(res => {
            let friends = [...res.get('friends')]
            setListOfFriends([...friends]);
            let filtered = [];
            let numberOfFriends = 0;

            friends.forEach(item => {

                firestore().collection('users').doc(item.toString()).get().then(res2 => {
                    numberOfFriends++;
                    filtered.push({
                        userId: res2.id,
                        avatarMethod: res2.get('avatarMethod'),
                        avatar: res2.get('avatar'),
                        username: res2.get('username')
                    })
                }).then(() => {
                    setListOfFriendsFiltered(filtered);
                    setNumOfFriends(numberOfFriends);
                })

            })
            
            setHasFriends(true)
            let sentFriendRequests = [...res.get('sentFriendRequests')]
            let myFriendRequests = [...res.get('friendRequests')]
            setListOfMyRequests([...myFriendRequests]);
            setListOfSentRequests([...sentFriendRequests])
            let filteredRequests = [];
            let numberOfRequests = 0;

            myFriendRequests.forEach(item => {

                firestore().collection('users').doc(item.toString()).get().then(res2 => {
                    numberOfRequests++;
                    filteredRequests.push({
                        userId: res2.id,
                        avatarMethod: res2.get('avatarMethod'),
                        avatar: res2.get('avatar'),
                        username: res2.get('username')
                    })
                }).then(() => {
                    setListOfMyRequestsFiltered([...filteredRequests])
                    setNumOfMyRequests(numberOfRequests)
                    setTiktok(!tiktok)
                })

            })
            
        })
    }

    const acceptFriendRequest = (userId) => {
        firestore().collection('users').doc(myId.toString()).update({
            numOfFriends: firebase.firestore.FieldValue.increment(1),
            friends: firebase.firestore.FieldValue.arrayUnion(userId.toString()),
            numOfFriendRequests: firebase.firestore.FieldValue.increment(-1),
            friendRequests: firebase.firestore.FieldValue.arrayRemove(userId.toString())
        }).then(() => {
            firestore().collection('users').doc(userId.toString()).update({
                numOfFriends: firebase.firestore.FieldValue.increment(1),
                friends: firebase.firestore.FieldValue.arrayUnion(myId.toString()),
                numOfSentFriendRequests: firebase.firestore.FieldValue.increment(-1),
                sentFriendRequests: firebase.firestore.FieldValue.arrayRemove(myId.toString())
            }).then(() => {
                setTimeout(() => {
                    refreshFriends()
                }, 2000)
            })
        })
    }

    const sendMessage = (userId) => {
        stackNavigation.navigate('Each Message', {profileId: userId})
    }

    const rejectFriendRequest = (userId) => {

        firestore().collection('users').doc(myId.toString()).update({
            numOfFriends: firebase.firestore.FieldValue.increment(-1),
            friends: firebase.firestore.FieldValue.arrayRemove(userId.toString())
        }).then(() => {

            firestore().collection('users').doc(userId.toString()).update({
                numOfFriends: firebase.firestore.FieldValue.increment(-1),
                friends: firebase.firestore.FieldValue.arrayRemove(myId.toString())
            }).then(() => {
                refreshFriends();
            })

        })
    }

    const imageSource = (avatarMethod, avatar) => {
        if (avatarMethod == 'blank' || avatarMethod == null) {
            return require('../../assets/icons/username.png')
        } else {
            return {uri: avatar}
        }
    }

    return(
        <View style={{flex: 1,}}>

            <View style={{backgroundColor: '#efefef', elevation: 2, paddingVertical: 8, paddingTop: 11,}}>
                
                <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 30,}}>Friend requests {numOfMyRequests}</Text>
            
            </View>

            <View>
            
            
                {(listOfMyRequestsFiltered.length != 0 ) ? (
                    <FlatList
                    data={listOfMyRequestsFiltered}
                    extraData={[listOfMyRequests, listOfMyRequestsFiltered, numOfMyRequests, tiktok]}
                    renderItem={({item}) => (
                        <View style={{backgroundColor: 'white', elevation: 2, alignItems: 'center', flexDirection: 'row', height: 60, marginHorizontal: 5, marginVertical: 5, paddingHorizontal: 15,}}>
                            
                            <TouchableWithoutFeedback 
                            onPress={() => navigation.navigate('Profile', {profileId: item.userId})}>
                            
                                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                            
                                    <Image source={imageSource(item.avatarMethod, item.avatar)} style={{tintColor: 'purple',width: 40, height: 40, borderRadius: 100,}}/>
                                    
                                    <Text style={{fontFamily: 'Poppins-Regular', marginLeft: 10, color: 'black',fontSize: 16, paddingTop: 3,}}>{item.username}</Text>
                                
                                </View>
                                
                            </TouchableWithoutFeedback>
                            
                            <TouchableOpacity onPress={() => acceptFriendRequest(item.userId)} style={{position: 'absolute', top: 12, right: 60,}}>
                            
                                <Icon name='checkmark' size={30} color='purple' />
                            
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => rejectFriendRequest(item.userId)} style={{position: 'absolute', top: 12, right: 10,}}>
                            
                                <Icon name='ios-close-outline' size={32} color='purple' />
                            
                            </TouchableOpacity>
                        
                        </View>
                    )}
                />) : (<View></View>)}

            </View>
            
            <View style={{backgroundColor: '#efefef', elevation: 2, paddingVertical: 8, paddingTop: 11,}}>

                <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 30,}}>Friends {numOfFriends}</Text>

            </View>

            {(listOfFriends.length != 0 ) ? (
                <FlatList
                data={listOfFriendsFiltered}
                extraData={[listOfFriends, listOfFriendsFiltered, numOfFriends, tiktok]}
                renderItem={({item}) => (
                    
                    <View style={{backgroundColor: 'white', elevation: 2, alignItems: 'center', flexDirection: 'row', height: 60, marginHorizontal: 5, marginVertical: 5, paddingHorizontal: 15,}}>
                        
                        <TouchableWithoutFeedback 
                        onPress={() => stackNavigation.navigate('Profile', {profileId: item.userId})}>
                        
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        
                                <Image source={imageSource(item.avatarMethod, item.avatar)} style={{tintColor: 'purple',width: 40, height: 40, borderRadius: 100,}}/>
                                
                                <Text style={{fontFamily: 'Poppins-Regular', marginLeft: 10, color: 'black',fontSize: 16, paddingTop: 3,}}>{item.username}</Text>
                            
                            </View>
                        
                        </TouchableWithoutFeedback>
                        
                        <TouchableOpacity onPress={() => sendMessage(item.userId)} style={{position: 'absolute', top: 12, right: 10,}}>
                        
                            <Icon name='chatbubbles-outline' size={32} color='purple' />
                        
                        </TouchableOpacity>
                    
                    </View>
                )}
            />) : (<View></View>)}
            
        </View>

    )
}

export default Friends;