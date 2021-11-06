import React, {useEffect, useState} from 'react';
import {View, Text, Button, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, TextInput, ImageBackground, Image, StyleSheet, NativeModules, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import { ReactNativeFirebase } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationRouteContext } from '@react-navigation/core';
import globalStyles from '../../styles/globalStyles';
import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import Feed from './Feed.js'
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Saved from './Saved'
import { SafeAreaView } from 'react-native-safe-area-context';
import Signout from '../Signout'
import messagesNavigation from './messagesNavigation'
import Friends from './Friends';
import {useNavigation} from '@react-navigation/native'
GoogleSignin.configure({
  webClientId: '', //YOUR CLIENT ID
});

const drawer = createDrawerNavigator();



const Home = ({route, navigation}) => {

    const [isAvatarBlank, setAvatarStatus] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('blank');
    const [stackNavigation, setStackNavigation] = useState()
    const [myId, setMyId] = useState();
    const [notificationsNumber, setNotificationsNumber] = useState(2);
    const [username, setUsername] = useState('')

    const drawerCustomContent = (props, drawer) => {
        return( 
            <DrawerContentScrollView {...props} style={{backgroundColor: '#d599e4'}} contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
                
                <View>
                    
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    
                    {profilePictureDrawer}
                    
                    </View>
                
                    <Text style={{textAlign: 'center', fontFamily: "Poppins-Bold", paddingTop: 10,}}>{username}</Text>
                
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', {profileId: myId})} 
                    style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10, borderWidth: 2, borderColor: '#e9b0f7', backgroundColor: '#e9b0f7', elevation: 5, height: 30, borderRadius: 50, marginHorizontal: 90,}}>
                    
                        <Text style={{fontFamily: 'Poppins-Regular', paddingTop: 3,}}>View profile</Text>
                    
                    </TouchableOpacity>

                    <DrawerItem 
                        label="Feed"
                        icon={() => (<Ionicon name='home-sharp' size={26} color='#c37fd4' style={{marginRight: 0,position: 'absolute',left: 5,}}/>)}
                        labelStyle={{fontFamily: 'Poppins-Bold', color: '#c37fd4', paddingTop: 2, marginLeft: 8,}}
                        onPress={() => props.navigation.navigate("Feed")}
                        activeBackgroundColor='#efefef'
                        focused={props.state.index == 0}
                    />
                    <View>

                        <DrawerItem
                        label="Friends"
                        icon={() => (<FontAwesome5 name='user-friends' size={24} style={{position: 'absolute', left: 5}}/>)}
                        labelStyle={{fontFamily: 'Poppins-Bold', paddingTop: 2, marginLeft: 8,}}
                        onPress={() => props.navigation.navigate('Friends')}
                        />
                        {(notificationsNumber > 0) ? (<View style={{width: 13, height: 13, borderRadius: 100, backgroundColor: 'purple', position: 'absolute', top: 24, right: 15,}}/>)
                        : (null)}

                    </View>

                    <DrawerItem
                        label="Saved"
                        icon={() => (<Ionicon name='star' size={26} style={{marginRight: 0,position: 'absolute',left: 5,}}/>)}
                        labelStyle={{fontFamily: 'Poppins-Bold', paddingTop: 2, marginLeft: 8,}}
                        onPress={() => props.navigation.navigate('Saved')}
                        />
                </View>

                <View>

                    <DrawerItem
                        label="Log out"
                        icon={() => (<Ionicon name='exit-outline' size={26} style={{marginRight: 0,position: 'absolute',left: 5,}}/>)}
                        labelStyle={{fontFamily: 'Poppins-Bold',marginLeft: 8, paddingTop: 2,}}
                        onPress={() => props.navigation.navigate('Log out')}
                        />
                </View>
            
            </DrawerContentScrollView>
        )
    }

    useEffect(() => {
        let preId;
        setTimeout(() => {
            firestore().collection('users').where('mail', '==', auth().currentUser.email).get().then(querySnapshot => {
            

                if (querySnapshot.size == 0) {
                    navigation.navigate('FirstTime')
                } else {
                    querySnapshot.forEach(item => {
                        setMyId(item.id)
                        preId = item.id
                        setUsername(item.get('username'))
                        if (item.get('avatar') != 'blank') {
                            setAvatarStatus(false);
                            setAvatarUrl(item.get('avatar'));
                        }
                        if (item.get('firstTime') == true) {
                            navigation.navigate('FirstTime');
                        }
                    })
                }
            }).then(() => {
                const subscriber = firestore().collection('users').doc(preId).onSnapshot(
                    (res) => {
                        setNotificationsNumber(res.get('numOfFriendRequests'))
                    },
                    (err) => {
                        console.log(err)
                    }
                )
            })
            .catch(err => console.log(err))
        }, 2000);
        setStackNavigation(navigation)
    }, [])

    useEffect(() => {
        if (myId) {
            NativeModules.InternalDBModule.getId((res) => {
                if (res == 'No answer') {
                    NativeModules.InternalDBModule.AddId(myId);
                }
            })
        }
    },[myId])

    const profilePictureDrawer = (isAvatarBlank) ? (
        <Image
            source={require('../../assets/icons/username_filled.png')}
            style={{width: 70, height: 70, borderRadius: 100, borderColor: 'purple', borderWidth: 1, tintColor: 'purple'}}/>    
    ) : (
        <Image
            source={{uri: avatarUrl}}
            style={{width: 70, height: 70, borderRadius: 100}}/>    
    )

    const profilePicture = (isAvatarBlank) ? (
        <Image
            source={require('../../assets/icons/username_filled.png')}
            style={{width: 35, height: 35, borderRadius: 100, borderColor: 'purple', borderWidth: 1, tintColor: 'purple', marginLeft: 7}}/>    
    ) : (
        <Image
            source={{uri: avatarUrl}}
            style={{width: 35, height: 35, borderRadius: 100, marginLeft: 7}}/>    
    )


    const notificationBarIcon = (notificationsNumber != 0) ? (
        <View style={{width: 13, height: 13, borderRadius: 100, backgroundColor: 'purple', position: 'absolute', top: -2, right: 0,}}>
            
        </View>
    ) : (<View></View>)

    return(
        <NavigationContainer independent={true} >

            <drawer.Navigator screenOptions={{headerTitleAlign: 'center'}}
            drawerContent={drawerCustomContent}>

                <drawer.Screen 
                name='Feed' 
                component={Feed} 
                initialParams={{naviga: navigation, myId: myId}}
                    options={({navigation}) => {
                            return({
                                headerTitle: (props) => { 
                                return(
                                <Image 
                                    source={require('../../assets/logo/logoTransparentWhite.png')} 
                                    style={{width: 108, height: 40}}
                                />)}, headerStyle: {backgroundColor: '#d599e4'},
                                headerLeft: () => (
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                                            {profilePicture}
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('Messages')}>
                                        <View>
                                            <Icon name="message1" color="purple" size={32} style={{marginLeft: 5, marginTop: 0}}/>
                                            {notificationBarIcon}
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                ),
                                headerRight: () => {
                                    return(
                                        <TouchableWithoutFeedback onPress={() => stackNavigation.navigate('Search')}>
                                            <Image
                                            source={require('../../assets/icons/searchIcon.png')}
                                            style={{width: 38, height: 38,marginRight: 6, tintColor: 'purple'}}/>
                                        </TouchableWithoutFeedback>
                                    )
                            }})
                            
                    }}/>

                <drawer.Screen 
                name='Saved' component={Saved} 
                initialParams={{naviga: navigation}}/>

                <drawer.Screen name="Friends" 
                component={Friends} 
                initialParams={{naviga: navigation}}/>

                <drawer.Screen 
                name='Log out' 
                component={Signout} 
                options={{headerShown: false}}/>

            </drawer.Navigator>

        </NavigationContainer>

    )
}

export default Home;