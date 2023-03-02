function createDate() {
    const date = new Date()
    return `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getDate() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`
}

module.exports = createDate;