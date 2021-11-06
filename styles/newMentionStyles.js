import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    titleInput: {
        paddingVertical: 0,
        borderBottomWidth: 1,
        paddingVertical: 5,
        paddingTop: 10,
        maxHeight: 80,
        fontFamily: 'Poppins-Regular',
        textAlignVertical: 'top'
    },
    contentInput: {
        borderWidth: 0,
        paddingVertical: 7,
        paddingHorizontal: 5,
        fontFamily: 'Poppins-Regular',
        flex: 1,
        textAlignVertical: 'top'
    },
    newsPost: {
        backgroundColor: 'white',
        elevation: 2,
        marginHorizontal: 5,
        marginBottom: 5,
        padding: 6,
        borderRadius: 5,
        
    }
})