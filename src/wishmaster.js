'use strict';

import React, {PropTypes} from 'react'
import { AppRegistry, View, StyleSheet, Dimensions, BackAndroid} from 'react-native'
import { Scene, Router, Actions } from 'react-native-router-flux'
import { Provider } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Parse from 'parse/react-native'

import configureStore from './lib/configureStore'
import WMColors from './lib/WMColors'

const WIDTH = Dimensions.get('window').width
const TABBAR_HEIGHT = 50 

/* Config */
import {
  PARSE_APP_ID,
  PARSE_BASE_URL
} from './lib/config'

/*  Containers */
import App from './containers/App'
import Welcome from './containers/Welcome'
import Login from './containers/Login'
import Wishes from './containers/Wishes'
import Contacts from './containers/Contacts'
import Pots from './containers/Pots'
import More from './containers/More'
import Profile from './containers/Profile'
import ProfileEdit from './containers/ProfileEdit'
import Friend from './containers/Friend'
import Wish from './containers/Wish'

/* Actions */
import {restoreContacts} from './actions/contacts'

/* Initial States */
import globalInitialState from './reducers/global/globalInitialState'
import authInitialState from './reducers/auth/authInitialState'
import contactsInitialState from './reducers/contacts/contactsInitialState'
import friendInitialState from './reducers/friend/friendInitialState'
import wishInitialState from './reducers/wish/wishInitialState'
import wishesInitialState from './reducers/wishes/wishesInitialState'

function getInitialState() {
  const _initState = {
    global: new globalInitialState,
    auth: new authInitialState,
    contacts: new contactsInitialState,
    friend: new friendInitialState,
    wish: new wishInitialState,
    wishes: new wishesInitialState
  }
  return _initState
}

class TabIcon extends React.Component {
  static propTypes = {
    iconName: PropTypes.string.isRequired,
    selected: PropTypes.bool
  }
  render(){
    const {selected, iconName} = this.props
    return (
      <View style={[styles.tab, selected ? styles.tabSelected : undefined]}>
        <Icon style={[styles.tabIcon, selected ? styles.tabIconSelected : undefined]} name={iconName} size={30} />
      </View>
      )
  }
}

BackAndroid.addEventListener('hardwareBackPress', function() {
  if (Actions.pop()) {
    return true;
  }
  return false;
});

const styles = StyleSheet.create({
  tabScene: {
    flex: 1,
    marginBottom: TABBAR_HEIGHT,
    backgroundColor: WMColors.background
  },
  tabBar: {
    height: TABBAR_HEIGHT,
    backgroundColor: WMColors.background,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    shadowColor: WMColors.lightText,
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  tab: {
    height: TABBAR_HEIGHT,
    width: WIDTH / 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: WMColors.background,
    borderColor: 'white',
  },
  tabSelected: {
    backgroundColor: WMColors.lightText,
  },
  tabIcon: {
    color: WMColors.lightText,
    borderWidth: 0
  },
  tabIconSelected: {
    color: 'white'
  },
})

export default function init() {

  //init parse sdk
  Parse.initialize(PARSE_APP_ID);
  Parse.serverURL = `${PARSE_BASE_URL}`;

  let Wishmaster = React.createClass( {
    render() {
      // configureStore will combine reducers from snowflake and main application
      // it will then create the store based on aggregate state from all reducers
      const store = configureStore(getInitialState())

      store.dispatch(restoreContacts())
      // setup the router table with App selected as the initial component
      return (
        <Provider store={store}>
          <Router hideNavBar={true}>
            <Scene key="root">

              <Scene key="app" component={App} title="Wishmaster" initial={true}/>

              <Scene key="welcome" type="replace" component={Welcome} />

              <Scene key="login" type="replace" component={Login} />

              <Scene key="home" type="replace" tabs={true} tabBarStyle={styles.tabBar}>
                <Scene key="wishesTab" icon={TabIcon} iconName="cake">
                  <Scene key="wishes" initial={true} sceneStyle={styles.tabScene} component={Wishes}/>
                  <Scene key="wish" sceneStyle={styles.tabScene} component={Wish} source="wishes"/>
                </Scene>
                <Scene key="contactsTab" icon={TabIcon} iconName="group">
                  <Scene key="contacts" initial={true} sceneStyle={styles.tabScene} component={Contacts}/>
                  <Scene key="friend" sceneStyle={styles.tabScene} component={Friend}/>
                  <Scene key="friendWish" sceneStyle={styles.tabScene} component={Wish} source="friend"/>
                </Scene>
                <Scene key="pots" sceneStyle={styles.tabScene} component={Pots} icon={TabIcon} iconName="folder-shared"/>
                <Scene key="profileTab" icon={TabIcon} iconName="person" onSelect={Actions.profile}>
                  <Scene key="profile" sceneStyle={styles.tabScene} component={Profile}/>
                  <Scene key="profileEdit" sceneStyle={styles.tabScene} component={ProfileEdit}/>
                  <Scene key="more" sceneStyle={styles.tabScene} component={More}/>
                </Scene>
              </Scene>

            </Scene>
          </Router>
        </Provider>
      )
    }
  })

  AppRegistry.registerComponent('Wishmaster', () => Wishmaster)
}
