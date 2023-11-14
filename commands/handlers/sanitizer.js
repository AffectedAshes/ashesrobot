// sanitizer.js

function sanitizeInput(input) {
    // Allow specified additional characters, and remove all non-printable, non-alphanumeric, and unwanted characters
    return input.replace(/[^ -~\w@#$%^&*()_+={}[\]:;<>,.?/~\\-ÀàÁáÂâÄäÇçÈèÉéÊêËëÌìÍíÎîÏïÑñÒòÓóÔôÕõÖöŠšÙùÚúÛûÜüÝýŸÿŽž]/g, '').trim();
}

module.exports = {
    sanitizeInput,
};