/* global console */

import React, {PropTypes} from 'react'
import { AppRegistry, View, StyleSheet, Dimensions, Image} from 'react-native'
import { Scene, Router, Actions} from 'react-native-router-flux'
import { Provider} from 'react-redux'
import Parse from 'parse/react-native'

/* Custom navigation reducer */
import {createReducer as createRoutesReducer} from './reducers/routes/routesReducer'

import configureStore from './lib/configureStore'
import * as images from '../img'

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

import DjiniBackground from './components/DjiniBackground'

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
    const imageName = `${iconName}${selected ? '_active' : ''}`
    return (
      <View style={styles.tab}>
        <Image style={styles.tabIcon} resizeMode="contain" source={images[imageName]}/>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  tabScene: {
    flex: 1,
    marginBottom: TABBAR_HEIGHT,
  },
  tabBar: {
    height: TABBAR_HEIGHT,
    backgroundColor: 'rgb(61,63,148)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  tab: {
    height: TABBAR_HEIGHT,
    width: WIDTH / 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgb(61,63,148)',
  },
  tabIcon: {
    width: 50,
    height: 25 
  },
  tabIconSelected: {
    color: 'white'
  },
})

export default function init() {

  //init parse sdk
  Parse.initialize(PARSE_APP_ID);
  Parse.serverURL = `${PARSE_BASE_URL}`;

  let Djini = React.createClass( {
    render() {
      const store = configureStore(getInitialState())
      store.dispatch(restoreContacts())
      // setup the router table with App selected as the initial component
      //
      console.log('Djini.render()')
      
      return (
        <DjiniBackground>
        <Provider store={store}>
          <Router hideNavBar={true} createReducer={createRoutesReducer} getSceneStyle={() => styles.scene}>
            <Scene key="root">
              <Scene key="app" component={App} title="Djini" initial={true}/>

              <Scene key="welcome" type="replace" component={Welcome} sceneStyle={styles.scene}/>

              <Scene key="login" type="replace" component={Login} sceneStyle={styles.scene}/>

              <Scene key="home" type="replace" tabs={true} tabBarStyle={styles.tabBar}>
                <Scene key="wishesTab" icon={TabIcon} iconName="lamp">
                  <Scene key="wishes" animation="fade" initial={true} sceneStyle={styles.tabScene} component={Wishes}/>
                  <Scene key="wish" animation="fade" sceneStyle={styles.tabScene} component={Wish} source="wishes"/>
                </Scene>
                <Scene key="contactsTab" icon={TabIcon} iconName="group">
                  <Scene key="contacts" animation="fade" initial={true} sceneStyle={styles.tabScene} component={Contacts}/>
                  <Scene key="friend" animation="fade" sceneStyle={styles.tabScene} component={Friend}/>
                  <Scene key="friendWish" animation="fade" sceneStyle={styles.tabScene} component={Wish} source="friend"/>
                </Scene>
                <Scene key="pots" sceneStyle={styles.tabScene} component={Pots} icon={TabIcon} iconName="todo"/>
                <Scene key="profileTab" icon={TabIcon} iconName="person" onSelect={Actions.profile}>
                  <Scene key="profile" sceneStyle={styles.tabScene} component={Profile}/>
                  <Scene key="profileEdit" sceneStyle={styles.tabScene} component={ProfileEdit}/>
                  <Scene key="more" sceneStyle={styles.tabScene} component={More}/>
                </Scene>
              </Scene>
            </Scene>
          </Router>
        </Provider>
        </DjiniBackground>
      )
    }
  })

  AppRegistry.registerComponent('Djini', () => Djini)
}
