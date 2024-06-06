
function debugLog(message) {
    if (process.env.DEBUG_LOG === 'true') {
        console.log(message);
    }
}

module.exports = {
    debugLog
};
