import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import React, {Component} from 'react'
import { 
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

//types
import {Wish} from '../lib/types'

// actions
import {showWish, editWish, deleteWish, saveWish} from '../actions/wishes'

import PureListView from './PureListView'

class MyWishList extends Component {

  props: {
    wishes: Array<Wish>
  }
  _innerRef: ?PureListView;

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.swipeoutBtns = this.swipeoutBtns.bind(this)
  }
  
  render() {
    return (
      <PureListView
        style={styles.container}
        ref={this.storeInnerRef}
        data={this.props.wishes}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        {...this.props}
      />
    );
  }

  swipeoutBtns (wish) {
    //TODO icons instead of text
    const {dispatch} = this.props
    return [
      { 
        text: 'Delete',
        onPress: () => dispatch(deleteWish(wish)),
        type: 'delete'
      },
      {
        text: 'Edit',
        onPress: () => dispatch(editWish(wish))
      },
      {
        text: wish.isFavorite ? 'Not a Fav.' : 'Favorite', 
        onPress: () => dispatch(saveWish(wish.set('isFavorite', !wish.isFavorite)))
      },
      {
        text: wish.isPrivate ? 'Make public' : 'Make private',
        onPress: () => dispatch(saveWish(wish.set('isPrivate', !wish.isPrivate)))
      }
    ]
  }

  renderRow (wish) {
    const {dispatch} = this.props
    return (
      <Swipeout right={this.swipeoutBtns(wish)} autoClose={true}>
        <TouchableHighlight onPress={() => dispatch(showWish(wish))}>
          <View style={styles.row}>
            <Text style={styles.text}>
              {wish.title + (wish.isPrivate ? '(Privat)' : '') + (wish.isFavorite ? '(Fav)' : '')}
            </Text>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  renderEmptyList() {
    return (
      <View style={styles.emptyList}>
        <Text>Du hast noch keine Wünsche erfasst. Erfasse jetzt einen!</Text>
      </View>
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
    backgroundColor: 'white',
    alignSelf: 'stretch'
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#F6F6F6',
    height: 60,
    padding: 10
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginHorizontal: 10,
  },
  sectionHeader: {
    backgroundColor: '#48D1CC',
    paddingLeft: 10
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default connect()(MyWishList)