import moment from 'moment'
export function formatBirthday(birthday) {
  const date = moment(birthday, 'YYYY-MM-DD')
  let age = moment().diff(date, 'years')
  return `Wird am ${date.format('Do MMMM')} ${age + 1} Jahre alt`
}
