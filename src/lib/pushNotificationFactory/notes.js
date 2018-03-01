/**
 * Push notification factory for `notes`
 */

import moment from 'moment'
import { listString, quantityString } from '../stringUtil'
import { parseDate } from '../dateUtil'
import { List } from 'immutable'

function reminderNotifications(notes) {
  const note = notes[0]
  const dueDate = note.dueDate
  const names = notes.map(e => e.contact.name)

  // 14 days before @ 9.00h
  const result = []
  result.push({
    fireDate: parseDate(dueDate)
      .subtract(14, 'days')
      .hours(9)
      .minute(0)
      .valueOf(),
    alertBody: `Denk daran, dass ${listString(names)} in 14 Tagen Geburtstag ${quantityString(
      names.length,
      'hat',
      'haben'
    )}`
  })
  // 7 days before @ 9.00h
  result.push({
    fireDate: parseDate(dueDate)
      .subtract(7, 'days')
      .hours(9)
      .minute(0)
      .valueOf(),
    alertBody: `${listString(names)} ${quantityString(names.length, 'hat', 'haben')} am ${moment(
      dueDate
    ).format('Do MMMM')} Geburtstag. Weißt du schon, was du schenken wirst?`
  })
  // The same day @ 9.00h
  result.push({
    fireDate: parseDate(dueDate)
      .hours(9)
      .minute(0)
      .valueOf(),
    alertBody: `${listString(names)} ${quantityString(
      names.length,
      'hat',
      'haben'
    )} heute Geburtstag. Gratulieren nicht vergessen!`
  })
  return result
}

function taskNotifications(notes) {
  const note = notes[0]
  const result = []
  // 10 days before @ 9.00h
  result.push({
    fireDate: parseDate(note.dueDate)
      .subtract(10, 'days')
      .hours(9)
      .minute(0)
      .valueOf(),
    alertBody: `Denk daran, du musst noch das Geschenk für ${note.contact.name} besorgen`
  })
  // 4 days before @ 9.00h
  result.push({
    fireDate: parseDate(note.dueDate)
      .subtract(4, 'days')
      .hours(9)
      .minute(0)
      .valueOf(),
    alertBody: `Du hast noch 4 Tage um das Geschenk für ${note.contact.name} zu besorgen`
  })
  return result
}

export default function getNotesNotifications(notes) {
  if (!notes || !notes.length) {
    return []
  }

  let result = []
  const groupNote = note => {
    if (note.type === 'task') {
      //dont group them
      return note.id
    } else {
      //group reminders by dueDate
      return note.dueDate
    }
  }

  List(notes)
    .filter(note => note.dueDate && !note.done)
    .groupBy(groupNote)
    .forEach(entries => {
      entries = entries.toJS()
      const type = entries[0].type
      if (type === 'task') {
        result = result.concat(taskNotifications(entries))
      } else if (type === 'reminder') {
        result = result.concat(reminderNotifications(entries))
      }
    })

  return result
}
