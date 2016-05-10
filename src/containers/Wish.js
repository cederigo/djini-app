import { connect } from 'react-redux';
import Immutable from 'immutable';

// components
import React, {
   Platform,
   Component,
   PropTypes,
   View,
   StyleSheet,
   StatusBar,
   Text,
   TouchableOpacity
} from 'react-native';
import EditWishForm from '../components/wish/EditWishForm'
import ShowWishForm from '../components/wish/ShowWishForm'

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
        <View style={styles.navbar}>
          <TouchableOpacity 
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    padding: 15,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500'
  },
  text: {
    paddingTop: 30
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 30
  },
  input: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10
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