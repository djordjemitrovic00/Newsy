# Newsy

Newsy is social network for discussing about news. You cannot comment on news, but you can open a discussion mentioning the news, on which users can leave their comments and reactions. Also it includes messaging, so you can discuss privately with someone about some news.

## Installation

You need to clone the project. Then you need to install all required packages using following next command, which requires you to have NodeJS Package Manager installed:
```bash
npm i --save
```
After that, in order to run the project you need to run Metro server with:
```bash
npx react-native start
```
Make sure you have connected device for testing or emulator connected, then open new terminal in which you will run following command to see application running on your device/emulator:
```bash
npx react-native run-android
```

# Usage
This application using React Bridges, uses Native Modules whose code is written in Java. Also it uses free Firebase services and free Newscather API services. 

## React Native libraries
### React Navigation
React Navigation offers a variety of navigation types. This application uses Native Stack and Drawer navigation. At beginning you are redirected to Welcome page. In case you are already Signed in, you are redirected to Home page. 

![image](https://user-images.githubusercontent.com/92331382/141689522-7d0ec159-d236-4b04-a3fd-bbe7c69ae412.png)

Native Stack offers kind of navigation as it name says, by stack. If you go to some page, you are offered to go back, as Home page is on top of stack.

![image](https://user-images.githubusercontent.com/92331382/141689411-221e5735-d050-47f6-a734-d539b6c54c45.png)

Drawer navigation offers navigation on the one side of application. Default is left, as it is in application. You open it clicking on your avatar which is located on Upper left corner.

![image](https://user-images.githubusercontent.com/92331382/141689705-1b45df36-4ae1-495d-8564-c1361e008263.png)

### Firebase
This application uses a lot of Firebase services. Every information that it is important to functionality of application, it is stored by some of Firebase databases.

#### Authentication
Like any other social network, you need your own account. As any other person using it, they need their owns. Firebase offer free service of authentication. With appropriate use of authentication, you can create your own account, on which later you can sign in. With good design it is achieved a very good standard of user experience. You can create your own account with your E-mail and password, but you can also sign up with Google and Facebook. If you dont sign out of your account, you are always automatically signed in whenever you open application. Every account that is made, it is saved on Firebase database, and has their unique ID.

![image](https://user-images.githubusercontent.com/92331382/141690047-d42ca7ae-9975-42df-9315-54082168be7e.png)

#### Firestore database
Database is crucial for application like this. Firestore offers very organised database, which brings ease of use. On Firestore is stored all news, all posts of news, and also all posts made by Community, their unique IDs, their publishing date, also all users who liked, commented or mentioned some posts. Also in Firestore is stored all data of users. You can search for specific user, by typing their username. Search results that are shown must beggin with, or be exact as search query.

![image](https://user-images.githubusercontent.com/92331382/141690846-240c634f-c65b-4be6-bf19-2b73b7930bb7.png)

You can send a friend request to person you may know, and they can respond it with accept or decline. If they accept, you are, then, friends on Newsy.

#### Realtime database
Realtime database is being used for messages, and for indicators in messages(Seen). It offers very easy-to-use database that brings real-time changes to application. It is very important to appropriately use event handlers, and to turn off them when they are not needed. As mentioned before they are very convenient to use for messages. As soon as message is being sent, it automatically arrives on reciever's phone.

#### Storage
Every accounts has its own profile, which anyone can see. On profile screen, you can see someone's username, name, description, number of posts they made, and number of friends they have. Also every profile has their own avatar, which is very important for social network. When an account is made by standard E-mail/password way, they have standard empty profile picture, but when it is made with Google or Facebook, avatar is automatically downloaded from their Google/Facebook profile and it is set as their Newsy avatar. Everyone can change their avatar, and avatar is being uploaded to Firebase Storage. Every avatar uploaded on Storage is named after the user ID.

![image](https://user-images.githubusercontent.com/92331382/141690897-c916cbd2-8560-4861-a05f-6aa8ac4389d3.png)

### Native Modules

Native modules are considered as React Native libraries. Using React Bridge, they are connected to application. Native modules can use Java code for Android, and Swift or Objective-C for iOS. I haven't made Native modules for iOS but there are for Android. I used Native modules mainly for creating SQLite database, which is local database located on device. SQLite database has only one table, and one record in it, it is user ID. when you sign out of your account, table becomes empty, as all records being removed. And after you sign in, or sign up, unique user ID is being added to table. All functions made in Native modules are being done asynchronously, so it requires specific callback function which will acquire return data. I've tried to use REST API requests in Native modules, but I couldn't figure out why is it not working, so any suggestion is welcome. 

### Other libraries

There are used some libraries that helped building functionality and/or design of application. One of them is **react-native-image-picker**. It helps choosing picture to upload for user avatar, and it is very easy to use. Second one is **react-native-options-menu** and it provides easy options menu which is located on every post. By clicking three dots on upper right corner, it shows you available options for the post(Save post, Mention post). **react-native-swipe-gestures** allows you to easily add some swipe gestures on JSX elements. In this application is being used so you can swipe left/right to navigate between news and community posts in Home page. And the last one is **validator** which helps to easily put limitations to given mail and password during signing in or signing up. Every password has to have atleast 8 letters, which must contain atleast one number, one character, one uppercase and one lowercase letter.

# Conclusion
It is planned to work on improving the functionality of an application. One of the features I intend building in, which I consider is the most important, is Firebase Cloud functions, which will automatically push notification when some user is recieving a message or friend request, on which you can respond directly from notification bar without entering application. This application may be uploaded on Google Play store when all upgrades are done, but it will remain open-source.
This is my first project, and I am aware that many things can be done better, and I am willing to put myself into upgrading application. Reason why I haven't made it in Java(Android Studio), is that I am willing to learn Swift, and make this application available for both Android and iOS, and I honestly it will happen in the near future.



