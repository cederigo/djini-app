import PropTypes from 'prop-types';
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as images from '../../img'

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
  },
  image: {
    width: 30,
    height: 30 
  }
})

export default function ListRowSwipeoutButton(props) {
  return (
    <View style={styles.container}>
      {props.iconType === 'icon' ?
        <Icon style={[styles.icon, props.iconStyle]} name={props.iconName}/>
        : <Image resizeMode="contain" source={images[props.iconName]} style={[styles.image, props.iconStyle]}/>
      }
    </View>
  )
}

ListRowSwipeoutButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconStyle: PropTypes.any,
  iconType: PropTypes.oneOf(['image', 'icon']).isRequired
}

ListRowSwipeoutButton.defaultProps = {
  iconType: 'icon'
}