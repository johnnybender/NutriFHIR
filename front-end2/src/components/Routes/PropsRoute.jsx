import React from 'react';
import { Route } from 'react-router';

export const PropsRoute = ({ component: Component, ...props }) => (
  <Route
    { ...props }
    render={ renderProps => (<Component { ...renderProps } { ...props } />) }
  />
);

export default PropsRoute;