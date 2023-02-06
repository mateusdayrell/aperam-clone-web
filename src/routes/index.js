import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from './MyRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import MyProfile from '../pages/MyProfile';
import Images from '../pages/Images';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/login" component={Login} />
      <MyRoute exact path="/cadastrar-usuario" component={Register} />
      <MyRoute exact path="/dashboard" component={Dashboard} isClosed />
      <MyRoute exact path="/usuario" component={MyProfile} isClosed />
      <MyRoute exact path="/fotos" component={Images} isClosed />
    </Switch>
  );
}
