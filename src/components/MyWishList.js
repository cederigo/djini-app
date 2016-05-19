import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import React, {Component} from 'react'
import { 
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import WMColors from '../lib/WMColors'

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

  renderSectionHeader(data, sectionId) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }
  
  render() {
    const data = {
      'Wunschliste': this.props.wishes
    }
    return (
      <PureListView
        style={styles.container}
        ref={this.storeInnerRef}
        data={data}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        renderSectionHeader={this.renderSectionHeader}
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
            <Text style={styles.rowText}>
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
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: WMColors.white,
  },
  rowSeparator: {
    backgroundColor: WMColors.background,
    height: 1,
  },
  rowText: {
    flex: 1,
    fontSize: 18,
    color: WMColors.lightText
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: WMColors.lightText,
  },
  sectionHeaderText: {
    fontSize: 18,
    color: 'white',
    backgroundColor: WMColors.lightText,
  },
})

export default connect()(MyWishList)