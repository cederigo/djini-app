import moment from 'moment'

export function formatDate(m) {
  return m.format('YYYY-MM-DD') 
}

export function parseDate(dateString) {
  return moment(dateString, 'YYYY-MM-DD')
}

export function formatBirthday(birthday) {
  const date = parseDate(birthday)
  let age = moment().diff(date, 'years')
  return `Wird am ${date.format('Do MMMM')} ${age + 1} Jahre alt`
}
