export const responseArray = (statusCode: number, message: string, total: number, content?, dateTime?) => {
    return {
        statusCode,
        message,
        total,
        content,
        dateTime: new Date().toISOString()
    }
}