export const validatePhoneNumber = (phone: string): ValidationResult => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return {
    isValid: phoneRegex.test(phone),
    message: phoneRegex.test(phone) ? '' : 'Please enter a valid 10-digit Indian phone number'
  };
};

export const validatePinCode = (pinCode: string): ValidationResult => {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return {
    isValid: pinCodeRegex.test(pinCode),
    message: pinCodeRegex.test(pinCode) ? '' : 'Please enter a valid 6-digit PIN code'
  };
};