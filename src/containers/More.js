
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import {TouchableWithoutFeedback, StyleSheet, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import dismissKeyboard from 'dismissKeyboard'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {sendFeedback, onFeedbackChange} from '../actions/feedback'

import {AppBar} from '../components/AppBar'
import DjiniButton from '../components/DjiniButton'
import DjiniText from '../components/DjiniText'
import DjiniTextInput from '../components/DjiniTextInput'
import ListRowSeperator from '../components/ListRowSeperator'
import Tabs from '../components/Tabs'

class More extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }
  openLink(href) {
    Linking.openURL('http://djini.ch/' + href)
  }
  render() {
    const {isFetching, isValid, description, user, dispatch} = this.props
    return(
      <View style={styles.container}>
        <View style={styles.appBar}>
          <AppBar textStyle="dark" title="Mein Profil" showBackButton={false}/>
        </View>
        <ScrollView keyboardShouldPersistTaps={true}>
          <Tabs selected="more">
            <DjiniText style={styles.tabText} name="profile" onSelect={() => Actions.profile({type: 'replace'})}>Details</DjiniText>
            <DjiniText style={styles.tabText} name="more">Mehr</DjiniText>
          </Tabs>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.feedbackC}>
                <DjiniText style={styles.titleText}>Feedback schreiben</DjiniText>
                <DjiniTextInput
                  type="light"
                  placeholder="Gib Djini Feedback! Er freut sich über Nettes, Vorschläge und Kritik gleichermassen"
                  autoGrow={true}
                  minHeight={75}
                  value={description}
                  onChangeText={(text) => dispatch(onFeedbackChange(text))}
                  />
              <DjiniButton
                style={styles.feedbackSubmit}
                disabled={isFetching || !isValid}
                onPress={() => {dispatch(sendFeedback(user, description)); dismissKeyboard()}}
                caption="Senden"/>
            </View>
          </TouchableWithoutFeedback>
          <View>
            <ListRowSeperator/>
            <TouchableOpacity style={styles.item} onPress={() => this.openLink('faq')}>
              <DjiniText style={styles.itemText}>FAQ</DjiniText>
              <Icon style={styles.itemIcon} name="chevron-right"/>
            </TouchableOpacity>
            <ListRowSeperator/>
            <TouchableOpacity style={styles.item} onPress={() => this.openLink('agb')}>
              <DjiniText style={styles.itemText}>Nutzungsbedingungen (ABG)</DjiniText>
              <Icon style={styles.itemIcon} name="chevron-right"/>
            </TouchableOpacity>
            <ListRowSeperator/>
            <TouchableOpacity style={styles.item} onPress={() => this.openLink('credits')}>
              <DjiniText style={styles.itemText}>Credits</DjiniText>
              <Icon style={styles.itemIcon} name="chevron-right"/>
            </TouchableOpacity>
            <ListRowSeperator/>
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
  appBar: {
    backgroundColor: 'rgb(240, 240, 240)'
  },
  titleText: {
    fontSize: 20
  },
  tabText: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingLeft: 25,
    paddingRight: 15
  },
  itemText: {
    color: 'white',
    fontSize: 20,
    flex: 1
  },
  itemIcon: {
    color: 'white',
    fontSize: 30,
  },
  feedbackC: {
    padding: 25
  },
  feedbackSubmit: {
    marginTop: 25,
    paddingVertical: 10,
    alignSelf: 'flex-end',
  }
});

function select(state) {
  return {...state.feedback.toJS(), user: state.global.currentUser}
}
export default connect(select)(More);
