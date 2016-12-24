import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, input, div, p} from '@cycle/dom';

function renderWeightSlider (weight) {
    return renderSlider('Weight', weight, 'kg', 'weight', 90, 200);
}

function renderHeightSlider (height) {
    return renderSlider('Height', height, 'cm', 'height', 140, 200);
}

function renderSlider (label, value, unit, className, min, max) {
    return div([
        `${label} ${value}${unit}`,
        input(`.${className}`,
            {attrs: {type: 'range', value: value, min: min, max: max, step: 1}}),
    ])
}

function bmi (w, h) {
    return w / (0.01 * 0.01 * h * h)
}

function getSliderIntent (domSource, selector) {
    return domSource.select(selector).events('input')
        .map(e => e.target.value)
}

function view (state$) {
    return state$.map(state =>
        div([
            renderHeightSlider(state.height),
            renderWeightSlider(state.weight),
            p(`${state.bmi}`)
        ])
    );
}


function model (actions$) {
    const weight$ = actions$.w$.startWith(120);
    const height$ = actions$.h$.startWith(165);

    return xs.combine(height$, weight$).map(([h, w]) =>
        ({
            height: h,
            weight: w,
            bmi: bmi(w, h),
        })
    );
}

function intent (domSource) {
    return {
        h$: getSliderIntent(domSource, '.height'),
        w$: getSliderIntent(domSource, '.weight'),
    }
}

function main (sources) {

    const actions$ = intent(sources.DOM);

    const state$ = model(actions$);

    const vdom$ = view(state$);

    return  {
        DOM: vdom$
    }
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);
