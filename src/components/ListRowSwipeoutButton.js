
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderColor: 'white',
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 30
  }
})

export default function ListRowSwipeoutButton(props) {
  return (
    <View style={styles.container}>
      <Icon style={[styles.icon, props.iconStyle]} name={props.iconName}/>
    </View>
  )
}

ListRowSwipeoutButton.propTypes = {
  iconName: React.PropTypes.string.isRequired,
  iconStyle: React.PropTypes.any
}
