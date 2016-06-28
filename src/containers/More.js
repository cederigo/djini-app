
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import {TouchableWithoutFeedback, StyleSheet, View, ScrollView, StatusBar, Text, TouchableOpacity, TextInput } from 'react-native';
import dismissKeyboard from 'dismissKeyboard'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {sendFeedback, onFeedbackChange} from '../actions/feedback'

import {AppBar} from '../components/AppBar'
import WMButton from '../components/WMButton'
import Tabs from '../components/Tabs'

import WMColors from '../lib/WMColors'

class More extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }
  render() {
    const {isFetching, isValid, description, user, dispatch} = this.props
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true}/>
        <AppBar title="Mehr" showBackButton={false}/>
        <ScrollView>
          <Tabs selected="more">
            <Text style={styles.tabText} name="profile" onSelect={() => Actions.profile({type: 'replace'})}>Mein Profil</Text>
            <Text style={styles.tabText} name="more">Mehr</Text>
          </Tabs>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.feedback}>
              <Text style={styles.text}>Feedback schreiben</Text>
              <Text style={styles.textSmall}>Sag Djini deine Verbesserungswünsche für die App…</Text>
              <TextInput
                autoCorrect={false}
                multiline={true}
                value={description}
                onChangeText={(text) => dispatch(onFeedbackChange(text))}
                style={styles.feedbackInput} />
              <WMButton
                style={styles.feedbackSubmit}
                disabled={isFetching || !isValid}
                onPress={() => {dispatch(sendFeedback(user, description)); dismissKeyboard()}}
                caption="Senden"/>
            </View>
          </TouchableWithoutFeedback>
          <View>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>FAQ</Text>
              <Icon style={styles.itemIcon} name="chevron-right"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Nutzungsbedingungen (ABG)</Text>
              <Icon style={styles.itemIcon} name="chevron-right"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Credits</Text>
              <Icon style={styles.itemIcon} name="chevron-right"/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: WMColors.lightText,
    fontSize: 20
  },
  textSmall: {
    color: WMColors.lightText,
    fontSize: 14
  },
  tabText: {
    fontSize: 20,
    color: 'white'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WMColors.lightText,
    height: 60,
    paddingLeft: 25,
    borderColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  itemText: {
    color: 'white',
    fontSize: 20,
    flex: 1
  },
  itemIcon: {
    color: 'white',
    fontSize: 40,
  },
  feedback: {
    backgroundColor: WMColors.white,
    padding: 25
  },
  feedbackInput: {
    height: 100,
    backgroundColor: 'white',
    marginVertical: 20,
    fontSize: 14,
    padding: 10,
    color: WMColors.lightText
  },
  feedbackSubmit: {
    alignSelf: 'flex-end',
    paddingHorizontal: 50
  
  }
});

function select(state) {
  return {...state.feedback.toJS(), user: state.global.currentUser}
}
export default connect(select)(More);
