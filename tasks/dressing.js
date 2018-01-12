/*
 Check Maybe and Maybe.prototype for any Fantasy Land methods we can
 alias. Statically alias them in the file (if they don't exist).

 We used to do this automatically at load time
 (see ../src/helpers/fantasy-land-aliases), but this seems more efficient
 and gets us out of the trouble of having to include fantasy-land in the library.
 */
import fl from 'fantasy-land'
import Maybe from '../src/maybe'
import fs from 'fs'
import path from 'path'
import {promisify} from 'util'

const read = promisify(fs.readFile)

const dress = (type, name) => {
    const methods = [];

    Object.keys(type).map(method => {
        if(
            typeof type[method] === 'function'
            && Object.prototype.hasOwnProperty.call(fl, method)
            && !Object.prototype.hasOwnProperty.call(type, fl[method])
        ) {
            methods.push(`${name}['${fl[method]}'] = ${name}['${method}']`)
        }
    })
    Object.keys(type.prototype).map(method => {
        if(
            typeof type.prototype[method] === 'function'
            && Object.prototype.hasOwnProperty.call(fl, method)
            && !Object.prototype.hasOwnProperty.call(type.prototype, fl[method])
        ) {
            methods.push(`${name}.prototype['${fl[method]}'] = ${name}.prototype['${method}']`)
        }
    })
    if(methods.length > 0) {
        methods.push(`export default ${name}`)
        const outputFile = path.join(
            __dirname
            , '..'
            , 'src'
            , `${name.toLowerCase()}.js`
        )
        read(outputFile)
            .then(contents => contents.toString())
            .then(contents => contents.replace(`export default ${name}`, methods.join('\n')))
            .then(contents => fs.writeFile(outputFile, contents, err => {if(err) throw err}))
            .catch(err => console.log(err.message))
    }
}

dress(Maybe, `Maybe`)
