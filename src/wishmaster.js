'use strict';

import React from 'react'
import { AppRegistry, View, Text, StyleSheet, Dimensions} from 'react-native'
import { Scene, Router } from 'react-native-router-flux'
import { Provider } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Parse from 'parse/react-native'

import configureStore from './lib/configureStore'
const {width} = Dimensions.get('window')
import WMColors from './lib/WMColors'

/* Config */
import {
  PARSE_APP_ID,
  PARSE_BASE_URL
} from './lib/config'

/*  Containers */
import App from './containers/App'
import Login from './containers/Login'
import Wishes from './containers/Wishes'
import Contacts from './containers/Contacts'
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
  render(){
    const {selected, iconName, title} = this.props
    return (
      <View style={[styles.tab, selected ? styles.tabSelected : undefined]}>
        <Icon style={[styles.tabIcon, selected ? styles.tabIconSelected : undefined]} name={iconName} size={30} />
        <Text style={[styles.tabText, selected ? styles.tabTextSelected : undefined]}>{title}</Text>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  tabBar: {
    borderColor: WMColors.lightText,
    borderTopWidth: 2,
    height: 60,
    color: WMColors.lightText,
    backgroundColor: WMColors.background,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  tab: {
    height: 60,
    width: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: WMColors.lightText,
    backgroundColor: WMColors.background,
  },
  tabSelected: {
    backgroundColor: WMColors.lightText,
  },
  tabIcon: {
    color: WMColors.lightText
  },
  tabIconSelected: {
    color: 'white'
  },
  tabText: {
    color: WMColors.lightText,
  },
  tabTextSelected: {
    color: 'white'
  }
})

export default function native(platform) {

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

              <Scene key="login" type="replace" component={Login} />
              
              <Scene key="friend" panHandlers={null} direction="vertical" component={Friend} title="Freund"/>

              <Scene key="wish" panHandlers={null} direction="vertical" component={Wish} title="Wunsch"/>

              <Scene key="home" type="replace" panHandlers={null} tabs={true} tabBarStyle={styles.tabBar}>
                <Scene key="wishes" initial={true} component={Wishes} title="Wünsche" icon={TabIcon} iconName="cake"/>
                <Scene key="contacts" component={Contacts} title="Kontakte" icon={TabIcon} iconName="group"/>
                <Scene key="pots" component={Contacts} title="Pots" icon={TabIcon} iconName="folder-shared"/>
                <Scene key="more" component={Contacts} title="Mehr" icon={TabIcon} iconName="more-horiz"/>
              </Scene>

            </Scene>
          </Router>
        </Provider>
      )
    }
  })

  AppRegistry.registerComponent('Wishmaster', () => Wishmaster)
}
