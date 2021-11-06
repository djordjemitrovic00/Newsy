import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat'
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore'
import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { NavigationContainer, useNavigation } from '@react-navigation/native';

const eachMessageScreen = ({route, navigation}) => {

    const navig = useNavigation()

    const [messages, setMessages] = useState([]);
    const [messagesToStore, setMessagesToStore] = useState([]);
    const [recieverId, setRecieverId] = useState();
    const [recieverUsername, setRecieverUsername] = useState('');
    const [myId, setMyId] = useState();
    const [seen, setSeen] = useState();
    const [lastMessageIsMine, setLastMessageisMine] = useState(false)
    const [messagesFromRTDB, setMessagesFromRTDB] = useState()

    useEffect(() => {

      NativeModules.InternalDBModule.getId(res => {
        setMyId(res);
      })

      setRecieverId(route.params.profileId)
      firestore().collection('users').doc(route.params.profileId.toString()).get().then(res => {
        setRecieverUsername(res.get('username'))
        
      })
    },[])

    useEffect(() => {
      if(recieverUsername.length != 0) {
        navig.setOptions({
          headerTitle: () => {
            return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', {profileId: recieverId})}>
              <Text style={{fontFamily: 'Poppins-Bold', color: 'purple', fontSize: 18,}}>{recieverUsername}</Text>
            </TouchableWithoutFeedback>)
          },
          headerRight: () => (<TouchableOpacity>
            <Icon name="ellipsis-vertical-sharp" size={27} />
          </TouchableOpacity>)
        })
      }
    }, [recieverUsername])

  useEffect(() => {

    if (myId) {
      const subscriber = database().ref('/messages/' + myId + '/' + recieverId + '/messages').on('value', (res) => {
        setMessagesFromRTDB(res.val())
        checkLastMessage(res.val())
        })
      return () => database().ref('/messages/' + myId + '/' + recieverId + '/messages').off('value', subscriber)
      }
    },[myId])

  const checkLastMessage = (someMessages) => {
    if (typeof someMessages != undefined) {
      let userId = someMessages[0].user._id;
      if (userId == 2) {
        setLastMessageisMine(false)
      } else {
        setLastMessageisMine(true)
      }
    }
  }

  useEffect(() => {
    if (myId) {
      const subscriber2 = database().ref('/messages/' + myId + '/' + recieverId + '/seen').on('value', res => {
        if (res.val() == false) {
          database().ref('/messages/' + myId + '/' + recieverId + '/seen').set(true)
        }
      })
      return () => database().ref('/messages/' + myId + '/' + recieverId + '/seen').off('value', subscriber2)
    }
  }, [myId])

  useEffect(() => {
    if (myId) {
      const subscriber3 = database().ref('/messages/' + recieverId + '/' + myId + '/seen').on('value', res => {
        setSeen(res.val())
      })
      return () => database().ref('/messages/' + recieverId + '/' + myId + '/seen').off('value', subscriber3)
    }   
  }, [myId])

  useEffect(() => {
    if (messagesFromRTDB) {
      setMessages(parseMessagesFromDB(messagesFromRTDB))
    }
  }, [messagesFromRTDB])

  const parseMessagesToSend = (messages) => {

    let messagesToSend = [];

    messages.forEach(item => {
      let message = {
        _id: item._id,
        text: item.text,
        createdAt: item.createdAt.toString(),
        user: {
          _id: item.user._id,
          name: item.user.name,
          avatar: item.user.avatar
        }
      }
      messagesToSend.push(message);
    })
    return messagesToSend;
  }

  const parseMessagesToSendSecond = (messages) => {
    let messagesToSend = [];
    messages.forEach(item => {
      
      let userId = 1;
      if (item.user._id == 1) {
        userId = 2;
      }
      let message = {
        _id: item._id,
        text: item.text,
        createdAt: item.createdAt.toString(),
        user: {
          _id: userId,
          name: item.user.name,
          avatar: item.user.avatar
        }
      }
      messagesToSend.push(message);
    })
    return messagesToSend;
  }

  const parseMessagesFromDB = (messages) => {
    let messagesFromDB = [];
    messages.forEach(item => {
      let message = {
        _id: item._id,
        text: item.text,
        createdAt: new Date(item.createdAt),
        user: {
          _id: item.user._id,
          name: item.user.name,
          avatar: item.user.avatar
        }
      }
      messagesFromDB.push(message);
    })
    return messagesFromDB;
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => {

      const messagesToShow = GiftedChat.append(previousMessages, messages)

      database().ref('/messages/' + myId + '/' + recieverId + '/messages').set(parseMessagesToSend(messagesToShow))
        .then(() => {})
        .catch(err => console.log(err));

      database().ref('/messages/' + recieverId + '/' + myId + '/messages').set(parseMessagesToSendSecond(messagesToShow))
        .then(() => {})
        .catch(err => console.log(err))

      database().ref('/messages/' + recieverId + '/' + myId + '/seen').set(false).then(() => {
        
      }).catch(err=>console.log(err))
    return messagesToShow;
    })
  }, [myId])

  return (
    <GiftedChat
      messages={messages}
      renderFooter={() => {
        if (seen && lastMessageIsMine) {
          return (<Text style={{textAlign: 'right', marginRight: 10, marginBottom: 2, fontFamily: 'Poppins-Regular'}}>Seen</Text>)
        } else {
          return null
        }
      }}
      renderMessage={(props) => (
        <Bubble {...props}

        textStyle={{
          left: {
            color: 'purple',
            fontFamily: 'Poppins-Regular'
          },
          right: {
            fontFamily: 'Poppins-Regular'
          }
        }}
        
        wrapperStyle={{
          left: {
            backgroundColor: '#d599e4',
            marginLeft: 8,
            marginVertical: 1,

          },
          right: {
            backgroundColor: '#d599e4',
            marginRight: 8,
            marginVertical: 1,
          }
        }}/>
      )}
      renderTime={(props) => (
        <Time {...props}
          timeTextStyle={{
            left: {
              color: 'purple',
              fontFamily: 'Poppins-Regular'
            },
            right: {
              fontFamily: 'Poppins-Regular'
            }
          }}/>
      )}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}

export default eachMessageScreen;