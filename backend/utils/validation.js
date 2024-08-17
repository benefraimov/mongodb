// Checks if a text value is non-empty and meets a
// minimum length requirement.
function isValidText(value, minLength = 1) {
    return value && value.trim().length >= minLength;
}

// Checks if an age value is non-empty and meets a
// minimum length requirement.
function isValidAge(value, minLength = 0) {
    return value && value >= minLength;
}

// Validates if a given value can be converted to
// a valid date.
function isValidDate(value) {
    const date = new Date(value);
    return value && date !== 'Invalid Date';
}

// Checks if a URL starts with "http", indicating
// it's a valid image URL.
function isValidImageUrl(value) {
    return value && value.startsWith('http');
}

// Checks if a value contains the "@" symbol,
// indicating it's a valid email address.
function isValidEmail(value) {
    return value && value.includes('@')
}

exports.isValidText = isValidText;
exports.isValidAge = isValidAge;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;