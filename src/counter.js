import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, button, label} from '@cycle/dom';

function main (sources) {

    const in$ = sources.DOM.select('.in').events('click').mapTo(+1);
    const de$ = sources.DOM.select('.de').events('click').mapTo(-1);

    const num$ = xs.merge(in$, de$).fold((c, x) => c + x, 0);

    const sinks = {
        DOM: num$.map(num =>
            div([
                button('.in', '+'),
                button('.de', '-'),
                label(`Value ${num}`),
            ])
        )
    };

    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);