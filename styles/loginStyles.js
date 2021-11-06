import { Dimensions, PlatformColor, StyleSheet } from "react-native";

const marginBigger = (Dimensions.get("window").height < 740) ? 0 : Dimensions.get("window").height*2/100
const marginSmaller = (Dimensions.get("window").height < 740) ? Dimensions.get("window").height*5/100 : Dimensions.get("window").height*7/100
const marginText = (Dimensions.get("window").height < 740) ? Dimensions.get('window').height*5/100 : Dimensions.get('window').height*10/100

export default StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-start',

    },
    inputStyle: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 28,
        paddingLeft: 50,
        paddingVertical: 15,
        paddingBottom: 9,
        flex: 4,
        backgroundColor: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    inputStyleFocused: {
        borderWidth: 1,
        borderColor: 'purple',
        borderRadius: 28,
        paddingLeft: 50,
        paddingVertical: 15,
        paddingBottom: 9,
        flex: 4,
        backgroundColor: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    inputStyleUsernameCorrect: {
        borderWidth: 2,
        borderColor: 'purple',
        borderRadius: 28,
        paddingLeft: 50,
        paddingVertical: 15,
        paddingBottom: 9,
        flex: 4,
        backgroundColor: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    passwordContainer: {
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 70,
        marginTop: 15,
        marginBottom: 0,
        overflow: "hidden",
        height: 47
    },
    usernameContainer: {
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 0,
        justifyContent: 'flex-end',
        marginHorizontal: 70,
        marginTop: 0,
        marginBottom: 5,
        height: 47
    },
    loginText: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: Dimensions.get('window').height*2/100,
        fontSize: 24,
        color: 'white',
        letterSpacing: 1,
        fontFamily: 'Poppins-Regular'
    },
    loginTextContainer: {
        marginTop: marginText,
        marginBottom: 30
    },
    usernameImage: {
        height: 29, 
        width: 29, 
        position: 'absolute', 
        right: -41, 
        top: -14,
    },
    usernameImagePurple: {
        height: 29, 
        width: 29, 
        position: 'absolute', 
        right: -41, 
        top: -14,
        tintColor: '#6840a8'
    },
    usernameImageRed: {
        height: 29, 
        width: 29, 
        position: 'absolute', 
        right: -41, 
        top: -14, 
        tintColor: 'red',
        overflow: 'visible'
    },
    passwordImage: {
        height: 26, 
        width: 26, 
        position: 'absolute', 
        right: -41, 
        top: -14
    },
    passwordImageRed: {
        height: 26, 
        width: 26, 
        position: 'absolute', 
        right: -41, 
        top: -14,
        tintColor: 'red'
    },
    errorTextContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    errorText: {
        color: '#b3180e',
        textAlign: 'center',
        marginLeft: 10,
        fontFamily: 'Poppins-Regular'
    },
    errorTextBold: {
        fontWeight: 'bold',
        color: '#b3180e'
    },
    checkmarkIcon: {
        position: "absolute",
        left: 7,
        top: -14
    },
    loginBtn: {
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#6840a8',
        backgroundColor: '#6840a8',
        marginTop: marginBigger,
        marginHorizontal: 100,
        height: 40
    },
    loginBtnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Regular'

    },
    forgotPasswordContainer: {
        marginTop: marginSmaller,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    forgotPasswordFirstText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    googleSignInButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 115
    },
    loginWithGoogleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#d599e4',
        borderRadius: 25,
        height: 50,
        marginTop: Dimensions.get("window").height*15/100,
        marginHorizontal: 70,
        flexDirection: "column",
        overflow: "hidden"
        
    },
    loginWithGoogleContainerSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#d599e4',
        borderRadius: 25,
        height: 50,
        marginTop: 100,
        marginHorizontal: 70,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: '#d599e4'
        
    },
    bgGoogleBtn: {
        alignItems: 'center',
        flex: 1,
        width: 300,
        justifyContent: 'center'
    },
    loginWithGoogleBtnText: {
        flex: 1,
        padding: 0,
        paddingTop: 11,
        color: 'gray',
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
    },
    loginWithGoogleBtnTextSelected: {
        flex: 1,
        padding: 0,
        paddingTop: 11,
        color: 'white',
        fontFamily: 'Poppins-Bold'
    },
    loginWithFacebookContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#3b5998',
        borderRadius: 25,
        height: 50,
        marginTop: 18,
        marginHorizontal: 70,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: '#3b5998'
    },
    loginWithFacebookContainerSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#d599e4',
        borderRadius: 25,
        height: 50,
        marginTop: 18,
        marginHorizontal: 70,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: '#d599e4'
    },
    googleBtnSelected: {
        backgroundColor: 'green'
    },
    googleBtnNotSelected: {
        backgroundColor: 'white'
    },
    loginWithFacebookBtnText: {
        flex: 1,
        padding: 0,
        paddingTop: 11,
        color: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
    },
    loginWithFacebookBtnTextSelected: {
        flex: 1,
        padding: 0,
        paddingTop: 11,
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins-Bold'
    },
    buttonsContainer: {
        position: "absolute",
        bottom: Dimensions.get("window").height*9/100,
        width: Dimensions.get("window").width,
        paddingHorizontal: 7,
        
    },
    loginComponentsContainer: {
        height: 285
    }
})