import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Actions} from 'react-native-router-flux'
import {Immutable, List} from 'immutable';
import React, {
  Component, ListView,
  View, Text, TouchableOpacity,
  PropTypes, StatusBar,
  StyleSheet
} from 'react-native';

import * as wishesActions from '../reducers/wishes/wishesActions'
import WishList from '../components/WishList'

import wishesInitialState from '../reducers/wishes/wishesInitialState'

/* Parse */
import Parse from '../lib/Parse'

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

class Wishes extends Component {
  
  constructor(props) {
    super(props);
    this.state = new wishesInitialState;
  }
  
  componentDidMount() {
    this.fetchWishes();  
  }
  
  fetchWishes() {
    this.setState({
      isFetching: true
    })
    console.log('fetch wishes')
    let self = this;
    // use getState().global.currentUser.objectId
    new Parse().getObjects('Wish', 'where={"user":{"__type":"Pointer","className":"_User","objectId":"' + 'qf9WmUpTd3' + '"}}')
    .then((response) => {
      console.log('response');
      console.log(response);
      self.setState({
        isFetching: false,
        wishes: List(response)
      });
    }, (error) => {
      console.log(error);
      self.setState({
        isFetching: false,
        error: error
      });
    })
  }
  
  render() {
    let wishList
    if (this.state.isFetching) {
      wishList = <View style={styles.container}><Text>Wünsche werden geladen</Text></View>
    } else {
      if (this.state.wishes.size > 0) {
        console.log(this.state.wishes);
        wishList = <WishList wishes={this.state.wishes}/>
        //wishList = <View style={styles.container}><Text>Viele Wünsche sind geladen! {this.state.wishes.size}</Text></View>
      } else {
        wishList = <View style={styles.container}><Text>Keine Wünsche sind geladen!</Text></View>
      }
    }
    
    return (
      <View style={styles.container}>
        <Text>Willkommen</Text>
        {wishList} 
      </View>
    )
  }
}

Wishes.propTypes = {
  // wishesState: PropTypes.instanceOf(Immutable.Record).isRequired
  actions: PropTypes.object.isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { wishesState: state.wishes};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(wishesActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Wishes)
