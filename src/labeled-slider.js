import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, input, label, div, span} from '@cycle/dom';

function main (sources) {
    const domSource = sources.DOM;
    const props$ = sources.props;

    const newValue$ = domSource
        .select('.slider')
        .events('input')
        .map(ev => ev.target.value);

    const state$ = props$
        .map(props => newValue$
            .map(val => ({
                label: props.label,
                unit: props.unit,
                min: props.min,
                max: props.max,
                value: val,
                })
            )
            .startWith(props)
        )
        .flatten()
        .remember();

    const vdom$ = state$
    .map(state =>
        div('.labeled-slider', [
            span('.label',
                state.label + ' ' + state.value + state.unit
            ),
            input('.slider', {
                attrs: {type: 'range', min: state.min, max: state.max, value: state.value}
            })
        ])
    );

    const sinks = {
        DOM: vdom$,
        value: state$.map(state => state.value)
    };

    return sinks;
}

const drivers = {
    props: () => xs.of({
        label: 'Weight', unit: 'kg', min: 40, max: 140, value: 70
    }),
    DOM: makeDOMDriver('#app'),
};

run(main, drivers);
