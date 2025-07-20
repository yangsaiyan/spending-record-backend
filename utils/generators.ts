export function generateRandomPassword() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return password;
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}