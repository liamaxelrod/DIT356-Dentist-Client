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
