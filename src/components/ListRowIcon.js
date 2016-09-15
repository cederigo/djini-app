
import React, {PropTypes} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import * as images from '../../img'
import Icon from 'react-native-vector-icons/MaterialIcons'

const styles = StyleSheet.create({
  container: {
    padding: 3
  },
  icon: {
    color: 'white',
    fontSize: 28
  },
  image: {
    width: 28,
    height: 28
  }
})

export default function ListRowIcon(props) {
  return (
    <View style={styles.container}>
      {props.type === 'icon' ?
        <Icon {...props} style={[styles.icon, props.style]}/>
        : <Image {...props} source={images[props.name]} style={styles.image, props.style}/>
      }
    </View>
  )
}

ListRowIcon.propTypes = {
  style: PropTypes.any,
  type: PropTypes.oneOf(['image', 'icon']).isRequired
}

ListRowIcon.defaultProps = {
  type: 'icon'
}
