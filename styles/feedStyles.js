import {Dimensions, StyleSheet} from 'react-native'

const themeColor = '#d599e4'

export default StyleSheet.create({
    navBarContainer: {
        width: '100%',      
        flexDirection: 'row',
        height: 45,
        margin: 0,
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
    navBarItemFirst: {
        
        flex: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navBarItemFirstSelected: {
        
        flex: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navBarItemSecond: {
        flex: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navBarItemText: {
        color: 'gray',
        paddingTop: 5,
        fontFamily: 'Poppins-Regular'
    },
    navBarItemTextSelected: {
        color: themeColor,
        paddingTop: 5,
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
    },
    separator: {
        borderWidth: StyleSheet.hairlineWidth,
        height: 30,
        marginTop: 7
    },
    commPostContainer: {
        maxHeight: 288,
        minHeight: 100,
        marginTop: 10,
        marginHorizontal: 10,
        paddingTop: 5,
        borderTopWidth: 2,
        borderColor: '#Eceeee',
        backgroundColor: '#efefef',
        elevation: 3
        

    },
    commPostHeader: {
        flexDirection: 'row',
    },
    commPostTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        paddingTop: 3,
        textAlign: 'left',
        paddingLeft: 10,
    },
    commPostText: {
        paddingLeft: 10,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        overflow: 'hidden',
        maxHeight: 91,
    },
    commPostUserContainer: {
        flexDirection: 'row',
        width: '60%'
    },
    commPostUser: {
        paddingTop: 5,
        paddingLeft: 10
    },
    commPostTextContainer: {
        maxHeight: 100,

    },
    socialContainer: {
        flexDirection: 'row',
        height: 34,
        borderTopWidth: StyleSheet.hairlineWidth
        
        
    },
    likesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        
        // borderTopWidth: StyleSheet.hairlineWidth
    },
    likesContainerClicked: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        
        // borderTopWidth: StyleSheet.hairlineWidth
    },
    separatorSecond: {
        borderLeftWidth: StyleSheet.hairlineWidth,
        height: 28,
        marginVertical: 3,
    },
    commPostNumOfLikes: {
        
        textAlign: 'center'
    },
    commLikeBtn: {
        width: 30,
        height: 24,
        marginLeft: 4
    },
    commLikeBtnLiked: {
        width: 24,
        height: 21,
        tintColor: themeColor,
        marginLeft: 4,
    },
    commentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderRightWidth: 1,
        // borderTopWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: 0,
    },
    commPostNumOfComments: {
        textAlign: 'center'
    },
    commNewsContainer: {
        paddingHorizontal: 8,
        marginVertical: 8,
    },
    commPostNewsPost: {
        fontFamily: 'Poppins-Italic'
    },
    commNewsInnerContainer: {
        backgroundColor: 'white',
        elevation: 2,
        padding: 7,
        borderRadius: 5,
    },
    timeAndTools: {
        flexDirection: 'row',
        position: 'absolute',
        top: 10,
        right: 9
    },
    commPostTimeUploadedContainer: {
        marginBottom: 20,
    },
    newsPostContainer: {
        elevation: 3,  
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#efefef',
        paddingBottom: 0,
        borderTopWidth: 2,
        borderColor: '#Eceeee',
    },
    newsPostSourceText: {
        paddingHorizontal: 10,
        marginTop: 5,
        marginLeft: 5,
        fontFamily: 'Poppins-Regular'
    },
    newsPostTitleText: {
        marginLeft: 5,
        paddingHorizontal: 10,
        
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
    },
    newsPostText: {
        fontFamily: 'Poppins-Regular',
        marginLeft: 5,
        marginTop: 5,
        paddingBottom: 5,
        paddingHorizontal: 10,
        
    },
    postsContainer: {
        flex: 1,
        
    }
})