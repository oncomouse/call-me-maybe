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

const methods = [];

Object.keys(Maybe).map(method => {

    if(
        typeof Maybe[method] === 'function'
        && Object.prototype.hasOwnProperty.call(fl, method)
        && !Object.prototype.hasOwnProperty.call(Maybe, fl[method])
    ) {
        methods.push(`Maybe['${fl[method]}'] = Maybe['${method}']`)
    }
})
Object.keys(Maybe.prototype).map(method => {
    if(
        typeof Maybe.prototype[method] === 'function'
        && Object.prototype.hasOwnProperty.call(fl, method)
        && !Object.prototype.hasOwnProperty.call(Maybe.prototype, fl[method])
    ) {
        methods.push(`Maybe.prototype['${fl[method]}'] = Maybe.prototype['${method}']`)
    }
})
if(methods.length > 0) {
    methods.push(`export default Maybe`)
    const outputFile = path.join(
        __dirname
        , '..'
        , 'src'
        , 'maybe.js'
    )
    promisify(fs.readFile)(outputFile)
        .then(contents => contents.toString())
        .then(contents => contents.replace('export default Maybe', methods.join('\n')))
        .then(contents => fs.writeFile(outputFile, contents))
        .catch(err => console.log(err.message))
}