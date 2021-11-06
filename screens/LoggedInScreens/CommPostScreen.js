import React, { useEffect, useState, createRef, useRef } from 'react';
import {View, Text, ScrollView, ActivityIndicator, TouchableHighlight, TouchableWithoutFeedback, Image, Button, SafeAreaView, TouchableOpacity, FlatList, TextInput} from 'react-native';
import commPostStyles from '../../styles/commPostStyles';
import firestore from '@react-native-firebase/firestore'
import { set } from 'react-native-reanimated';
import feedStyles from '../../styles/feedStyles'
import { firebase } from '@react-native-firebase/database';

const PostScreen = ({route, navigation}) => {

    const [postId, setPostId] = useState();
    const [loading, setLoading] = useState(true);
    const [commPost, setCommPost] = useState();
    const [newsId, setNewsId] = useState();
    const [newsText, setNewsText] = useState('');
    const [creatorUserId, setCreatorUserId] = useState();
    const [creatorUsername, setCreatorUsername] = useState();
    const [creatorAvatar, setCreatorAvatar] = useState();
    const [creatorAvatarMethod, setCreatorAvatarMethod] = useState();
    const [commPostTitle, setCommPostTitle] = useState('');
    const [commPostText, setCommPostText] = useState('');
    const [dateUploaded, setDateUploaded] = useState();
    const [numOfLikes, setNumOfLikes] = useState(0);
    const [numOfComments, setNumOfComments] = useState(0);
    const [comments, setComments] = useState([]);
    const [timeUntilNow, setTimeUntilNow] = useState();
    const [isLikeBtnClicked, setLikeBtnClicked] = useState(false);
    const [iLiked, setiLiked] = useState(false)
    const [commentsFiltered, setCommentsFiltered] = useState([])
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [myId, setMyID] = useState();
    const [showSendBtn, SetShowSendBtn] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [sendBtnVisible, setSendBtnVisible] = useState(false);

    const noviRef = useRef()

    useEffect(() => {
        if (route.params.commPostId) {

            let prePostId = route.params.commPostId;
            setPostId(route.params.commPostId);
            setMyID(route.params.myId);
            let preMyId = route.params.myId;

            firestore().collection('commPosts').doc(prePostId.toString()).get().then(res => {
                setCommPost(res.data())
                setCommPostTitle(res.get('title'));
                setCommPostText(res.get('text'))
                setDateUploaded(res.get('timeUploaded'));
                setNewsId(res.get('newsId'));

                let likesArray = [...res.get('likes')];
                likesArray.forEach(item => {
                    if (item == preMyId) {
                        setiLiked(true)
                    } else {
                        setiLiked(false);
                    }
                })

                let timeNow = new Date();
                let timeFromDB = new Date(res.get('timeUploaded'));
                let msDelay = Math.abs(timeFromDB.getTime() - timeNow.getTime());
                let timeTillNow;
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
                setNumOfLikes(res.get('numOfLikes'));
                setNumOfComments(res.get('numOfComments'));
                setComments([...res.get('comments')])

                let preComments = [...res.get('comments')]
                let commentsToAdd = [];
                let noOfComment = 0;

                preComments.forEach((item) => {
                    let username;

                    firestore().collection('users').doc(item.userId.toString()).get().then(res => {

                        username = res.get('username').toString()
                        let timeTillNow = calculateTimeTillNow(item.timeAdded);
                        let avatarMethod = res.get('avatarMethod').toString()
                        let avatar = res.get('avatar').toString()

                        firestore().collection('users').doc(preMyId.toString()).get().then(res3 => {
                            let iLiked = false;

                            preComments[noOfComment].likes.forEach(item2 => {
                                if (item2 == preMyId) {
                                    iLiked = true;
                                    
                                }
                            })
                            commentsToAdd.push(
                                {...item, 
                                    username: username, 
                                    timeTillNow: timeTillNow, 
                                    avatarMethod: avatarMethod, 
                                    avatar: avatar, 
                                    noOfComment: noOfComment, 
                                    iLiked: iLiked
                                });
                            noOfComment++;

                            if (commentsToAdd.length == preComments.length) {
                                setCommentsFiltered([...commentsToAdd]);
                            }

                        }).catch(err => {
                            console.log(err)
                        });
                        
                    }).catch(err => {
                        console.log(err)
                    });     
                })

                setCreatorUserId(res.get('userId'));

                firestore().collection('users').doc(res.get('userId').toString()).get().then(res2 => {

                    setCreatorUsername(res2.get('username'));
                    setCreatorAvatarMethod(res2.get('avatarMethod'))
                    setCreatorAvatar(res2.get('avatar'))

                    firestore().collection('news').doc(res.get('newsId').toString()).get().then(res3 => {
                        setNewsText(res3.get('text'));
                    }).catch(err => {
                        console.log(err)
                    });

                }).catch(err => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err)
            });
        }
    }, [])

    const getNewComments = () => {

        if (route.params.commPostId) {

            let prePostId = route.params.commPostId;
            setPostId(route.params.commPostId);
            setMyID(route.params.myId);
            let preMyId = route.params.myId;

            firestore().collection('commPosts').doc(prePostId.toString()).get().then(res => {

                setCommPost(res.data())
                setCommPostTitle(res.get('title'));
                setCommPostText(res.get('text'))
                setDateUploaded(res.get('timeUploaded'));
                setNewsId(res.get('newsId'));

                let timeNow = new Date();
                let timeFromDB = new Date(res.get('timeUploaded'));
                let msDelay = Math.abs(timeFromDB.getTime() - timeNow.getTime());
                let timeTillNow;
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
                setNumOfLikes(res.get('numOfLikes'));
                setNumOfComments(res.get('numOfComments'));
                setComments([...res.get('comments')])

                let preComments = [...res.get('comments')]
                let commentsToAdd = [];
                let noOfComment = 0;
                preComments.forEach((item) => {
                    let username;
                    firestore().collection('users').doc(item.userId.toString()).get().then(res => {
                        username = res.get('username').toString()
                        let timeTillNow = calculateTimeTillNow(item.timeAdded);
                        let avatarMethod = res.get('avatarMethod').toString()
                        let avatar = res.get('avatar').toString()

                        firestore().collection('users').doc(preMyId.toString()).get().then(res3 => {
                            let iLiked = false;

                            preComments[noOfComment].likes.forEach(item2 => {
                                if (item2 == preMyId) {
                                    iLiked = true;
                                    
                                }
                            })

                            commentsToAdd.push({
                                ...item, 
                                username: username, 
                                timeTillNow: timeTillNow, 
                                avatarMethod: avatarMethod, 
                                avatar: avatar, 
                                noOfComment: noOfComment, 
                                iLiked: iLiked
                            });

                            noOfComment++;
                            if (commentsToAdd.length == preComments.length) {
                                setCommentsFiltered([...commentsToAdd]);
                            }

                        }).catch(err => {
                            console.log(err)
                        });
                        
                    }).catch(err => {
                        console.log(err)
                    });     
                })

                setCreatorUserId(res.get('userId'));

                firestore().collection('users').doc(res.get('userId').toString()).get().then(res2 => {
                    setCreatorUsername(res2.get('username'));
                    setCreatorAvatarMethod(res2.get('avatarMethod'))
                    setCreatorAvatar(res2.get('avatar'))

                    firestore().collection('news').doc(res.get('newsId').toString()).get().then(res3 => {
                        setNewsText(res3.get('text'));
                    }).catch(err => {
                        
                        console.log(err)
                    });

                }).catch(err => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err)
            });
        }
    }

    useEffect(() => {
        getNewComments()
    }, [numOfComments])


    useEffect(() => {
        if (commentsFiltered.length > 0 && numOfComments != 0) {
            setLoading(false)
            
        } else if (numOfComments == 0) {
            setLoading(false);
        }
    },[commentsFiltered])

    const calculateTimeTillNow = (timeAdded) => {
        let timeNow = new Date();
        let timeAddedFormat = new Date(timeAdded);
        let msDelay = Math.abs(timeAddedFormat.getTime() - timeNow.getTime());
        let timeTillNow;
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
        return timeTillNow;
    }

    

    const getImageOfUserFromNews = (avatarMethod, avatarOfUser) => {
        if (avatarMethod == 'blank') {
            return require('../../assets/icons/username.png')
        } else {
            return {uri: avatarOfUser}
        }
    }

    const likeBtnClicked = () => {
        setLikeBtnClicked(true);
    }

    const likeBtnUnclicked = () => {
        setLikeBtnClicked(false);
    }

    const likeComment = (noOfComment) => {
        firestore().collection('commPosts').doc(postId.toString()).get().then(res => {

            let arej = [...res.get('comments')]
            let likeOrDislike = true;
            let preComments = commentsFiltered;

            arej[noOfComment].likes.forEach(item => {
                if (item == myId) {
                    likeOrDislike = false;
                }
            })

            if (likeOrDislike == true) {
                arej[noOfComment].numOfLikes++;
                arej[noOfComment].likes.push(myId);
                preComments[noOfComment].numOfLikes++;
                preComments[noOfComment].iLiked = true;
                preComments[noOfComment].likes.push(myId);
            } else {
                arej[noOfComment].likes.splice(arej[noOfComment].likes.indexOf(myId), 1);
                arej[noOfComment].numOfLikes--;
                preComments[noOfComment].iLiked = false;
                preComments[noOfComment].numOfLikes--;
                preComments[noOfComment].likes.splice(preComments[noOfComment].likes.indexOf(myId), 1);
            }

            setCommentsFiltered([...preComments]);

            firestore().collection('commPosts').doc(postId.toString()).update({
                comments: arej
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        });
    }

    useEffect(() => {
        if (newCommentText.length != 0) {
            setSendBtnVisible(true);
        }
    }, [newCommentText])

    const newCommentHandleChange = (value) => {
        setNewCommentText(value);
    }

    const sendNewComment = () => {
        let newComment = {
            userId: myId,
            text: newCommentText,
            timeAdded: new Date().toISOString(),
            numOfLikes: 0,
            likes: []
        }

        firestore().collection('commPosts').doc(postId.toString()).update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment),
            numOfComments: firebase.firestore.FieldValue.increment(1)
        }).then(() => {
            setNumOfComments(numOfComments+1)
            setNewCommentText('')
        })

    }

    const likeCommPost = () => {
        firestore().collection('commPosts').doc(postId.toString()).get().then(res => {
            let likesArray = [...res.get('likes')];
            let likeOrDislike = true;

            likesArray.forEach(item => {
                if (item == myId) {
                    likeOrDislike = false;
                }
            })

            if (likeOrDislike == true) {
                firestore().collection('commPosts').doc(postId.toString()).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(myId.toString()),
                    numOfLikes: firebase.firestore.FieldValue.increment(1)
                }).then(() => {
                    setiLiked(true);
                    setNumOfLikes(numOfLikes+1)
                })
            } else {
                firestore().collection('commPosts').doc(postId.toString()).update({
                    likes: firebase.firestore.FieldValue.arrayRemove(myId.toString()),
                    numOfLikes: firebase.firestore.FieldValue.increment(-1)
                }).then(() => {
                    setiLiked(false);
                    setNumOfLikes(numOfLikes-1)
                })
            }
        })
    }

    if (loading == true) {
        return (
            <ActivityIndicator />
        )
    }

    return(
        <SafeAreaView style={commPostStyles.commPostContainer}>

            <ScrollView>

                <TouchableWithoutFeedback 
                    onPress={() => navigation.navigate('Profile', {profileId: creatorUserId})}
                    style={feedStyles.commPostUserContainer}>

                    <View style={feedStyles.commPostUserContainer}>

                        <Image source={getImageOfUserFromNews(creatorAvatarMethod, creatorAvatar)} style={{width: 30, height: 30, borderRadius: 100, marginLeft: 10}}/>
                        
                        <Text style={feedStyles.commPostUser}>{creatorUsername}</Text>

                    </View>

                </TouchableWithoutFeedback>

                <Text style={feedStyles.commPostTitle}>{commPostTitle}</Text>

                <View style={commPostStyles.commPostTextContainer}>

                    <Text style={commPostStyles.commPostText}>{commPostText}</Text>

                </View>

                <View style={feedStyles.commNewsContainer}>

                    <Text style={feedStyles.commPostNewsPost}>According to news:</Text>

                    <View style={feedStyles.commNewsInnerContainer}>

                        <Text numberOfLines={2}>{newsText}</Text>

                    </View>

                </View>

                <View style={feedStyles.timeAndTools}>

                    <View style={feedStyles.commPostTimeUploadedContainer}>

                        <Text style={feedStyles.commPostTimeUploaded}>{timeUntilNow}</Text>

                    </View>

                    <TouchableOpacity onPress={() => {}}>

                        <Image source={require('../../assets/icons/threedots.png')}
                        style={{width: 18, height: 18, marginLeft: 5, marginTop: 2}}/>

                    </TouchableOpacity>

                </View>

                <View style={commPostStyles.socialContainer}>

                    <TouchableHighlight underlayColor='#d599e4'
                    onPress={() => likeCommPost()}
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
                    onShowUnderlay={() => likeBtnClicked()}
                    onHideUnderlay={() => likeBtnUnclicked()}
                    style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                        <View style={feedStyles.likesContainer}>

                            <Text style={feedStyles.commPostNumOfComments}>{numOfComments}</Text>

                            <Image source={require('../../assets/icons/commentIcon.png')} style={{width: 21, height: 21, marginLeft: 5}}/>

                        </View>

                    </TouchableHighlight>

                </View>
        
                <FlatList
                data={commentsFiltered}
                renderItem={({item}) => (

                    <View style={commPostStyles.eachCommentContainer}>

                        <View style={commPostStyles.eachCommentHeader}>

                            <TouchableWithoutFeedback 
                            style={commPostStyles.eachCommentHeaderLeft} 
                            onPress={() => navigation.navigate('Profile', {profileId: item.userId})}>

                                <View style={commPostStyles.eachCommentHeaderLeft}>
                                
                                    <Image source={getImageOfUserFromNews(item.avatarMethod, item.avatar)} style={{width: 25, height: 25, borderRadius: 100, marginLeft: 8, marginTop: 5}}/> 
                                    
                                    <Text style={commPostStyles.eachCommentUsername}>{item.username}</Text>
                                
                                </View>

                            </TouchableWithoutFeedback>
                            
                            <View style={commPostStyles.eachCommentHeaderRight}>
                            
                                <Text style={commPostStyles.eachCommentTime}>{item.timeTillNow}</Text>
                            
                                <Image source={require('../../assets/icons/threedots.png')} style={{width: 15, height: 15, marginLeft: 5, marginTop: 2, marginRight: 4}}/>
                            
                            </View>
                        
                        </View>
                        
                        <View style={commPostStyles.commentLikesContainer}>
                        
                            <Text style={commPostStyles.eachCommentText}>{item.text}</Text>
                            
                        </View>
                        
                        <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, right: 3}}>
                        
                            <Text>{item.numOfLikes}</Text>
                        
                            <TouchableWithoutFeedback onPress={() => likeComment(item.noOfComment)}>
                            
                                <Image source={item.iLiked ? require('../../assets/icons/heart.png') : require('../../assets/icons/heart_unfullfilled.png')} style={item.iLiked ? {tintColor: '#d599e4', width: 19, height: 18, marginRight: 6, marginLeft: 3,} : {width: 18, height: 18, marginRight: 6, marginLeft: 3,}}/>
                            
                            </TouchableWithoutFeedback>
                            
                        </View>
                        
                        <View style={commPostStyles.commentSeparator}/>
                    
                    </View>

                )}
                extraData={[numOfComments, imagesLoaded]}/>

                <View style={commPostStyles.newCommentContainer}>

                    <TextInput value={newCommentText} 
                    multiline={true} 
                    placeholder='Write your comment...' 
                    style={commPostStyles.newCommentInput} 
                    onChangeText={(value) => newCommentHandleChange(value)}/>
                    
                    {sendBtnVisible ? (
                        <TouchableOpacity onPress={() => sendNewComment()} style={commPostStyles.newCommentSend}>
                        
                            <Text style={{fontFamily: 'Poppins-Bold', color: '#d599e4'}}>Send</Text>
                        
                        </TouchableOpacity>
                        ) : null}

                </View>
        
            </ScrollView>
    
    </SafeAreaView>

    )
}

export default PostScreen;