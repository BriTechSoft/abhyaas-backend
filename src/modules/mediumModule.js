/**
 * Implements the GetMedium RPC method.
 */
function GetMedium(call, callback) {
    const medium = call.request;
    console.log(medium)
    callback(null, {
        medium: medium
    });
}

let mediumModule = {
    GetMedium: GetMedium,
}
module.exports = mediumModule;
