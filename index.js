/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import AuthContextProvider from './contexts/AuthContext';

const Consumers = () => {
    return(
        <AuthContextProvider>
            <App/>
        </AuthContextProvider>
    )
}

AppRegistry.registerComponent(appName, () => Consumers);
