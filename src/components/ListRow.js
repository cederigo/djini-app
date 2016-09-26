
import React, {PropTypes} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Swipeout from 'react-native-swipeout'

import DjiniText from './DjiniText'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  row: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingLeft: 25,
    paddingRight: 10
  },
  content: {
    flex: 1,
  },
  tite: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    opacity: 0.8
  }
})
export default function ListRow(props) {
  const {swipeoutBtns, swipeoutRef, ...others} = props
  return (
    <Swipeout {...others} style={styles.container} right={swipeoutBtns} ref={swipeoutRef} autoClose={true}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={styles.row}>
          <View style={styles.content}>
            <DjiniText style={styles.title} numberOfLines={1}>{props.title}</DjiniText>
            {props.description ? <DjiniText style={styles.description} numberOfLines={1}>{props.description}</DjiniText> : undefined }
          </View>
          {props.children}
        </View>
      </TouchableOpacity>
    </Swipeout>
  );
}

ListRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  swipeoutBtns: PropTypes.array,
  swipeoutRef: PropTypes.func,
}
