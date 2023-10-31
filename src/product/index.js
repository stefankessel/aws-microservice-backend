
exports.handler = async (event) => {
    console.log('request: ', JSON.stringify(event, undefined, 2))

    const res = {
        statusCode: 200,
        body : `Hello from Lambda, Path: ${event.path}\n`
    }

    return res
}