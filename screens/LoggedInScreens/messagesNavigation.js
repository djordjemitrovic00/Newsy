import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

const messagesNavigation = ({route}) => {

    useEffect(() => {
        let naviga = route.params.naviga;
        naviga.navigate('Messages')
    })

    return(
        <View>
            <Text>messagesNavigation Screen</Text>
        </View>

    )
}

export default messagesNavigation;