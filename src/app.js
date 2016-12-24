import xs from 'xstream';
import {makeDOMDriver, h1, div, input, p} from '@cycle/dom';
import {run} from '@cycle/xstream-run';

function main (sources) {
    const toggle$ = sources.DOM.select('input[type="checkbox"]').events('click')
        .map(e => e.target.checked)
        .startWith(true);
    const name$ = sources.DOM.select('input[type="text"]').events('keypress')
        .map(e => e.target.value)
        .startWith(null);

    const state$ = xs.combine(toggle$, name$).map(
        arr => ({
            toggled: arr[0],
            name:    arr[1],
        })
    );

    const sinks = {
        DOM: state$.map(state =>
            div([
                input({attrs: {type: 'checkbox', checked: state.toggled}}, 'Toggle Me'),
                p(state.toggled ? 'on': 'off'),
                input({attrs: {type: 'text'}}, 'Name'),
                p(`Hello ${state.name}`),
            ])
        )
    }


    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);
