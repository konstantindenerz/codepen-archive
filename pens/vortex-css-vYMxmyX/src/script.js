import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";

// https://tweakpane.github.io/docs/quick-tour/
const pane = new Pane({title: "Config", expanded: false})

const config = {
    global: {
        colorPrimary: '#75d8ee',
        colorSecondary: 'white',
        colorSurface: 'black',
    },
    scene: {
        perspective: 50,
    },
    shape: {
        width: 8,
        height: 8,
        "line-width": .4,
        blur: 0,
        "border-radius": 1.5,
        color: .4,
        "z-offset": 9.6,
    },
    animation: {
        play: true,
        duration: 10,
        "rotation-delay-offset": .1
    }
}

const prop = (name, value) => {
    document.documentElement.style.setProperty(`--${name}`, value);
}

const global = pane.addFolder({title: 'Global', expanded: true});
global.addBinding(config.global, 'colorPrimary').on('change', ({value}) => prop('color-primary', value));
global.addBinding(config.global, 'colorSecondary').on('change', ({value}) => prop('color-secondary', value));
global.addBinding(config.global, 'colorSurface').on('change', ({value}) => prop('color-surface', value));
const shape = pane.addFolder({title: 'Shape', expanded: true});
["width", "height"].forEach(name => {
    shape.addBinding(config.shape, name, {min: 0, max: 100, step: 0.0625})
        .on('change', ({value}) => prop(name, value ? `${config.shape[name]}vmin` : '0'));
});
["line-width"].forEach(name => {
    shape.addBinding(config.shape, name, {min: 0, max: 2, step: 0.00625})
        .on('change', ({value}) => prop(name, value ? `${config.shape[name]}rem` : '0'));
});

["blur"].forEach(name => {
    shape.addBinding(config.shape, name, {min: 0, max: 4, step: .001})
        .on('change', ({value}) => prop(name, value ? `${config.shape[name]}rem` : '0'));
});

["border-radius"].forEach(name => {
    shape.addBinding(config.shape, name, {min: 0, max: 10, step: 0.0625})
        .on('change', ({value}) => prop(name, value ? `${config.shape[name]}vmin` : '0'));
});

["color"].forEach(name => {
    shape.addBinding(config.shape, name, {min: 0, max: 1, step: 0.01})
        .on('change', ({value}) => prop(name, value ? `${config.shape[name]}` : '0'));
});

["z-offset"].forEach(name => {
    shape.addBinding(config.shape, name, {min: 0, max: 20, step: 1})
        .on('change', ({value}) => prop(name, value ? `${config.shape[name]}px` : '0'));
});

const scene = pane.addFolder({title: 'Scene', expanded: true});
["perspective"].forEach(name => {
    scene.addBinding(config.scene, name, {min: 0, max: 100, step: 0.0625})
        .on('change', ({value}) => prop(name, value ? `${config.scene[name]}rem` : '0'));
});

const animation = pane.addFolder({title: 'Animation', expanded: true});


animation.addBinding(config.animation, 'play')
    .on('change', ({value}) => prop('animation', value ? `unset` : 'foo 0s infinite'));


["duration", "rotation-delay-offset"].forEach(name => {
    animation.addBinding(config.animation, name, {min: 0, max: 30, step: 0.01})
        .on('change', ({value}) => prop(name, value ? `${config.animation[name]}s` : '0'));
});
const reset = animation.addButton({
    title: 'Reset',
});
reset.on('click', () => {
    prop('animation', 'foo 0s infinite');
    setTimeout(() => {
        prop('animation', 'unset');
    },10)
})


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
