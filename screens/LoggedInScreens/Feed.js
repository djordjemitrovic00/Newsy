import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, ScrollView, SafeAreaView, TouchableHighlight, FlatList, Image, Button, Dimensions, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, Alert, ToastAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import globalStyles from '../../styles/globalStyles';
import feedStyles from '../../styles/feedStyles';
import {useNavigation} from '@react-navigation/native'
import { NativeModules } from 'react-native';
import { Utils, utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/AntDesign';
import OptionsMenu from 'react-native-option-menu'
import { set } from 'react-native-reanimated';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { firebase } from '@react-native-firebase/messaging';
import { Menu, MenuItem, Provider } from 'react-native-paper';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const Feed = ({route, navigation}) => {

    const [newsSelected, setNewsSelected] = useState(true);
    const [communitySelected, setCommunitySelected] = useState(false);
    const [avatarMethod, setAvatarMethod] = useState('blank');
    const [avatar, setAvatar] = useState('')
    const [newsPosts, setNewsPosts] = useState([]);
    const [newsPostsLoaded, setNewsPostsLoaded] = useState(20);
    const [commPosts, setCommPosts] = useState([]);
    const [commPostsLoaded, setCommPostsLoaded] = useState(0);
    const [iLiked, setiLiked] = useState(0);
    const [tikTok, setTikTok] = useState(true);
    const [isLikeBtnClicked, setLikeBtnClicked] = useState(false);
    const [myID, setMyID] = useState();
    const [stackNavigation, setStackNavigation] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [numOfNFR, setNumOfNFR] = useState(0);
    const [numOfNM, setNumOfNM] = useState(0);


    const headerNavigation = useNavigation();

    const profilePicture = (avatarMethod == 'blank') ? (
        <Image source={require('../../assets/icons/username_filled.png')}
        style={{width: 35, height: 35, borderRadius: 100, borderColor: 'purple', borderWidth: 1, tintColor: 'purple', marginLeft: 7}}/>    
    ) : (
        <Image source={{uri: avatar}}
        style={{width: 35, height: 35, borderRadius: 100, marginLeft: 7}}/> 
    )

    const notificationBarIcon = (numOfNM) ? (
        <View style={{width: 13, height: 13, borderRadius: 100, backgroundColor: 'purple', position: 'absolute', top: -2, right: 0,}}>
            
        </View>
    ) : (<View></View>)

    const notificationBarIconFR = (numOfNFR) ? (
        <View style={{width: 13, height: 13, borderRadius: 100, backgroundColor: 'purple', position: 'absolute', top: -2, right: 0,}}>
            
        </View>
    ) : (<View></View>)

    const isFocused = useIsFocused()

    useLayoutEffect(() => {
        headerNavigation.setOptions({
            headerTitle: (props) => { 
                return(
                <Image 
                    source={require('../../assets/logo/logoTransparentWhite.png')} 
                    style={{width: 108, height: 40}}
                />)}, headerStyle: {backgroundColor: '#d599e4'},
            headerLeft: () => (
                <View style={{flexDirection: 'row'}}>
                    <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                        
                        <View>
                        
                            {profilePicture}
                        
                            {notificationBarIconFR}
                        
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('Messages')}>
                        
                        <View>
                        
                            <Icon name="message1" color="purple" size={32} style={{marginLeft: 5, marginTop: 0}}/>
                        
                            {notificationBarIcon}
                        
                        </View>

                    </TouchableWithoutFeedback>
                </View>)
        })   
    }, [avatarMethod, avatar, numOfNM, numOfNFR, isFocused])
 

    const selectNews = () => {
        setNewsSelected(true);
        setCommunitySelected(false);

        // CLOUD FUNCTION
        // fetch('https://api.newscatcherapi.com/v2/search?q=Tesla&countries=RS', {
        //     method: 'GET',
        //     headers: {
        //         'x-api-key': '',
        //     }
        // }).then(dat => dat.json()).then(a => {
        //     let articles = a.articles;
            
        //     articles.forEach(item => {
        //         let news = {
        //             title: item.title,
        //             text: item.summary,
        //             publishedDate: item.published_date,
        //             source: item.rights
        //         }
        //         firestore().collection('news').add(news).then(()=>console.log('success')).catch(err=>console.log(err))
        //     })
        // })
        // firestore().collection('news').limit(100).get().then(res => {
        //     let dataToStore = [];
        //     let idOfNews = [];
        //     res.forEach(item => {
        //         idOfNews.push(item.id)
        //         dataToStore.push(item.data())
        //     })
        //     let idOfNewsPosts = [];
        //     firestore().collection('newsPosts').limit(100).get().then(res => {
        //         res.forEach(item => {
        //             idOfNewsPosts.push(item.data().newsId);
        //         })
        //         for (let i = 0; i < dataToStore.length; i++) {
        //             if (idOfNewsPosts.indexOf(idOfNews[i]) == -1) {
        //                 firestore().collection('newsPosts').add({
        //                     ...dataToStore[i], 
        //                     newsId: idOfNews[i],
        //                     numOfLikes: 0,
        //                     numOfMentions: 0
        //                 }).catch(err=> {
        //                     console.log(err);
        //                 })
        //             }
        //         }
        //     });
            
        
        // }).catch(err=>console.log(err));
    
    }
    useEffect(() => {
        setStackNavigation(route.params.naviga);
        firestore().collection('users').where('mail', '==', auth().currentUser.email.toString()).get().then(res => {
            res.forEach(item => {
                setMyID(item.id)
            })
        })
    }, [])

    useEffect(() => {
        if (myID) {
            getNewNewsPosts();
            getNewCommPosts();
            firestore().collection('users').doc(myID.toString()).get().then(res => {
                setAvatar(res.get('avatar'))
                setAvatarMethod(res.get('avatarMethod'))
            })
        }
    }, [myID])

    useEffect(() => {
        database().ref('/messages/' + myID).once('value').then(res => {
            let numberOfMessagesUnseen = 0;
            res.forEach(item => {
                if (item.child('seen').exists()) {
                    if (item.child('seen').val() == false) {
                        numberOfMessagesUnseen++;
                    }
                }
            })
            setNumOfNM(numberOfMessagesUnseen)
        })
        if (myID) {
            firestore().collection('users').doc(myID).get().then(res => {
                setNumOfNFR(res.get('numOfFriendRequests'))
            })
        }
    }, [isFocused, myID])

    const getNewNewsPosts = () => {
        firestore().collection('newsPosts').orderBy('publishedDate', 'desc').limit(20).get().then(res => {
            let dataToStore = [];
            res.forEach(item => {
                let eachDataToStore = {
                    ...item.data(),
                    publishedDate: calcTime(item.get('publishedDate')),
                    postId: item.id,
                    iLiked: false,
                }
                if (eachDataToStore.likes) {
                    eachDataToStore.likes.forEach(item2 => {
                        if (item2 == myID) {
                            eachDataToStore.iLiked = true;
                            
                        }
                    })
                }
                dataToStore.push(eachDataToStore)
                
            })
            dataToStore.reverse();
            setNewsPosts([...dataToStore])
        })
    }

    const navigateToNewsPost = (newsId) => {
        firestore().collection('newsPosts').where('newsId', '==', newsId.toString()).get().then(res => {
            res.forEach(item => {
                stackNavigation.navigate('News Post', {
                    postId: item.id,
                    myId: myID
                })
            })
        })
    }

    const getNewCommPosts = () => {
        let commPostsToAdd = [];
        firestore().collection('commPosts').orderBy('timeUploaded', 'desc').limit(10).get().then(res => {
            
            res.forEach(item => {
                
                let avatarMethod = '';
                let nameOfUser;
                let avatarOfUser;
                let shouldAdd = true;

                let timeTillNow = '';
                let timeNow = new Date();
                let timeFromDB = new Date(item.get('timeUploaded'));
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

                
                
                commPosts.forEach(oldCommPosts => {
                    if (item.id == oldCommPosts.commPostId) {
                        shouldAdd = false;
                    }
                })
                    firestore().collection('users').doc(item.get('userId')).get().then(res2 => {
                        avatarMethod = res2.data().avatarMethod
                        nameOfUser = res2.data().username;
                        avatarOfUser = res2.data().avatar;
                        firestore().collection('users').where('mail', '==', auth().currentUser.email).get().then(res3 => {
                            let iLikedItem = false;
                            let myId;
                            
                            res3.forEach(res3q => {
                                myId = res3q.id;
                            })
                            item.data().likes.forEach(eachLike => {
                                if (eachLike == myId) {
                                    iLikedItem = true;
                                }
                            })
                            firestore().collection('news').doc(item.get('newsId').toString()).get().then(res4 => {
                                let newsText = res4.get('text');
                              commPostsToAdd.push({...item.data(), nameOfUser: nameOfUser, avatarMethod: avatarMethod, avatarOfUser: avatarOfUser, commPostId: item.id, iLiked: iLikedItem, newsText: newsText, timeTillNow: timeTillNow})
                                if (commPostsToAdd.length == res.size) {
                                    setCommPosts([...commPostsToAdd])
                                    setTikTok(!tikTok)
                                }
                            })
                        })
                    }).catch(err => console.log(err))
                
                
                

            })
        })
    }
    useEffect(() => {
        setCommPostsLoaded(commPostsLoaded+1)
    }, [commPosts]);

    const selectCommunity = () => {
        setNewsSelected(false);
        setCommunitySelected(true);
        
    }

    const getImageOfUserFromNews = (avatarMethod, avatarOfUser) => {
        if (avatarMethod == 'blank') {
            return require('../../assets/icons/username.png')
        } else {
            return {uri: avatarOfUser}
        }
    }

    useEffect(() => {
        setNewsPostsLoaded(newsPostsLoaded+1);
    }, [newsPosts])

    const likeBtnClicked = () => {
        setLikeBtnClicked(true);
    }

    const likeBtnUnclicked = () => {
        setLikeBtnClicked(false);
    }

    const likeCommPost = (postId) => {
        firestore().collection('commPosts').doc(postId.toString()).get().then(res => {
            let likesArray = res.get('likes');
            let possibleLike = true;
            likesArray.forEach(item => {
                if (item == myID) {
                    possibleLike = false;
                }
            })
            if (possibleLike == true) {
                let commPostsArray = commPosts;
                commPostsArray.forEach(item => {
                    if (item.commPostId == postId) {
                        item.iLiked = true
                        item.numOfLikes = item.numOfLikes+1;
                    }
                })
                setCommPosts([...commPostsArray]);
                firestore().collection('commPosts').doc(postId.toString()).update({
                numOfLikes: firebase.firestore.FieldValue.increment(1),
                likes: firebase.firestore.FieldValue.arrayUnion(myID)
                }).then(() => {
                    setiLiked(iLiked+1)
                })
            } else {
                let commPostsArray = commPosts;
                commPostsArray.forEach(item => {
                    if (item.commPostId == postId) {
                        item.iLiked = false
                        item.numOfLikes = item.numOfLikes-1;
                    }
                })
                setCommPosts([...commPostsArray]);
                firestore().collection('commPosts').doc(postId.toString()).update({
                numOfLikes: firebase.firestore.FieldValue.increment(-1),
                likes: firebase.firestore.FieldValue.arrayRemove(myID)
                }).then(() => {
                    setiLiked(iLiked-1)
                })
            }
        })
        
    }

    const calcTime = (value) => {
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
        return timeTillNow;

    }

    const likeNewsPost = (postId) => {
        firestore().collection('newsPosts').doc(postId.toString()).get().then(res => {
            let likesArray = res.get('likes')
            let likeOrDislike = true;
            if (likesArray) {
                likesArray.forEach(item => {
                    if (item == myID) {
                        likeOrDislike = false;
                    }
                })
            }
            if (likeOrDislike == true) {
                firestore().collection('newsPosts').doc(postId.toString()).update({
                    numOfLikes: firebase.firestore.FieldValue.increment(1),
                    likes: firebase.firestore.FieldValue.arrayUnion(myID.toString())
                }).then(() => {
                    let newNewsPosts = newsPosts;
                    for (let i = 0; i < newsPosts.length; i++) {
                        if (newNewsPosts[i].postId == postId) {
                            newNewsPosts[i].iLiked = true;
                            newNewsPosts[i].numOfLikes++;
                        }
                    }
                    setNewsPosts(newNewsPosts);
                    if (tikTok == true) {
                        setTikTok(false)
                    } else {
                        setTikTok(true)
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                firestore().collection('newsPosts').doc(postId.toString()).update({
                    numOfLikes: firebase.firestore.FieldValue.increment(-1),
                    likes: firebase.firestore.FieldValue.arrayRemove(myID.toString())
                }).then(() => {
                    let newNewsPosts = newsPosts;
                    for (let i = 0; i < newsPosts.length; i++) {
                        if (newNewsPosts[i].postId == postId) {
                            newNewsPosts[i].iLiked = false;
                            newNewsPosts[i].numOfLikes--;
                        }
                    }
                    setNewsPosts(newNewsPosts);
                    if (tikTok == true) {
                        setTikTok(false)
                    } else {
                        setTikTok(true)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }

        })
    }

    const onRefresh = () => {
        if (newsSelected) {
            getNewNewsPosts()
            setRefreshing(false)
        } else {
            getNewCommPosts();
            setRefreshing(false); 
        }
    }

    const newMention = (postId) => {
        stackNavigation.navigate('New Mention', {
            postId: postId,
            myId: myID
        })
    }

    const savePost = (postId, postKind) => {
        firestore().collection('users').doc(myID.toString()).update({
            numOfSavedPosts: firebase.firestore.FieldValue.increment(1),
            savedPosts: firebase.firestore.FieldValue.arrayUnion({postId: postId, postKind: postKind})
        }).then(() => {
            ToastAndroid.show('Saved post', ToastAndroid.SHORT);
        })
    }

    return(
        <SafeAreaView style={{flex: 1}}>

            <View style={feedStyles.navBarContainer}>

                <TouchableHighlight style={feedStyles.navBarItemFirst}
                    underlayColor='#d599e4' 
                    onPress={() => selectNews()}>

                    <Text 
                    style={newsSelected ? feedStyles.navBarItemTextSelected : feedStyles.navBarItemText}>
                        NEWS
                    </Text>

                </TouchableHighlight>

                <View style={feedStyles.separator}/>

                <TouchableHighlight style={feedStyles.navBarItemSecond}
                    underlayColor='#d599e4' 
                    onPress={() => selectCommunity()}>

                    <Text 
                    style={communitySelected ? feedStyles.navBarItemTextSelected : feedStyles.navBarItemText}>
                        COMMUNITY
                    </Text>

                </TouchableHighlight>

            </View>

            <View style={feedStyles.postsContainer}>

            {refreshing ? <ActivityIndicator /> : null}

        
                {(newsSelected) ? (
                <FlatList
                data={newsPosts}
                contentContainerStyle={{ paddingBottom: 5 }}
                refreshControl={(<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />)}
                renderItem={({item}) => (

                <View style={feedStyles.newsPostContainer}>

                    <Text style={feedStyles.newsPostSourceText}>{item.source}</Text>

                    <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('News Post', {
                            postId: item.postId,
                            myId: myID
                        })}>
                        
                        <View>
                            
                            <Text style={feedStyles.newsPostTitleText} numberOfLines={2}>{item.title}</Text>
                            
                            <Text style={feedStyles.newsPostText} numberOfLines={6}>{item.text}</Text>
                        
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={feedStyles.timeAndTools}>

                        <Text>{item.publishedDate}</Text>

                        <OptionsMenu
                            button={require('../../assets/icons/threedots.png')}
                            buttonStyle={{ width: 20, height: 20}}
                            options={["Save", "Mention", "Cancel"]}
                            actions={[() => savePost(item.postId, 'news'), () => newMention(item.postId)]}/>

                    </View>

                    <View style={feedStyles.socialContainer}>
                    
                        <TouchableHighlight underlayColor='#d599e4'
                            onPress={() => likeNewsPost(item.postId)}
                            onShowUnderlay={() => likeBtnClicked()}
                            onHideUnderlay={() => likeBtnUnclicked()}
                            style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                                <View style={feedStyles.likesContainer}>

                                    <Text style={feedStyles.commPostNumOfLikes}>{item.numOfLikes}</Text>
                                    
                                    <Image source={item.iLiked ? require('../../assets/icons/heart.png') : require('../../assets/icons/heart_unfullfilled.png')} style={item.iLiked ? feedStyles.commLikeBtnLiked : feedStyles.commLikeBtn }/>

                                </View>

                            </TouchableHighlight>

                            <View style={feedStyles.separatorSecond}/>

                            <TouchableHighlight underlayColor='#d599e4'
                            onPress={() => newMention(item.postId)}
                            onShowUnderlay={() => likeBtnClicked()}
                            onHideUnderlay={() => likeBtnUnclicked()}
                            style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                                <View style={feedStyles.likesContainer}>

                                    <Text style={feedStyles.commPostNumOfComments}>{item.numOfMentions}</Text>
                                    <Image source={require('../../assets/icons/newMention.png')} style={{width: 21, height: 21, marginLeft: 5}}/>

                                </View>

                            </TouchableHighlight>

                        </View>
                    
                </View>
            )}
            extraData={[newsPostsLoaded, tikTok]}
        />
    ) : (
        <FlatList
            data={commPosts}
            contentContainerStyle={{ paddingBottom: 5 }}
            refreshControl={(<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
                />)}
            renderItem={({item}) => (

                <GestureRecognizer
                onSwipeRight={() => {
                    setNewsSelected(true);
                    setCommunitySelected(false);  
                }}>

                    <View style={feedStyles.commPostContainer}>

                        <TouchableWithoutFeedback 
                        onPress={() => stackNavigation.navigate('Profile', {profileId: item.userId})}
                        style={feedStyles.commPostUserContainer}>

                            <View style={feedStyles.commPostUserContainer}>

                                <Image source={getImageOfUserFromNews(item.avatarMethod, item.avatarOfUser)} style={{width: 30, height: 30, borderRadius: 100, marginLeft: 10, tintColor: 'purple'}}/>
                                
                                <Text style={feedStyles.commPostUser}>{item.nameOfUser}</Text>

                            </View>

                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('Community Post', {commPostId: item.commPostId, myId: myID})}>

                            <View>

                                <Text style={feedStyles.commPostTitle}>{item.title}</Text>

                                <View style={feedStyles.commPostTextContainer}>

                                    <Text numberOfLines={4} style={feedStyles.commPostText}>{item.text}</Text>

                                </View>

                            </View>

                        </TouchableWithoutFeedback>

                        <View style={feedStyles.commNewsContainer}>

                            <Text style={feedStyles.commPostNewsPost}>According to news:</Text>

                            <TouchableWithoutFeedback onPress={() => navigateToNewsPost(item.newsId)}>

                                <View style={feedStyles.commNewsInnerContainer}>

                                    <Text numberOfLines={2}>{item.newsText}</Text>

                                </View>

                            </TouchableWithoutFeedback>

                        </View>

                        <View style={feedStyles.timeAndTools}>

                            <View style={feedStyles.commPostTimeUploadedContainer}>

                                <Text style={feedStyles.commPostTimeUploaded}>{item.timeTillNow}</Text>

                            </View>

                            <OptionsMenu
                                button={require('../../assets/icons/threedots.png')}
                                buttonStyle={{width: 18, height: 18, marginLeft: 5, marginTop: 2}}

                                options={["Save", "Cancel"]}
                                actions={[() => savePost(item.commPostId, 'comm'),]}/>

                        </View>

                        <View style={feedStyles.socialContainer}>

                            <TouchableHighlight underlayColor='#d599e4'
                            onPress={() => likeCommPost(item.commPostId)}
                            onShowUnderlay={() => likeBtnClicked()}
                            onHideUnderlay={() => likeBtnUnclicked()}
                            style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                                <View style={feedStyles.likesContainer}>

                                    <Text style={feedStyles.commPostNumOfLikes}>{item.numOfLikes}</Text>
                                    <Image source={item.iLiked ? require('../../assets/icons/heart.png') : require('../../assets/icons/heart_unfullfilled.png')} style={item.iLiked ? feedStyles.commLikeBtnLiked : feedStyles.commLikeBtn }/>

                                </View>

                            </TouchableHighlight>

                            <View style={feedStyles.separatorSecond}/>

                            <TouchableHighlight underlayColor='#d599e4'
                            onPress={() => stackNavigation.navigate('Community Post', {commPostId: item.commPostId, myId: myID})}
                            onShowUnderlay={() => likeBtnClicked()}
                            onHideUnderlay={() => likeBtnUnclicked()}
                            style={isLikeBtnClicked ? feedStyles.likesContainerClicked : feedStyles.likesContainer}>

                                <View style={feedStyles.likesContainer}>

                                    <Text style={feedStyles.commPostNumOfComments}>{item.numOfComments}</Text>
                                    
                                    <Image source={require('../../assets/icons/commentIcon.png')} style={{width: 21, height: 21, marginLeft: 5}}/>

                                </View>

                            </TouchableHighlight>

                        </View>

                    </View>

                </GestureRecognizer>
                
            )}
            extraData={[commPostsLoaded, iLiked, tikTok]}
        />
    )}
    
            </View>


        </SafeAreaView>
        

    )
}

export default Feed;