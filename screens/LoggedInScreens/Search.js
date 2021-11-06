import React, {useEffect, useState, useRef} from 'react';
import {View, Text, ImageBackground,Image, TouchableWithoutFeedback, Keyboard, TextInput, TouchableHighlight, FlatList, NativeModules, TouchableOpacity} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import loginStyles from '../../styles/loginStyles';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import storage from '@react-native-firebase/storage'

import searchStyles from '../../styles/searchStyles';

const Search = ({navigation}) => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [tiktok, setTiktok] = useState(false);
    const [myId, setMyId] = useState();
    const [myFriends, setMyFriends] = useState([]);
    const [mySentFriendRequests, setMySentFriendRequests] = useState([]);

    const navig = useNavigation();

    const refka = useRef();

    useEffect(() => {
        refka.current.focus();

        NativeModules.InternalDBModule.getId(res => {
            setMyId(res);
        })

        navig.setOptions({
            headerShown: true,
            headerTitle: (props) => { 
                return(
                <Image 
                    source={require('../../assets/logo/logoTransparentWhite.png')} 
                    style={{width: 108, height: 40}}
                />)}, 
            headerStyle: {backgroundColor: '#d599e4'},
            headerTitleAlign: 'center'
                
        })
    }, [])

    useEffect(() => {
        if (myId) {
            firestore().collection('users').doc(myId.toString()).get().then(res => {
                let friendsToAdd = [];
                res.data().friends.forEach(item => {
                    friendsToAdd.push(item)
                });
                setMyFriends([...friendsToAdd]);
                let friendRequestsToAdd = [];
                res.data().sentFriendRequests.forEach(item => {
                    friendRequestsToAdd.push(item)
                })
                setMySentFriendRequests([...friendRequestsToAdd]);
            })
        }
    }, [myId])

    const searchForUsers = () => {
        if (search == '') {

            setErrorMessage('Please type something.')

        } else {

            firestore().collection('users').where('username', '>=', search).where('username', '<=', search+ '\uf8ff').get().then(res => {
                let resultsToPut = [];

                res.forEach(item => {
                    let isMyFriend = false;
                    let isSentRequest = false;
                    if (myFriends.indexOf(item.id, 0) != -1) {
                        isMyFriend = true;
                    }
                    if (!isMyFriend && mySentFriendRequests.indexOf(item.id, 0) != -1) {
                        isSentRequest = true;
                    }
                    let userId = item.id;
                    if (myId != userId) {
                    resultsToPut.push({username: item.get('username'), userId: userId, avatarMethod: item.get('avatarMethod'), avatarSource: item.get('avatar'),
                isMyFriend: isMyFriend, isSentRequest: isSentRequest})
                    }
                })

                setSearchResults(resultsToPut)
                
            })
        }
    }

    const sendFriendRequest = (userId) => {
        firestore().collection('users').doc(userId.toString()).update({
            numOfFriendRequests: firebase.firestore.FieldValue.increment(1),
            friendRequests: firebase.firestore.FieldValue.arrayUnion(myId.toString())
        })
        firestore().collection('users').doc(myId.toString()).update({
            numOfSentFriendRequests: firebase.firestore.FieldValue.increment(1),
            sentFriendRequests: firebase.firestore.FieldValue.arrayUnion(userId.toString()),
        })
        searchResults.forEach(item => {
            if (item.userId == userId) {
                item.isSentRequest = true;
            }
        })
        setMySentFriendRequests([...mySentFriendRequests, userId]);
        setTiktok(!tiktok)
    }

    const cancelFriendRequest = (userId) => {
        firestore().collection('users').doc(userId.toString()).update({
            numOfFriendRequests: firebase.firestore.FieldValue.increment(-1),
            friendRequests: firebase.firestore.FieldValue.arrayRemove(myId.toString())
        })
        firestore().collection('users').doc(myId.toString()).update({
            numOfSentFriendRequests: firebase.firestore.FieldValue.increment(-1),
            sentFriendRequests: firebase.firestore.FieldValue.arrayRemove(userId.toString())
        })
        searchResults.forEach(item => {
            if (item.userId == userId) {
                item.isSentRequest = false;
            }
        })
        let sentRequests = [...mySentFriendRequests]
        sentRequests.splice(sentRequests.indexOf(userId), 1)
        setMySentFriendRequests([...sentRequests])
    }

    

    const handleChangeText = (value) => {
        setSearch(value)
    }

    const imageSource = (avatarMethod, avatar, userId) => {
        if (avatarMethod == 'blank' || avatarMethod == null) {
            return require('../../assets/icons/username.png')
        } else {
            return {uri: avatar}
        }
    }

    const searchButton = (search != 0) ? (
        <TouchableHighlight underlayColor='#eeeeee'
        onPress={() => searchForUsers()}
        style={searchStyles.searchButton}>
            
            <Text style={searchStyles.searchButtonText}>Search</Text>
        
        </TouchableHighlight>
    ) : (<View></View>)

    return(
        <View style={{flex: 1,}}> 
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{flex:1,}}>

                
                <View>
                
                    <View style={searchStyles.searchBox}>
                
                        <Icon name='search' size={26} style={{position: 'absolute', top: 18, left: 20}}/>
                
                        <TextInput ref={refka}                
                        style={searchStyles.searchInput}
                            onChangeText={value => handleChangeText(value)}               
                        />
                
                        {searchButton}
                
                    </View>

                    <FlatList
                    data={searchResults}
                    renderItem={({item}) => {
                        return(
                            <View style={searchStyles.resultItemContainer}>
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', {profileId: item.userId})}>

                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                                        <Image source={imageSource(item.avatarMethod, item.avatarSource, item.userId)} style={(item.avatarMethod == 'storage') ? ({width: 40, height: 40, borderRadius: 100,}) : ({width: 40, height: 40, tintColor: 'purple', borderRadius: 100,})}/>

                                        <Text style={searchStyles.eachItemText}>{item.username}</Text>

                                    </View>
                                </TouchableWithoutFeedback>

                                {(item.isMyFriend) ? (

                                        <Icon name="user-check" color="#d599e4" size={27} style={{position: 'absolute', right: 10, top: 15,}}/>

                                ) : (
                                    (item.isSentRequest) ? (

                                        <TouchableOpacity onPress={() => cancelFriendRequest(item.userId)}  style={{position: 'absolute', right: 10, top: 15,}}>

                                            <Icon name="user-times" color="#d599e4" size={27}/>

                                        </TouchableOpacity>

                                    ) : (

                                        <TouchableOpacity onPress={() => sendFriendRequest(item.userId)}  style={{position: 'absolute', right: 10, top: 15,}}>

                                        <Icon name="user-plus" color="purple" size={27}/>

                                        </TouchableOpacity>

                                    )
                                )}
                            </View>
                        )
                    }}
                        extraData={tiktok}
                    />

                </View>
                
            </TouchableWithoutFeedback>
        </View>

    )
}

export default Search;