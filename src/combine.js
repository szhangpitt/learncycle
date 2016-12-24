import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, p} from '@cycle/dom';

function main() {

    const a$ = xs.periodic(1000).take(3);
    const b$ = xs.periodic(2000);

    const state$ = xs.combine(a$, b$)
    .map(arr => ({
        a: arr[0],
        b: arr[1]
    }));



    const sinks = {
        DOM: state$
        .map(({a, b}) =>
            div([
                p(`a: ${a}`),
                p(`b: ${b}`),
            ])
        )
    }


    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);