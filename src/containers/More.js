
import { connect } from 'react-redux';
import React, {Component} from 'react'
import { StyleSheet, View, StatusBar, Text, TouchableOpacity, TextInput } from 'react-native';
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {AppBar} from '../components/AppBar'
import WMButton from '../components/WMButton'
import Tabs from '../components/Tabs'

import WMColors from '../lib/WMColors'

class More extends Component {
  render() {
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true}/>
        <AppBar title="Mehr" showBackButton={false}/>
        <Tabs selected="more">
          <Text style={styles.tabText} name="profile" onSelect={() => Actions.profile({type: 'replace'})}>Mein Profil</Text>
          <Text style={styles.tabText} name="more">Mehr</Text>
        </Tabs>
        <View style={styles.feedback}>
          <Text style={styles.text}>Feedback schreiben</Text>
          <Text style={styles.textSmall}>Sag Djini deine Verbesserungswünsche für die App…</Text>
          <TextInput
            multiline={true}
            style={styles.feedbackInput} />
          <WMButton style={styles.feedbackSubmit} caption="Senden"/>
        </View>
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

export default connect()(More);
