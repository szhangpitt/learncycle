import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, input, div, p} from '@cycle/dom';

function main (sources) {

    const height$ = sources.DOM.select('.height').events('input')
        .map(e => e.target.value)
        .startWith(165);
    const weight$ = sources.DOM.select('.weight').events('input')
        .map(e => e.target.value)
        .startWith(120);

    const state$ = xs.combine(height$, weight$).map(([h, w]) =>
        ({
            height: h,
            weight: w,
            bmi: w / (0.01*0.01*h*h),
        })
    );

    const sinks = {
        DOM: state$.map(state =>
            div([
                div([
                    'Height',
                    input('.height',
                        {attrs: {type: 'range', min: 140, max: 200, step: 1}}),
                    `${state.height}`
                ]),
                div([
                    'Weight',
                    input('.weight',
                        {attrs: {type: 'range', min: 90, max: 200, step: 1}}),
                    `${state.weight}`
                ]),
                p(`${state.bmi}`)
            ])
        )
    }


    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);
