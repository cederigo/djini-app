import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Actions} from 'react-native-router-flux'
import Immutable from 'immutable';
import React, {
  Component, ListView,
  View, Text, TouchableOpacity,
  PropTypes, StatusBar,
  StyleSheet
} from 'react-native';

import {getUserWishes} from '../actions/wishes'
import WishList from '../components/WishList'
import AddWishButton from '../components/AddWishButton'
import LogoutButton from '../components/LogoutButton'

/* Parse */
import Parse from '../lib/Parse'

class Wishes extends Component {
  
  componentDidMount() {
    this.props.dispatch(getUserWishes())
  }
  
  render() {
    let wishList
    console.log(this.props)
    if (this.props.wishesState.isFetching) {
      wishList = <Text>Wünsche werden geladen</Text>
    } else {
      if (this.props.wishesState.wishes.size > 0) {
        wishList = <WishList wishes={this.props.wishesState.wishes}/>
      } else {
        console.log(this.props.wishesState.error)
        if (this.props.wishesState.error !== null) {
          wishList = <View><Text>Du hast keine Wünsche!</Text>
          <Text>(Aber beim Laden gab's einen Fehler)</Text></View>
        } else {
          wishList = <Text>Du hast keine Wünsche!</Text>
        }
      }
    }
    return (
      <View style={styles.container}>
        <Text>Willkommen</Text>
        <LogoutButton/>
        <AddWishButton/>
        {wishList}    
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 15
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})

Wishes.propTypes = {
  wishesState: PropTypes.instanceOf(Immutable.Record).isRequired
}

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishesState: state.wishes
  };
}

export default connect(select)(Wishes)
