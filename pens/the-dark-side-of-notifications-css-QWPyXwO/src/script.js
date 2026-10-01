import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";


// https://tweakpane.github.io/docs/quick-tour/
const pane = new Pane({title: "Config", expanded: false})

const config = {
    global: {
        colorPrimary: '#ff3c3c',
        colorSecondary: '#75d8ee',
        colorOnSecondary: '#2a2a2a',
        colorOnSurface: '#a1a1a1',
        colorSurface: '#1d1d1d',
    },
    lightsaber: {
        width: .28,
        length: 5.6,
        rotateX: 0.01,
        rotateY: 0.01,
        rotateZ: 0.01,
        gripgap: 0.7,
        animate: true,
    },
}

const p = (name, value) => {
    document.documentElement.style.setProperty(`--${name}`, value);
}

const global = pane.addFolder({title: 'Global', expanded: true});
global.addBinding(config.global, 'colorPrimary').on('change', ({value}) => p('color-primary', value));
global.addBinding(config.global, 'colorOnSecondary').on('change', ({value}) => p('color-on-secondary', value));
global.addBinding(config.global, 'colorSecondary').on('change', ({value}) => p('color-secondary', value));
global.addBinding(config.global, 'colorOnSurface').on('change', ({value}) => p('color-on-surface', value));
global.addBinding(config.global, 'colorSurface').on('change', ({value}) => p('color-surface', value));

const lightsaber = pane.addFolder({title: 'Lightsaber', expanded: true});
['x', 'y', 'z'].forEach(key => {
    lightsaber.addBinding(config.lightsaber, `rotate${key.toUpperCase()}`, {min: -360, max: 360, step: .01})
        .on('change', ({value}) => p(`lightsaber-rotate-${key}`, value ? `${value}deg` : '0deg'));
});
lightsaber.addBinding(config.lightsaber, 'animate', {min: 0.1, max: 10, step: .1})
    .on('change', ({value}) => p('lightsaber-animation', value ? `main 5s linear infinite` : 'unset'));
lightsaber.addBinding(config.lightsaber, 'width', {min: 0.1, max: 4, step: .1})
    .on('change', ({value}) => p('lightsaber-width', value ? `${value}rem` : '0'));
lightsaber.addBinding(config.lightsaber, 'length', {min: 0.1, max: 10, step: .1})
    .on('change', ({value}) => p('lightsaber-length', value ? `${value}rem` : '0'));
lightsaber.addBinding(config.lightsaber, 'gripgap', {min: 0.1, max: 10, step: .1})
    .on('change', ({value}) => p('lightsaber-gripgap', value ? `${value}rem` : '0'));

// apply values from config
Object.keys(config).forEach(section => {
    Object.keys(config[section]).forEach(key => {
        const value = config[section][key];
        config[section][key] = undefined;
        pane.refresh();
        config[section][key] = value;
    });
});

pane.refresh();
