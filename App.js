import React, {useContext, useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, TouchableWithoutFeedback, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/LoggedOutScreens/Login';
import Register from './screens/LoggedOutScreens/Register';
import FirstTimeScreen from './screens/FirstTimeScreen';
import MessagesScreen from './screens/LoggedInScreens/MessagesScreen';
import Home from './screens/LoggedInScreens/Home';
import CommPostScreen from './screens/LoggedInScreens/CommPostScreen';
import { AuthContext } from './contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ForgotPassword from './screens/LoggedOutScreens/ForgotPassword';
import WelcomeScreen from './screens/LoggedOutScreens/WelcomeScreen';
import Profile from './screens/LoggedInScreens/Profile.js'
import Search from './screens/LoggedInScreens/Search';
import NewsPostScreen from './screens/LoggedInScreens/NewsPostScreen';
import NewMention from './screens/LoggedInScreens/newMention';
import eachMessageScreen from './screens/LoggedInScreens/eachMessageScreen';
import EditProfile from './screens/LoggedInScreens/EditProfile';

const NativeStack = createNativeStackNavigator();

function App() {

  const [mail, setMail] = useState('');
  const [signedIn, setSignedInStatus] = useState();

  function onAuthStateChanged(user) {
    if (auth().currentUser) {
      setSignedInStatus(true);
      setMail(auth().currentUser.email)    
    } else {
      setSignedInStatus(false);
    }
  }

  useEffect(()=> {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[])
  
  const Prikaz = (signedIn) ? (
        <>

          <NativeStack.Screen 
          name="Home" 
          component={Home}/>

          <NativeStack.Screen 
          name="Messages" 
          component={MessagesScreen}
            options={() => {
              return({
                headerTitleAlign: 'center',
                headerTitleStyle: {fontFamily: 'Poppins-Bold'},
                headerStyle: {backgroundColor: '#d599e4', paddingTop: 3}
              })
            }}
          />

          <NativeStack.Screen 
          name="Each Message" 
          component={eachMessageScreen} 
          options={{
            headerTitleAlign: 'center',
            headerStyle: {backgroundColor: '#d599e4'},
            headerTitleStyle: {color: 'purple', fontFamily: 'Poppins-Bold'}
          }}/>

          <NativeStack.Screen 
          name="Community Post" 
          component={CommPostScreen}
            options={() => {
                            return({
                                headerTitle: (props) => { 
                                return(
                                <Image 
                                    source={require('./assets/logo/logoTransparentWhite.png')} 
                                    style={{width: 108, height: 40}}
                                />)}, headerStyle: {backgroundColor: '#d599e4'},
                                headerTitleAlign: 'center'
                            })}}
          />

          <NativeStack.Screen 
          name="News Post" 
          component={NewsPostScreen}
            options={() => {
                            return({
                                headerTitle: (props) => { 
                                return(
                                <Image 
                                    source={require('./assets/logo/logoTransparentWhite.png')} 
                                    style={{width: 108, height: 40}}
                                />)}, headerStyle: {backgroundColor: '#d599e4'},
                                headerTitleAlign: 'center'
                            })}}
          />

          <NativeStack.Screen 
          name="New Mention" 
          component={NewMention}
            options={() => {
                            return({
                                headerTitle: (props) => { 
                                return(
                                <Image 
                                    source={require('./assets/logo/logoTransparentWhite.png')} 
                                    style={{width: 108, height: 40}}
                                />)}, headerStyle: {backgroundColor: '#d599e4'},
                                headerTitleAlign: 'center'
                            })}}
          />  

          <NativeStack.Screen 
          name="FirstTime" 
          component={FirstTimeScreen}/>

          <NativeStack.Screen 
          name="Profile" 
          component={Profile}/>

          <NativeStack.Screen 
          name="Search" 
          component={Search}/>

          <NativeStack.Screen 
          name="Edit Profile" 
          component={EditProfile}/>

        </>

    ) : (

      <>

        <NativeStack.Screen 
        name="Welcome Screen" 
        component={WelcomeScreen}/>

        <NativeStack.Screen 
        name="Login" 
        component={Login}/>

        <NativeStack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword}/>

        <NativeStack.Screen 
        name="Register" 
        component={Register}/>

      </>
  )

  const headerShowna = (route) => {
    if (route.route.name == "Post" || 
      route.route.name == 'Each Message' || 
      route.route.name == 'Messages' || 
      route.route.name == 'Profile' || 
      route.route.name == 'Community Post' || 
      route.route.name == 'News Post' || 
      route.route.name == 'New Mention') {

       return true;

    }

    return false;
  }

  return(

      <NavigationContainer>

        <NativeStack.Navigator 
        screenOptions={(route) => {
          return {
            headerShown: headerShowna(route)   
          }
        }}>

        {Prikaz}

        </NativeStack.Navigator>

      </NavigationContainer>
    )
  }

export default App;
