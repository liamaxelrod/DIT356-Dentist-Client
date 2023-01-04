const checkInputs = {}

checkInputs.containsSpecialChars = (string) => {
  const specialChars = '[`!@#$%^&*()_+-=[]{};\':"\\|,.<>/?~]/'
  return specialChars.split('')
    .some((specialChar) => string.includes(specialChar))
}

checkInputs.strinContainsNumbers = (string) => {
  const specialChars = '1234567890'
  return specialChars.split('')
    .some((specialChar) => string.includes(specialChar))
}

checkInputs.checkStringLength = (string) => {
  if (string.length >= 8 && string.length <= 16) {
    return true
  } else {
    return false
  }
}

checkInputs.checkSameString = (input1, input2) => {
  if (input1 === input2) {
    return true
  } else {
    return false
  }
}

checkInputs.checkEmail = (string) => {
  const condition = string.includes('@')
  if (condition) {
    return true
  } else {
    return false
  }
}

checkInputs.makeRandomId = (n) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < n; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export default checkInputs
