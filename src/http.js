import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, h1, button} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function main (sources) {
    const refresh$ = sources.DOM.select('button')
        .events('click')
        .map(ev => Math.ceil(Math.random() * 10))
        .startWith(1)

    const getRandomUser$ = refresh$.map(r => ({
        url: `http://jsonplaceholder.typicode.com/users/${r}`,
        category: 'users',
        method: 'GET',
    }));

    const user$ = sources.HTTP.select('users')
        .flatten()
        .map(res => res.body)
        .startWith(null);

    const vdom$ = user$.map(user =>
        div('.ui', [
            button('.refresh', 'Refresh'),
            !user ? null : div('.user', [
                h1('.user-name', user.name)
            ])
        ])
    );

    const sinks = {
        DOM: vdom$,
        HTTP: getRandomUser$,
    };

    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
};

run(main, drivers);