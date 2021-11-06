import React, { useEffect, useState } from 'react';
import {View, Text, TouchableHighlight, NativeModules, TouchableOpacity, ActivityIndicator, Button, FlatList, Image, TouchableWithoutFeedback} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const MessagesScreen = ({navigation}) => {
    const [myId, setMyId] = useState();
    const [noMessages, setNoMessages] = useState();
    const [loading, setLoading] = useState(true);
    const [numOfConversations, setNumOfConversations] = useState(0)
    const [conversations, setConversations] = useState([])
    const [conversationsFiltered, setConversationsFiltered] = useState([]);

    const navig = useNavigation();



    useEffect(() => {
        NativeModules.InternalDBModule.getId(res => {
            if (res != 'No answer' && !myId) {
                setMyId(res);
            }
        })
    }, []);

    useEffect(() => {
        if (myId) {
            database().ref('/messages/' + myId.toString()).once('value').then(res => {
                if (res.exists()) {
                    setNoMessages(false);
                    setLoading(false);
                    setNumOfConversations(res.numChildren())
                    let listOfUsers = [];
                    let numOfUsers = 0;
                    res.forEach(item => {
                        firestore().collection('users').doc(item.key).get().then(res2 => {
                            numOfUsers++;
                            listOfUsers.push({...res2.data(), userId: res2.id});
                            if (numOfUsers == res.numChildren()) {
                                setConversations([...listOfUsers]);
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    })
                    
                } else {
                    setNoMessages(true);
                    setLoading(false);
                }
            }).catch(err => console.log(err))
        }
    }, [myId]);

    useEffect(() => {
        if (conversations.length != 0) {
            let numberOfConversations = 0;
            let newConversations = []
            conversations.forEach(item => {
                database().ref('/messages/' + myId + '/' + item.userId + '/messages').once('value').then(res => {
                    numberOfConversations++;
                    let messages = [...res.val()]

                    let timeOfLastMsg = new Date(messages[0].createdAt);
                    let timeNow = new Date();
                    let timeTillNow = '';
                    let msDelay = Math.abs(timeOfLastMsg.getTime() - timeNow.getTime());
                    if (Math.floor((msDelay / (1000*60*60*24*365))) > 0) {
                        timeTillNow = Math.floor(msDelay / (1000*60*60*24*365)).toString() + 'y';
                    } else if (Math.floor((msDelay / (1000*60*60*24*30))) > 0) {
                        timeTillNow = Math.floor(msDelay / (1000*60*60*24*30)).toString() + ' month'
                    } else if (Math.floor((msDelay / (1000*60*60*24))) > 0) {
                        timeTillNow = Math.floor(msDelay / (1000*60*60*24)).toString() + 'd'
                    } else if (Math.floor((msDelay / (1000*60*60))) > 0) {
                        timeTillNow = Math.floor(msDelay / (1000*60*60)).toString() + 'h'
                    } else if (Math.floor((msDelay / (1000*60))) > 0) {
                        timeTillNow = Math.floor(msDelay / (1000*60)).toString() + 'm'
                    } else {
                        timeTillNow = Math.floor(msDelay / 1000).toString() + 's'
                    }

                    newConversations.push({
                        timeTillNow: timeTillNow, 
                        username: item.username, 
                        userId: item.userId, 
                        avatar: item.avatar,
                        avatarMethod: item.avatarMethod, 
                        lastMessage: messages[0].text
                    })
                    if (numberOfConversations == conversations.length) {
                        for (let i = 0; i < numberOfConversations; i++) {
                            let max = {...newConversations[i]};
                            let maxj = i;
                            for (let j = i; j < numberOfConversations; j++) {
                                if (max.timeTillNow > newConversations[j].timeTillNow) {
                                    max = {...newConversations[j]}
                                    maxj = j;
                                }
                            }
                            let temp = newConversations[i];
                            newConversations[i] = newConversations[maxj];
                            newConversations[maxj] = temp;

                        }
                        setConversationsFiltered([...newConversations])
                    }
                })
            })
        }
    }, [conversations])

    const imageSource = (avatarMethod, avatar) => {
        if (avatarMethod == 'blank' || avatarMethod == null) {
            return require('../../assets/icons/username.png')
        } else {
            return {uri: avatar}
        }
    }

    const messagesList = (noMessages == true) ? (
        <View>

            <Text style={{fontFamily: 'Poppins-Regular', justifyContent: 'center', alignItems: 'center'}}>You have no conversations</Text>
        
        </View>
    ) : (
        <FlatList
            data={conversationsFiltered}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => navigation.navigate('Each Message', {profileId: item.userId})}>
                
                    <View style={{backgroundColor: 'white', elevation: 2, flexDirection: 'row', height: 60, marginHorizontal: 5, marginVertical: 5, paddingHorizontal: 15,}}>
                        
                        <View style={{alignItems: 'center', flexDirection: 'row'}}>
                            
                            <Image source={imageSource(item.avatarMethod, item.avatar)} style={{tintColor: 'purple',width: 40, height: 40, borderRadius: 100,}}/>
                        
                        </View>

                        <View style={{justifyContent: 'space-around'}}>
                            
                            <View style={{paddingTop: 5,}}>
                                
                                <Text style={{fontFamily: 'Poppins-Bold', marginLeft: 13, color: 'black',fontSize: 16, paddingTop: 3,}}>{item.username}</Text>
                        
                            </View>
                        
                            <View style={{marginLeft: 0,}}>
                        
                                <Text style={{fontFamily: 'Poppins-Regular', marginLeft: 13, marginBottom: 5,}}>{item.lastMessage}</Text>
                        
                            </View>
                    
                        </View>

                    
                        <View style={{position: 'absolute', top: 7, right: 10,}}>
                        
                            <Text>{item.timeTillNow}</Text>
                    
                        </View>
                    
                    </View>
                
                </TouchableOpacity>
            )}
                extraData={numOfConversations}
            />
    )

    if (loading) {
        return(
            <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center'}} color='purple'/>
        )
    }

    return(
        <View>
            {messagesList}
        </View>

    )
}

export default MessagesScreen;