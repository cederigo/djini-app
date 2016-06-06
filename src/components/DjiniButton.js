import { connect } from 'react-redux';
import React, {Component} from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import WMColors from '../lib/WMColors'
import {User} from '../lib/types'
import {newWish} from '../actions/wishes'

class DjiniButton extends Component {
  props: {
    fromUser: User,
    toUser: User,
  }
  render() {
    const {dispatch, fromUser, toUser} = this.props

    return (
      <TouchableOpacity style={styles.container} onPress={() => dispatch(newWish(fromUser, toUser))}>
        <Text style={styles.text}>Djini</Text>
        <Icon style={styles.icon} name={'cake'} size={80} />
      </TouchableOpacity>
    )
  }
}

DjiniButton.defaultProps = {
  text: 'Neuen Wunsch erfassen'
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: WMColors.lightText,
    fontSize: 50,
    fontWeight: '200'
  },
  icon: {
    marginVertical: 20,
    color: WMColors.lightText
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    fromUser: state.global.currentUser
  };
}
export default connect(select)(DjiniButton)