import { connect } from 'react-redux';
import React, {
  Component,
  StyleSheet,
  View,
  Alert
} from 'react-native';

import MyWishList from '../components/MyWishList'
//import Loading from '../components/Loading' //TODO: eventually show loading
import NewWishButton from '../components/NewWishButton'
import {Wish} from '../lib/types'

class Wishes extends Component {
  
  props: {
    wishes: Array<Wish>,
    isFetching: bool,
    error: any,
  }
  
  render() {

    const {wishes, isFetching, error} = this.props

    if (error) {
      Alert.alert('Oops', 'Wünsche konnten nicht geladen werden')
    }

    return (
      <View style={styles.container}>
        <NewWishButton/>
        <MyWishList wishes={wishes.toArray()}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: 'white',
  },
})


/**
 * Redux boilerplate
 */
function select(state) {
  const wishesState = state.wishes
  return { 
    wishes: wishesState.wishes,
    isFetching: wishesState.isFetching,
    error: wishesState.error,
  };
}

export default connect(select)(Wishes)
