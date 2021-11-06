import React, { createContext } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = props => {

    const contextValue={
        signedInStatus: false
    }
  
    return (
      <AuthContext.Provider value={contextValue}>
        {props.children}
      </AuthContext.Provider>
    );
  };

export default AuthContextProvider;