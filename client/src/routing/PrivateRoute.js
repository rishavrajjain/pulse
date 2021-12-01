import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({ component: Component, ...rest }) => {
  
  

  const token= localStorage.getItem('app-token');
  return (
    <Route
      {...rest}
      render={props =>
        !token ? (
          <Redirect to='/' {...props} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute