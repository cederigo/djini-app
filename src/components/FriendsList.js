import React, { 
  StyleSheet,
  Component,
  PropTypes,
  View,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableHighlight,
  Text
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
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



export default class FriendsList extends Component {
  constructor(props) {
    super(props);
    console.log('FriendsList.constructor()')

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
      sectionHeaderHasChanged: (s1, s2) => s1 != s2
    })

    this._renderRow = this._renderRow.bind(this)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this._getListViewData(this.props.friends, this.props.filterText))
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('FriendsList.componentWillReceiveProps()')
    if (nextProps.filterText !== this.props.filterText) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this._getListViewData(nextProps.friends, nextProps.filterText))
      })
    }
  }

  componentDidMount() {
    console.log('FriendsList.componentDidMount()')
  }

  render() {
    console.log('FriendsList.render()')
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        scrollRenderAheadDistance={1000}
        pageSize={25}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        renderSeparator={this._renderSeparator}
      />
    )

  }

  _showFriend(friend, filterText = '') {
    if (!filterText) {
      return true
    }
    return friend.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0
  }

  _getListViewData(friends, filterText = '') {
    console.log('listview data: ', filterText)
    const friendsList = friends.toList().sortBy(friend => friend.name)
    return {
      'Registered': friendsList.filter(friend => friend.registered && this._showFriend(friend, filterText)).toArray(),
      'Contacts': friendsList.filter(friend => !friend.registered && this._showFriend(friend, filterText)).toArray()
    }
  }

  _renderRow (friend) {
    return (
      <TouchableHighlight onPress={() => this.props.onPress(friend)}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {friend.name}
          </Text>
          {friend.registered ? null : 
            <View style={styles.actions}>
              <Text>Invite</Text>
            </View>
          }
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
    );
  }

  _renderSectionHeader(data, sectionId) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }
}

FriendsList.propTypes = {
  friends: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  filterText: PropTypes.string
}
