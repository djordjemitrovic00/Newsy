import {StyleSheet} from 'react-native'
export default StyleSheet.create({
    container: {
        backgroundColor: 'green'
    },
    commPostContainer: {
        minHeight: 100,
        marginVertical: 10,
        marginHorizontal: 10,
        paddingTop: 5,
        borderTopWidth: 2,
        borderColor: '#Eceeee',
        overflow: 'hidden',
        elevation: 1
    },
    commPostTextContainer: {
        
    },
    commPostText: {
        paddingLeft: 10,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    socialContainer: {
        flexDirection: 'row',
        height: 34,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    eachCommentContainer: {
        marginVertical: 8,
    },
    eachCommentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    eachCommentHeaderLeft: {
        flexDirection: 'row'
    },
    eachCommentHeaderRight: {
        flexDirection: 'row'
    },
    eachCommentUsername: {
        textAlignVertical: 'center',
        marginLeft: 5,
        paddingTop: 5,
        fontSize: 13,
        fontFamily: 'Poppins-Regular'
    },
    eachCommentTime: {
        fontFamily: 'Poppins-Regular'
    },
    eachCommentText: {
        marginLeft: 8,
        marginTop: 2,
        paddingRight: 50,
        fontFamily: 'Poppins-Regular'
    },
    commentSeparator: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#Eceeee',
        marginHorizontal: 10,
    },
    commentLikesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    newCommentInput: {
        borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5,
        borderColor: 'gray',
        flex: 1,
        paddingLeft: 8,
        paddingRight: 50,
        paddingTop: 8,
        fontFamily: 'Poppins-Regular'
    },
    newCommentContainer: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'white'
    },
    newCommentSend: {
        position: 'absolute',
        bottom: 7,
        right: 10,
    }

})