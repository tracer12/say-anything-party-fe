export function EmailValidator(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}