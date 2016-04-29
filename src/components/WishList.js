import Immutable from 'immutable';
import React, { 
  StyleSheet,
  Component,
  PropTypes,
  View,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  Text
} from 'react-native';

// actions
import show from '../actions/wishes'
import {Actions} from 'react-native-router-flux'

export default class WishList extends Component {
  constructor(props) {
      super(props)
      const {wishes} = props
      const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })

    this._renderRow = this._renderRow.bind(this)
    
    this.dataSource = ds.cloneWithRows(wishes.toArray())
  }

  render() {
    return (
      <ListView
        ref="listView"
        style={styles.container}
        dataSource={this.dataSource}
        renderRow={this._renderRow}
      />
    )
  }

  _renderRow (wish) {
    const {show} = this.props
    return (
      <TouchableOpacity
        onPress={() => show(wish)}>
        <Text style={styles.text}>
          {wish.get('title')}
        </Text>
       </TouchableOpacity>
    );
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  sectionHeaderText: {
    fontSize: 16,
    color: 'white',
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  actions: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

WishList.propTypes = {
  wishes: PropTypes.instanceOf(Immutable.List).isRequired,
  show: PropTypes.func.isRequired
}