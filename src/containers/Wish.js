import { connect } from 'react-redux';
import Immutable from 'immutable';

// components
import React, {
   Component,
   PropTypes,
   View,
   StyleSheet,
   StatusBar
} from 'react-native';
import EditWishForm from '../components/wish/EditWishForm'
import ShowWishForm from '../components/wish/ShowWishForm'
import NavBar from '../components/NavBar'

//Actions
import {Actions} from 'react-native-router-flux';

class Wish extends Component {

  render() {
    const {wishState, globalState, dispatch} = this.props
    
    let WishForm
    if (wishState.editMode) {
      WishForm = <EditWishForm styles={styles}/>
    } else {
      WishForm = <ShowWishForm styles={styles}/>
    }
    
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <NavBar/>
        {WishForm}
      </View>
    )
  }
}

Wish.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  globalState: PropTypes.instanceOf(Immutable.Record).isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  }
});

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishState: state.wish,
    globalState: state.global
  };
}

export default connect(select)(Wish)