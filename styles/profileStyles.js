import { Dimensions, StyleSheet } from "react-native";

const themeColor = '#d599e4'

export default StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        height: 150
    },
    headerBackground: {
        backgroundColor: themeColor,
        height: 160,
        width: '100%',
        position: "absolute",
        top: 0,
    },
    headerAvatarImage: {
        width: 120,
        height: 120,
        borderRadius: 100,
        position: 'absolute',
        bottom: 0,
        zIndex: 151,
        left: Dimensions.get('window').width/2 - 60,
         overflow: 'hidden'
    },
    headerAvatar: {
        width: 120,
        height: 120,
        borderRadius: 100,
        position: 'absolute',
        bottom: 0,
        zIndex: 151,
        tintColor: 'purple',
        left: Dimensions.get('window').width/2 - 60,
         overflow: 'hidden'
    },
    editAvatar: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -65,
        right: -25,
        width: 150,
        height: 100,
        justifyContent:'center',
        backgroundColor: 'gray',
        opacity: 0.95
    },
    headerLogo: {
        position: 'absolute',
        top: 5,
        zIndex: 50,
        left: Dimensions.get('window').width/2 - 69
    },
    headerLogoImg: {
        width: 138,
        height:50,
        
    },
    fullNameText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        textAlign: 'center',
    },
    fullNameTextEdit: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'white',
        elevation: 2,
    },
    buttonsLine: {
        flexDirection: 'row',
        marginHorizontal: 40,
        marginTop: 10,
        justifyContent: 'space-evenly'
    },
    addFriendBtn: {
        borderWidth: 3,
        paddingHorizontal: 0,
        paddingVertical: 4,
        borderRadius: 22,
        width: 160,
        marginRight: 20,
        borderColor: themeColor,
        backgroundColor: '#efefe',
        
    },
    addFriendBtnClicked: {
        borderWidth: 3,
        paddingHorizontal: 0,
        paddingVertical: 4,
        borderRadius: 22,
        width: 160,
        marginRight: 20,
        borderColor: themeColor,
     //   backgroundColor: themeColor,
        
    },
    addFriendBtnText: {
        fontFamily: 'Poppins-Bold',
        paddingTop: 5,
        textAlign: 'center',
        color: 'purple'
    },
    sendMsgBtn: {
        borderWidth: 3,
        paddingHorizontal: 0,
        paddingVertical: 4,
        borderRadius: 22,
        marginLeft: 0,
        width: 160,
        borderColor: themeColor,
        backgroundColor: '#efefe',
        
    },
    sendMsgBtnClicked: {
        borderWidth: 3,
        paddingHorizontal: 0,
        paddingVertical: 4,
        borderRadius: 22,
        marginLeft: 10,
        width: 160,
        borderColor: themeColor,
       // backgroundColor: themeColor,
        
    },
    sendMsgBtnText: {
        fontFamily: 'Poppins-Bold',
        paddingTop: 4,
        color: 'purple',
        textAlign: 'center'
    },
    usernameText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 15,
        height: 16,
        color: 'gray'
    },
    numberLine: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    friendsText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        textAlign: 'center'
    },
    friendsNumberText: {
        textAlign: 'center',
        fontSize: 18,
    },
    friends: {
        backgroundColor: '#efefef',
        elevation: 3,
        padding: 5,
        borderRadius: 10,
        width: 70,
    },
    postsText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        textAlign: 'center'
    },
    postsNumberText: {
        textAlign: 'center',
        fontSize: 18,
    },
    descriptionContainer: {
        marginHorizontal: 15,
        marginVertical: 15,
    },
    descriptionText: {
        fontFamily: 'Poppins-Regular',
    },
    descriptionTextEdit: {
        fontFamily: 'Poppins-Regular',
        backgroundColor: 'white',
        elevation: 2,
    }
    
})