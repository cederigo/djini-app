
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
  rowText: {
    flex: 1,
    fontSize: 20,
  }
  
})
export default function ListRow(props) {
  return (
    <Swipeout {...props} style={styles.container} right={props.swipeoutBtns} autoClose={true}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={styles.row}>
          <DjiniText style={styles.rowText} numberOfLines={1}>
            {props.title}
          </DjiniText>
          {props.children}
        </View>
      </TouchableOpacity>
    </Swipeout>
  );
}

ListRow.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  swipeoutBtns: PropTypes.array
}
