import { Dimensions, StyleSheet } from "react-native";
import { Image } from "react-native-paper/lib/typescript/components/Avatar/Avatar";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    backgroundImageContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    }
});