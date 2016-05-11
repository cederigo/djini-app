
jest.autoMockOff();

const {
  ADD_FAVORITE
} = require('../../../lib/constants')

/**
 * ## Class under test
 */
var contactsReducer = require('../contactsReducer').default

describe('contactsReducer', () => {
  describe('ADD_FAVORITE', () => {

    it('adds one favorite', () => {
      const action = {
        type: ADD_FAVORITE,
        payload: {contact: {phoneNumber: '1', name: 'Fav 1'}}
      };

      let next = contactsReducer(undefined, action)

      expect(next).toBeDefined()
      expect(next.favorites.size).toBe(1)
    });

    it('keeps recently used favorites sorted by name', () => {

      const actions = []
      let next = undefined
      for (let i = 0; i < 12; i++) {
        next = contactsReducer(next, { 
            type: ADD_FAVORITE,
            payload: {
              contact: {phoneNumber: '' + i, name: (10 + i) + 'Fav'},
              accessedAt: i
            }
          });
      }
      expect(next).toBeDefined()
      expect(next.favorites.size).toBe(10)
      expect(next.favorites.has('0')).toBe(false)
      expect(next.favorites.first().name).toBe('12Fav')
    })
  });
});
