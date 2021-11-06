import React, { useEffect, useState } from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native'
import firestore, { firebase } from '@react-native-firebase/firestore'
import feedStyles from '../../styles/feedStyles';

const NewsPostScreen = ({route, navigation}) => {
    const [postId, setPostId] = useState();
    const [myId, setMyId] = useState();
    const [newsId, setNewsId] = useState('');
    const [source, setSource] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [timeUntilNow, setTimeUntilNow] = useState('');
    const [numOfLikes, setNumOfLikes] = useState(0);
    const [likes, setLikes] = useState([]);
    const [numOfMentions, setNumOfMentions] = useState(0);
    const [iLiked, setiLiked] = useState(false);
    const [isLikeBtnClicked, setLikeBtnClicked] = useState(false);

    useEffect(() => {
        setPostId(route.params.postId);
        setMyId(route.params.myId);
    }, [])

    

    useEffect(() => {
        if (postId && myId) {
            getNewsPost()
        }
    },[postId])

    const getNewsPost = () => {

        firestore().collection('newsPosts').doc(postId.toString()).get().then(res => {
            setSource(res.get('source'));
            setNewsId(res.get('newsId'));
            setTitle(res.get('title'));
            setText(res.get('text'));
            setNumOfLikes(res.get('numOfLikes'));
            setNumOfMentions(res.get('numOfMentions'));

            if (res.data().likes) {
                setLikes(res.data().likes);
            }

            let value = res.get('publishedDate');
            let year = Number.parseInt(value.slice(0, 4))
            let month = Number.parseInt(value.slice(5, 7))
            let day = Number.parseInt(value.slice(8, 10))
            let hour = Number.parseInt(value.slice(11, 13))
            let minutes = Number.parseInt(value.slice(14, 16))
            let seconds = Number.parseInt(value.slice(17, 19))
            let timeTillNow = '';
            let timeNow = new Date();
            let timeFromDB = new Date(year, month, day, hour, minutes, seconds);
            let msDelay = Math.abs(timeFromDB.getTime() - timeNow.getTime());
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

            setTimeUntilNow(timeTillNow);
        })
    }

    useEffect(() => {
        let liked = false;
        likes.forEach(item => {
            if (item == myId) {
                liked = true;
            }
        })
        setiLiked(liked)
    },[likes])

    const newMention = (postId) => {
        navigation.navigate('New Mention', {
            postId: postId,
            myId: myId
        })
    }

    const likeBtnClicked = () => {
        setLikeBtnClicked(true);
    }

    const likeBtnUnclicked = () => {
        setLikeBtnClicked(false);
    }

    const likeNewsPost = () => {

        let likesArray = likes;
        let likeOrDislike = true;
        likesArray.forEach(item => {
            if (item == myId) {
                likeOrDislike = false;
            }
        })

        if (likeOrDislike == true) {

            firestore().collection('newsPosts').doc(postId.toString()).update({
                numOfLikes: firebase.firestore.FieldValue.increment(1),
                likes: firebase.firestore.FieldValue.arrayUnion(myId)
            }).then(() => {
                setiLiked(true);
                setNumOfLikes(numOfLikes+1);
                likesArray.push(myId);
                setLikes(likesArray)
            })

        } else {
            firestore().collection('newsPosts').doc(postId.toString()).update({
                numOfLikes: firebase.firestore.FieldValue.increment(-1),
                likes: firebase.firestore.FieldValue.arrayRemove(myId)
            }).then(() => {
                setiLiked(false);
                setNumOfLikes(numOfLikes-1);
                likesArray.splice(likesArray.indexOf(myId), 1)
                setLikes(likesArray);
            })
        }
    }

    return(
        <View style={feedStyles.newsPostContainer}>

            <Text style={feedStyles.newsPostSourceText}>{source}</Text>
                    
            <View>
                
                <Text style={feedStyles.newsPostTitleText}>{title}</Text>
                
                <Text style={feedStyles.newsPostText}>{text}</Text>
            
            </View>
            
            <View style={feedStyles.timeAndTools}>
                <Text>{timeUntilNow}</Text>
                <Image source={require('../../assets/icons/threedots.png')} style={{width: 20, height: 20}}/>
            </View>
            <View style={feedStyles.socialContainer}>
            
                <TouchableHighlight underlayColor='#d599e4'
                onPress={() => likeNewsPost()}
                onShowUnderlay={() => likeBtnClicked()}
                onHideUnderlay={() => likeBtnUnclicked()}
                style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                    <View style={feedStyles.likesContainer}>
                        
                        <Text style={feedStyles.commPostNumOfLikes}>{numOfLikes}</Text>
                        
                        <Image source={iLiked ? require('../../assets/icons/heart.png') : require('../../assets/icons/heart_unfullfilled.png')} style={iLiked ? feedStyles.commLikeBtnLiked : feedStyles.commLikeBtn }/>

                    </View>

                </TouchableHighlight>

                <View style={feedStyles.separatorSecond}/>

                <TouchableHighlight underlayColor='#d599e4'
                onPress={() => newMention(postId)}
                onShowUnderlay={() => likeBtnClicked()}
                onHideUnderlay={() => likeBtnUnclicked()}
                style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                    <View style={feedStyles.likesContainer}>
                        
                        <Text style={feedStyles.commPostNumOfComments}>{numOfMentions}</Text>
                        
                        <Image source={require('../../assets/icons/newMention.png')} style={{width: 21, height: 21, marginLeft: 5}}/>

                    </View>

                </TouchableHighlight>

            </View>
                    
        </View>
    )
}

export default NewsPostScreen;