/* @flow */

import {Record} from 'immutable';
import type {Note} from '../../lib/types'

export const note:Note = {
  id: undefined,
  title: '',
  comment: '',
  type: 'reminder',
  done: false,
  dueDate: '',
  wish: undefined,
  contact: undefined
}

export default Record(note)
