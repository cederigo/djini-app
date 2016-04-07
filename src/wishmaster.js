'use strict';

/**
 * ## imports
 *
 */
/**
 * ### React
 *
 * Necessary components from ReactNative
 */
import React, { AppRegistry, View, PropTypes, Text } from 'react-native';

/**
 * ### Router-Flux
 *
 * Necessary components from Router-Flux
 */
import RNRF, { Scene } from 'react-native-router-flux';

/**
 * ### Redux
 *
 * ```Provider``` will tie the React-Native to the Redux store
 */
import { Provider, connect } from 'react-redux';

/**
 * ### configureStore
 *
 *  ```configureStore``` will connect the ```reducers```, the
 *
 */
import configureStore from './lib/configureStore';


/**
 * ### containers
 *
 * All the top level containers
 *
 */
import App from './containers/App';
import LoginPhoneNumber from './containers/LoginPhoneNumber';
import LoginVerificationCode from './containers/LoginVerificationCode';
import LoginProfile from './containers/LoginProfile';

/** 
 * ### icons
 *
 * Add icon support for use in Tabbar
 * 
 */
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * ## Actions
 *  The necessary actions for dispatching our bootstrap values
 */
import {setPlatform, setVersion} from './reducers/device/deviceActions';

/**
 * ## States
 * Snowflake explicitly defines initial state
 *
 */
import deviceInitialState from './reducers/device/deviceInitialState';
import globalInitialState from './reducers/global/globalInitialState';
import authInitialState from './reducers/auth/authInitialState';

/**
 *  The version of the app but not  displayed yet
 */
var VERSION='0.0.1';

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 * @returns {Object} object with 4 keys
 */
function getInitialState() {
  const _initState = {
    global: (new globalInitialState),
    device: (new deviceInitialState).set('isMobile',true),
    auth: new authInitialState
  };
  return _initState;
}
/**
* ## TabIcon 
* 
* Displays the icon for the tab w/ color dependent upon selection
*/

class TabIcon extends React.Component {
  render(){
    var color = this.props.selected ? '#FF3366' : '#FFB3B3';
    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center'}}>
        <Icon style={{color: color}} name={this.props.iconName} size={30} />
        <Text style={{color: color}}>{this.props.title}</Text>
      </View>
      );
  }
}

TabIcon.propTypes = {
  selected: PropTypes.boolean,
  iconName: PropTypes.string,
  title: PropTypes.string
}

/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 * *Note* the ```store``` itself is set into the ```store```.  This
 * will be used when doing hot loading
 */

export default function native(platform) {

  let Wishmaster = React.createClass( {
    render() {
      
      const store = configureStore(getInitialState());

      //Connect w/ the Router
      const Router = connect()(RNRF.Router);
      
      // configureStore will combine reducers from snowflake and main application
      // it will then create the store based on aggregate state from all reducers
      store.dispatch(setPlatform(platform));
      store.dispatch(setVersion(VERSION));
      
      // setup the router table with App selected as the initial component
      return (
        <Provider store={store}>
          <Router hideNavBar={true}>
            <Scene key="root">

              <Scene key="app"
                component={App}
                title="Wishmaster"
                initial={true}/>

              <Scene key="login">
                <Scene key="loginPhoneNumber" initial={true} component={LoginPhoneNumber} />
                <Scene key="loginVerificationCode" component={LoginVerificationCode} />
                <Scene key="loginProfile" component={LoginProfile} />
              </Scene>

            </Scene>
          </Router>
        </Provider>
      );
    }
  });
  /**
   * registerComponent to the AppRegistery and off we go....
   */

  AppRegistry.registerComponent('wishmaster', () => Wishmaster);
}
