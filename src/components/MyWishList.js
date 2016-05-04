import { connect } from 'react-redux';
import React, { 
  StyleSheet,
  Component,
  View,
  ListView,
  TouchableHighlight,
  Text
} from 'react-native';

//types
import {Wish} from '../lib/types'

// actions
import {show} from '../actions/wishes'

class MyWishList extends Component {

  props: {
    wishes: Array<Wish>
  }

  constructor(props) {
    super(props)

    const {wishes} = props
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })

    this._renderRow = this._renderRow.bind(this)

    this.state = {
      dataSource: ds.cloneWithRows(wishes)
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.wishes !== this.props.wishes) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.wishes)
      })
    }
  }

  render() {
    return (
      <ListView
        ref="listView"
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
      />
    )
  }

  _renderRow (wish) {
    const {dispatch} = this.props
    return (
      <TouchableHighlight onPress={() => dispatch(show(wish))}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {wish.title + (wish.private ? '(Privat)' : '')}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
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
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default connect()(MyWishList)