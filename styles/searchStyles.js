import {StyleSheet} from 'react-native';

const themeColor = '#d599e4'

export default StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
    },
    searchInput: {
        borderWidth: 2,
        borderColor: '#d599e4',
        borderRadius: 10,
        borderTopLeftRadius: 70,
        borderBottomLeftRadius: 70,
        flex: 1,
        marginHorizontal: 8,
        marginTop: 10,
        height: 45,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        paddingBottom: 8,
        paddingLeft: 44,
        paddingRight: 72,
        
    },
    searchButton: {
        position: 'absolute',
        right: 17,
        top: 20,
    },
    searchButtonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: themeColor,
    },
    resultItemContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: 'white',
        elevation: 2,
        height: 60,
        alignItems: 'center',
        paddingLeft: 10,
    },
    eachItemText: {
        fontFamily: 'Poppins-Regular',
        paddingLeft: 10
    }
})