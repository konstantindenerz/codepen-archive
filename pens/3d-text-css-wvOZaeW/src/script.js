import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";

const config = {
    warped: true,
    content: '♛'
}
// https://tweakpane.github.io/docs/quick-tour/
const pane = new Pane({title: "Config", expanded: false})
const contents = {
    "Crown ♛": '♛',
    "Heart ❤": '❤',
    "Peace ☮": '☮︎',
    "Atom ︎︎︎⚛": '⚛︎',
    "Sun ☀": '☀',
    '42': '42',
    '404': '404',
};
const content = pane.addBinding(config, 'content', {options: contents});
const update = (value) => document.documentElement.style.setProperty('--content', `"${value}"`);
content.on('change', ({value}) => {
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            update(value);
        })
    } else {
        update(value);
    }
})

const warped = pane.addBinding(config, 'warped');
warped.on('change', ({value}) => document.documentElement.style.setProperty('--perspective', value ? '1000px' : '20000px'));
