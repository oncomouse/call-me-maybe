import equals from 'fast-deep-equal'
import nofl from './native-or-fantasy-land'

export default (a, b) => {
    try {
        nofl(b, 'equals')
        return a[nofl(a, 'equals')](b)
    } catch(e) {
        return equals(a, b)
    }
}
