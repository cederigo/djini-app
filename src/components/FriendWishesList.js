import { connect } from 'react-redux'
import React, {Component} from 'react'
import { 
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import PureListView from './PureListView'

//types
import {Wish} from '../lib/types'

// actions
import {showWish} from '../actions/wishes'

class FriendWishesList extends Component {

  props: {
    wishes: Array<Wish>
  }
  _innerRef: ?PureListView;

  constructor(props) {
    super(props)

    this._innerRef = null;

    this.renderRow = this.renderRow.bind(this);
    this.storeInnerRef = this.storeInnerRef.bind(this);
  }
  
  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.props.wishes}
        renderRow={this.renderRow}
        renderEmptyList={this.renderEmptyList}
        {...this.props}
      />
    );
  }
  
  renderRow (wish) {
    const {dispatch} = this.props
    return (
      <TouchableHighlight onPress={() => dispatch(showWish(wish))}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {wish.title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
    );
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: 'white',
    padding: 10
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default connect()(FriendWishesList)