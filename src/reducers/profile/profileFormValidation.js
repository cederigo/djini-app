export default function profileFormValidation(state) {
  const { fields } = state
  const { name, email } = fields
  const isValidEmail = /.+@.+/.test(email)
  return state.set('isValid', !!(isValidEmail && name))
}
