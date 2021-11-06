import React, { useEffect, useState } from 'react';
import {useNavigation} from '@react-navigation/native'
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native'
import newMentionStyles from '../../styles/newMentionStyles';
import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/database';

const NewMention = ({route, navigation}) => {
    const [postId, setPostId] = useState();
    const [myId, setMyId] = useState();
    const [newsId, setNewsId] = useState();
    const [titleText, setTitleText] = useState('');
    const [contentText, setContentText] = useState('');
    const [titleHeight, setTitleHeight] = useState();
    const [prevTitleHeight, setPrevTitleHeight] = useState();
    const [newsText, setNewsText] = useState();

    useEffect(() => {
        setPostId(route.params.postId);
        setMyId(route.params.myId);
        firestore().collection('newsPosts').doc(route.params.postId.toString()).get().then(res => {
            setNewsText(res.get('text'));
            setNewsId(res.get('newsId'))
        })
    }, [])

    const nav = useNavigation();

    useEffect(() => {
      nav.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => sendNewMention()}>
                <Text style={{fontFamily: 'Poppins-Bold', fontSize: 15, color: 'purple', paddingTop: 4, marginRight: 0,}}>SEND</Text>
            </TouchableOpacity>
        ),
        });
    })

    const handleTitleChangeText = (value) => {
        setTitleText(value)
    }

    const handleContentChangeText = (value) => {
        setContentText(value)
    }

    const sendNewMention = () => {
        let newCommPost = {
            title: titleText,
            text: contentText,
            numOfLikes: 0,
            numOfComments: 0,
            likes: [],
            comments: [],
            newsId: newsId.toString(),
            newsPostId: postId.toString(),
            timeUploaded: new Date().toISOString(),
            userId: myId.toString(),

        }

        firestore().collection('commPosts').add(newCommPost).then(() => {

            firestore().collection('newsPosts').doc(postId.toString()).update({
                numOfMentions: firebase.firestore.FieldValue.increment(1)
            }).then(() => {
                firestore().collection('users').doc(myId.toString()).update({
                    numOfPostsMade: firebase.firestore.FieldValue.increment(1)
                }).then(() => {
                    navigation.goBack()
                })
            })

        })
        
    }

    

    return(
        <View style={newMentionStyles.container}>

            <TextInput placeholder="Title" 
            onChangeText={(value) => handleTitleChangeText(value)} 
            style={newMentionStyles.titleInput} 
            multiline={true}/>
            <TextInput placeholder="Content" 
            onChangeText={(value) => handleContentChangeText(value)} 
            multiline={true} 
            style={newMentionStyles.contentInput}/>

            <View style={newMentionStyles.newsPost}>

                <Text numberOfLines={2}>{newsText}</Text>

            </View>
            
        </View>
    )
}

export default NewMention;