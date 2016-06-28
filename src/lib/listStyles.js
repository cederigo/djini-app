import WMColors from './WMColors'
import {StyleSheet} from 'react-native'

// styles
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyList: {
    marginTop: 100,
    fontSize: 16,
    lineHeight: 24,
    color: WMColors.darkText,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    backgroundColor: WMColors.white,
    paddingHorizontal: 25
  },
  col: {
    flex: 1,
  },
  rowSeparator: {
    backgroundColor: WMColors.background,
    height: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
    fontSize: 20,
    color: WMColors.lightText,
  },
  rowDescription: {
    fontSize: 14,
    color: WMColors.lightText,
  },
  rowIcon: {
    color: WMColors.lightText,
    opacity: 0.7
  },
  rowButton: {
    marginLeft: 10,
    marginRight: -10,
    width: 50,
    height: 50,
    backgroundColor: WMColors.lightText
  },
  rowButtonIcon: {
    color: 'white'
  },
  swipeout: {
    backgroundColor: WMColors.lightText,
    borderColor: 'white',
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  swipeoutIcon: {
    color: 'white',
  }
})
