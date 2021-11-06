import {StyleSheet, Dimensions} from 'react-native';

const themeColor = '#d599e4'

const marginText = (Dimensions.get("window").height < 740) ? Dimensions.get('window').height*2/100 : Dimensions.get('window').height*5/100


export default StyleSheet.create({
    nameInput: {
        borderWidth: 2,
    },
    inputStyle: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 28,
        paddingLeft: 20,
        paddingVertical: 15,
        paddingBottom: 10,
        flex: 4,
        backgroundColor: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    inputStylePassword: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 28,
        paddingLeft: 20,
        paddingVertical: 15,
        paddingBottom: 10,
        paddingRight: 44,
        flex: 4,
        backgroundColor: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    registerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: Dimensions.get('window').height*2/100,
        fontSize: 24,
        color: 'white',
        letterSpacing: 1,
        fontFamily: 'Poppins-Regular'
    },
    registerTextContainer: {
        marginTop: marginText,
        marginBottom: 10
    },
    inputContainer: {
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: Dimensions.get('window').width/5 * 0.9,
        marginTop: 15,
        marginBottom: 0,
        height: 47
    },
    showPasswordIcon: {
        position: 'absolute',
        right: 12,
        top: 9,
    },
    conditionsBox: {
        flexDirection: 'row',
        marginHorizontal: 60,
        marginTop: 20,
    },
    signUpBtnNotSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'purple',
        borderRadius: 25,
        height: 50,
        marginTop: Dimensions.get("window").height*3/100,
        marginHorizontal: 70,
        flexDirection: "column",
        overflow: "hidden"
    },
    signUpBtnSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'purple',
        borderRadius: 25,
        height: 50,
        marginTop: Dimensions.get("window").height*3/100,
        marginHorizontal: 70,
        flexDirection: "column",
        overflow: "hidden",
    },
    signUpBtnText: {
        color: 'purple',
        fontFamily: 'Poppins-Bold',
        paddingTop: 4,
        fontSize: 16,
    },
    signUpBtnTextSelected: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        paddingTop: 4,
        fontSize: 16,
    },
    continueWithBox: {
        alignItems: 'center',
        marginTop: 30,
    },
    continueWithText: {
        fontFamily: 'Poppins-Regular'
    },
    googlefacebook: {
        paddingTop: 10,
        flexDirection: 'row',
        width: 150,
        justifyContent: 'space-evenly'
    }

})