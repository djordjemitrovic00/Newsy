import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, Image, TouchableOpacity, NativeModules, ActivityIndicator, SafeAreaView, FlatList, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import { NavigationContainer, useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/firestore';
import OptionsMenu from 'react-native-option-menu'
import feedStyles from '../../styles/feedStyles';


const Saved = ({route, navigation}) => {

    const nav = useNavigation();

    const isFocused = useIsFocused();

    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listOfPosts, setListOfPOsts] = useState([]);
    const [myId, setMyId] = useState()
    const [stackNavigation, setStackNavigation] = useState();
    const [tiktok, setTiKtok] = useState(false);

    useLayoutEffect(() => {
        nav.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                
                    <Icon name='arrow-back' size={27} style={{marginLeft: 10,}}/>
                
                </TouchableOpacity>
            ),
            headerStyle: {backgroundColor: '#d599e4'},
            headerTitleStyle: {fontFamily: 'Poppins-Bold', color: 'purple', paddingTop: 3,}
        })
    }, [isFocused])

    useEffect(() => {
        NativeModules.InternalDBModule.getId(res => {
            setMyId(res);
        })
        setStackNavigation(route.params.naviga)
    },[])

    useEffect(() => {
        if (myId) {
            firestore().collection('users').doc(myId.toString()).get().then(res => {
                let saved = res.get('savedPosts');
                setSavedPosts(saved);
                setLoading(false);
                makeList(saved)
            })
        }
    },[myId, isFocused])


    const makeList = (postsId) => {
        let postsToAdd = [];
        let size = 0;
        postsId.forEach(item => {
            if (item.postKind == 'news') {

                firestore().collection('newsPosts').doc(item.postId).get().then(res => {
                    let publishedDate = res.get('publishedDate')
                    let year = Number.parseInt(publishedDate.slice(0, 4))
                    let month = Number.parseInt(publishedDate.slice(5, 7))
                    let day = Number.parseInt(publishedDate.slice(8, 10))
                    let hour = Number.parseInt(publishedDate.slice(11, 13))
                    let minutes = Number.parseInt(publishedDate.slice(14, 16))
                    let seconds = Number.parseInt(publishedDate.slice(17, 19))
                    let timeTillNow;
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

                    postsToAdd.push({...res.data(), postKind: item.postKind, postId: res.id, publishedDate: timeTillNow})
                    size++;

                    if (size == postsId.length) {
                        setListOfPOsts(postsToAdd)
                        setTiKtok(!tiktok)
                    }
                })
            } else {
                firestore().collection('commPosts').doc(item.postId).get().then(res => {
                    let newPost = {...res.data(), postId: res.id, commPostId: res.id}

                    firestore().collection('users').doc(res.get('userId')).get().then(res2 => {
                        newPost = {
                            ...newPost, 
                            nameOfUser: res2.get('username'), 
                            avatarMethod: res2.get('avatarMethod'), 
                            avatarOfUser: res2.get('avatar')
                        }
                        firestore().collection('news').doc(res.get('newsId')).get().then(res3 => {
                            
                            size++;
                            let timeTillNow;
                            let timeNow = new Date();
                            let timeFromDB = new Date(res.get('timeUploaded'));
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
                            newPost = {...newPost, newsText: res3.get('text'), timeTillNow: timeTillNow}

                            postsToAdd.push(newPost)
                            if (size == postsId.length) {
                                setListOfPOsts(postsToAdd)
                            }
                        })
                    })
                })
            }
        })

    }

    const navigateToNewsPost = (newsId) => {
        firestore().collection('newsPosts').where('newsId', '==', newsId.toString()).get().then(res => {
            res.forEach(item => {
                stackNavigation.navigate('News Post', {
                    postId: item.id,
                    myId: myId
                })
            })
        })
    }

    const getImageOfUserFromNews = (avatarMethod, avatarOfUser) => {
        if (avatarMethod == 'blank') {
            return require('../../assets/icons/username.png')
        } else {
            return {uri: avatarOfUser}
        }
    }

    useEffect(() => {
        setTiKtok(!tiktok)
    }, [listOfPosts])

    const unSavePost = (postId, postKind) => {
        firestore().collection('users').doc(myId.toString()).update({
            numOfSavedPosts: firebase.firestore.FieldValue.increment(-1),
            savedPosts: firebase.firestore.FieldValue.arrayRemove({postId: postId, postKind: postKind})
        }).then(() => {
            let saved = savedPosts;
            let index = -1;
            for (let i = 0; i < saved.length; i++) {
                if (saved[i].postId == postId) {
                    index = i;
                }
            }
            saved.splice(index, 1);
            setSavedPosts(saved);
            makeList(saved)
        })
    }

    if (loading) {
        return (<ActivityIndicator size="large" color="purple" style={{justifyContent: 'center', alignItems: 'center', flex: 1,}}/>)
    }

    return(
        <SafeAreaView style={{flex: 1, paddingBottom: 10,}}>

            <FlatList
            data={listOfPosts}
            extraData={tiktok}
            renderItem={({item}) => (
                (item.postKind == 'news') ? (

                    <View style={feedStyles.newsPostContainer}>
                        
                        <Text style={feedStyles.newsPostSourceText}>{item.source}</Text>
                        
                        <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('News Post', {
                        postId: item.postId,
                        myId: myId
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
                                options={["Remove from saved", "Cancel"]}
                                actions={[() => unSavePost(item.postId, 'news'), () => newMention(item.postId)]}/>
                        </View>
                    
                    </View>

                ) : (
                    <View style={feedStyles.commPostContainer}>
                        
                        <TouchableWithoutFeedback 
                        onPress={() => stackNavigation.navigate('Profile', {profileId: item.userId})}
                        style={feedStyles.commPostUserContainer}>

                            <View style={feedStyles.commPostUserContainer}>

                                <Image source={getImageOfUserFromNews(item.avatarMethod, item.avatarOfUser)} style={{width: 30, height: 30, borderRadius: 100, marginLeft: 10, tintColor: 'purple'}}/>
                                <Text style={feedStyles.commPostUser}>{item.nameOfUser}</Text>

                            </View>

                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('Community Post', {commPostId: item.commPostId, myId: myId})}>

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
                                options={["Remove from saved", "Cancel"]}
                                actions={[() => unSavePost(item.commPostId, 'comm'),]}/>

                        </View>

                        

                    </View>
                )
            )}/>
            
         
        </SafeAreaView>

    )
}

export default Saved;