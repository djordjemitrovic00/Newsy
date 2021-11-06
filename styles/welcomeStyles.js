import {Dimensions, StyleSheet} from 'react-native'

const themeColor = '#d599e4'

export default StyleSheet.create({
    logoWithText: {
        marginHorizontal: 50,
        marginTop: Dimensions.get('window').height*2/20,
        alignItems: 'center'
    },
    bgImage: {
        flex: 1,
        
    },
    textBeforeLogo: {

        fontSize: 22,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center'
    },
    description: {
        marginHorizontal: 30,
        alignItems: 'center',
        marginTop: Dimensions.get('window').height*2/12

    },
    descriptionTitleText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 22,
        textAlign: 'center',
        color: '#6840a8',
        color: themeColor

    },
    descriptionContentText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        textAlign: 'center',
        color: '#6840a8',
        color: themeColor
    },
    signButtons: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        bottom: Dimensions.get("window").height*10/100,  
        left: 0,
        right: 0,     
        paddingHorizontal: 70,
        
    },   
    registerBtn: {
        borderWidth: 2,
        borderColor: themeColor,
        backgroundColor: themeColor,
        justifyContent: 'center',
        height: 50,
        borderRadius: 25
    },
    registerBtnPressed: {
        borderWidth: 2,
        borderColor: themeColor,
        backgroundColor: themeColor,
        justifyContent: 'center',
        height: 50,
        borderRadius: 25
    },
    registerBtnText: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Bold',
        paddingTop: 2,
        fontSize: 15,
        color: 'white'
    },
    registerBtnTextPressed: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Bold',
        paddingTop: 2,
        fontSize: 15,
        color: 'white'
    },
    loginBtn: {
        borderWidth: 2,
        borderColor: themeColor,
        backgroundColor: themeColor,
        paddingHorizontal: 50,
        justifyContent: 'center',
        marginTop: 15,
        height: 50,
        borderRadius: 25
    },
    loginBtnPressed: {
        borderWidth: 2,
        borderColor: themeColor,
        backgroundColor: themeColor,
        paddingHorizontal: 50,
        justifyContent: 'center',
        marginTop: 15,
        height: 50,
        borderRadius: 25
    },
    loginBtnText: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Bold',
        paddingTop: 2,
        fontSize: 15,
        color: 'white'
    },
    loginBtnTextPressed: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins-Bold',
        paddingTop: 2,
        fontSize: 15,
        color: 'white',
    }
})