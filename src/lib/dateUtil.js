import moment from 'moment'

export function formatDate(m) {
  return m.format('YYYY-MM-DD')
}

export function parseDate(dateString) {
  return moment(dateString, 'YYYY-MM-DD', true)
}

export function formatBirthday(birthday, now = moment()) {
  const birthdayDate = parseDate(birthday)
  const age = now.diff(birthdayDate, 'years')
  if (birthdayDate.year(now.year()).isSame(now, 'day')) {
    return `Wird heute ${age} Jahre alt`
  } else {
    return `Wird am ${birthdayDate.format('Do MMMM')} ${age + 1} Jahre alt`
  }
}
