import { connect } from 'react-redux'
import React, {PropTypes} from 'react'
import { AppRegistry, View, StyleSheet, Dimensions, Image, StatusBar} from 'react-native'
import { Scene, Router, Switch, Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Provider} from 'react-redux'
import Parse from 'parse/react-native'
import moment from 'moment'
import 'moment/locale/de'

/* Set default locale */
moment.locale('de')

/* Custom navigation reducer */
import {createReducer as createRoutesReducer} from './reducers/routes/routesReducer'

import {clearBadge} from './actions/tabs'

import configureStore from './lib/configureStore'
import {configurePushNotification} from './lib/pushNotification'
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
import Notes from './containers/Notes'
import Note, {NoteDialog} from './containers/Note'
import More from './containers/More'
import Profile from './containers/Profile'
import Friend from './containers/Friend'
import Wish from './containers/Wish'

import DjiniBackground from './components/DjiniBackground'

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

const TabIcon = connect((state) => ({badges: state.global.badges.toJS()}))(class TabIcon extends React.Component {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    badges: PropTypes.object.isRequired
  }
  render(){
    const {selected, iconName, badges, sceneKey} = this.props
    const badge = badges[sceneKey]
    const imageName = `${iconName}${selected ? '_active' : ''}`
    return (
      <View style={styles.tab}>
        {badge ? <Icon style={styles.tabBadge} name="error-outline"/> : undefined }
        <Image style={styles.tabIcon} resizeMode="contain" source={images[imageName]}/>
      </View>
      )
  }
})


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
  tabBadge: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 20, top: 5,
    color: 'red',
    fontSize: 20
  },
})

const getActiveScene = (state) => {
  let cbase, result = state;
  while((cbase = result.children)) { result = cbase[result.index]; }
  return result
}

const setStatusBarStyle = (os, navigationState) => { 
  const activeScene = getActiveScene(navigationState)
  const statusBarStyle = activeScene.statusBarStyle || 'light-content' //default
  console.log('setStatusBarStyle() activeScene: ', activeScene.key)
  if (os === 'ios') {
    StatusBar.setBarStyle(statusBarStyle)
  } else {
    StatusBar.setTranslucent(true)
    if (statusBarStyle === 'light-content') {
      StatusBar.setBackgroundColor('transparent', true)
    } else {
      StatusBar.setBackgroundColor('rgba(0,0,0,0.5)', true)
    }
  }
}

export default function init(os) {
  
  let initialized = false
  // Init parse sdk
  Parse.initialize(PARSE_APP_ID);
  Parse.serverURL = `${PARSE_BASE_URL}`;
  // Configure push notifications
  configurePushNotification()

  const store = configureStore(getInitialState())

  const onTabPress = (key) => {
    store.dispatch(clearBadge(key))
    Actions[key]()
  }
  
  let Djini = React.createClass( {
    render() {
      return (
        <DjiniBackground>
          <Provider store={store}>
            <Router hideNavBar={true} createReducer={createRoutesReducer} getSceneStyle={() => styles.scene}>
              <Scene key="root">
                <Scene key="app" component={App} initial={true}/>

                <Scene key="welcome" type="replace" component={Welcome} sceneStyle={styles.scene}/>

                <Scene key="login" type="replace" component={Login} sceneStyle={styles.scene}/>

                <Scene 
                  key="home" type="replace"
                  tabs={true} tabBarStyle={styles.tabBar}
                  component={Switch}
                  selector={(props) => {
                    setStatusBarStyle(os, props.navigationState)
                    let sceneKey = props.children[props.index].sceneKey
                    if (!initialized && props.initialScene) {
                      sceneKey = props.initialScene
                    }
                    initialized = true
                    return sceneKey
                  }}>
                  <Scene key="wishesTab" icon={TabIcon} iconName="lamp" onPress={() => onTabPress('wishesTab')}>
                    <Scene key="wishes" animation="fade" sceneStyle={styles.tabScene} duration={0} component={Wishes} initial={true}/>
                    <Scene key="wish" animation="fade" sceneStyle={styles.tabScene} component={Wish} source="wishes" statusBarStyle="default"/>
                  </Scene>
                  <Scene key="contactsTab" icon={TabIcon} iconName="group" onPress={() => onTabPress('contactsTab')}>
                    <Scene key="contacts" animation="fade" duration={0} sceneStyle={styles.tabScene} component={Contacts} initial={true}/>
                    <Scene key="friend" animation="fade" statusBarStyle="default" component={Friend}/>
                    <Scene key="friendWish" animation="fade" sceneStyle={styles.tabScene} component={Wish} source="friend" statusBarStyle="default"/>
                    <Scene key="noteDialog" animation="fade" sceneStyle={styles.tabScene} component={NoteDialog} statusBarStyle="default"/>
                  </Scene>
                  <Scene key="notesTab" icon={TabIcon} iconName="todo" onPress={() => onTabPress('notesTab')}>
                    <Scene key="notes" animation="fade" duration={0} sceneStyle={styles.tabScene} component={Notes} initial={true}/>
                    <Scene key="note" animation="fade" sceneStyle={styles.tabScene} component={Note} statusBarStyle="default"/>
                  </Scene>
                  <Scene key="profileTab" icon={TabIcon} iconName="person" onPress={() => onTabPress('profileTab')}>
                    <Scene key="profile" animation="fade" duration={0} statusBarStyle="default" sceneStyle={styles.tabScene} component={Profile}/>
                    <Scene key="more" type="replace" statusBarStyle="default" sceneStyle={styles.tabScene} component={More}/>
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
