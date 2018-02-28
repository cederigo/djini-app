/* global describe, it, expect */
/* @flow */

// jest.mock('react-native-router-flux', () => 'Actions')

import moment from 'moment'
import 'moment/locale/de'

/* Set default locale */
moment.locale('de')

/**
 * Under test
 */
import { formatBirthday } from '../dateUtil'

describe('./lib/dateUtil', () => {
  it('should format the birthday correctly (today)', () => {
    expect(formatBirthday('1984-01-16', moment('2018-01-16'))).toBe('Wird heute 34 Jahre alt')
  })
  it('should format the birthday correctly (not today ;-)', () => {
    expect(formatBirthday('1984-01-16', moment('2018-02-28'))).toBe(
      'Wird am 16. Januar 35 Jahre alt'
    )
  })
})
