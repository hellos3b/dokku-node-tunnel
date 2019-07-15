import chalk from "chalk"

function log(...args) {
    const timestamp = chalk.grey(new Date().toTimeString())
    if (args.length) {
        console.log(timestamp, ...args)
    }
}

log.error = function(...args) {
    console.log(chalk.grey(new Date().toTimeString()), chalk.red(...args))
}

export default log