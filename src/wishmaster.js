'use strict';

import React, { AppRegistry, View, StatusBar, Text} from 'react-native';
import RNRF, { Scene } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import configureStore from './lib/configureStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

/*  Containers */
import App from './containers/App';
import Login from './containers/Login';
import Wishes from './containers/Wishes';
import Friends from './containers/Friends';

/* Actions */
import * as deviceActions from './reducers/device/deviceActions';
import * as socialActions from './reducers/social/socialActions';

/* Initial States */
import deviceInitialState from './reducers/device/deviceInitialState';
import globalInitialState from './reducers/global/globalInitialState';
import authInitialState from './reducers/auth/authInitialState';
import socialInitialState from './reducers/social/socialInitialState';

const VERSION='0.0.1';

function getInitialState() {
  const _initState = {
    global: new globalInitialState,
    device: new deviceInitialState,
    auth: new authInitialState,
    social: new socialInitialState
  };
  return _initState;
}

class TabIcon extends React.Component {
  render(){
    const {selected, iconName, title} = this.props
    var color = selected ? '#FF3366' : '#FFB3B3';
    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center'}}>
        <Icon style={{color: color}} name={iconName} size={30} />
        <Text style={{color: color}}>{title}</Text>
      </View>
      );
  }
}
/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 *
 */
export default function native(platform) {

  let Wishmaster = React.createClass( {
    render() {
      
      // configureStore will combine reducers from snowflake and main application
      // it will then create the store based on aggregate state from all reducers
      const store = configureStore(getInitialState())

      //Connect w/ the Router
      const Router = connect()(RNRF.Router)
      
      store.dispatch(deviceActions.setPlatform(platform))
      store.dispatch(deviceActions.setVersion(VERSION))
      store.dispatch(socialActions.restoreSocialState())

      // setup the router table with App selected as the initial component
      return (
        <Provider store={store}>
          <Router hideNavBar={true}>
            <Scene key="root">

              <Scene key="app" component={App} title="Wishmaster" initial={true}/>

              <Scene key="login" type="replace" component={Login} />

              <Scene key="home" panHandlers={null} tabs={true} hideNavBar={false} >
                <Scene key="wishes" initial={true} component={Wishes} title="Meine Wünsche" icon={TabIcon} iconName="cake"/>
                <Scene key="friends" component={Friends} title="Meine Freunde" icon={TabIcon} iconName="accessibility"/>
              </Scene>

            </Scene>
          </Router>
        </Provider>
      );
    }
  });

  AppRegistry.registerComponent('Wishmaster', () => Wishmaster);
}
