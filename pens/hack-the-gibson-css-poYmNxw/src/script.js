import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";

// https://tweakpane.github.io/docs/quick-tour/
const pane = new Pane({title: "Debug", expanded: false});

const config = {
    global: {
        colorPrimary: '#58C6A2',
        colorSecondary: '#ee75d2',
        colorSurface: '#000000',
    },
    scene: {
        perspective: 50,
        speed: 220,
        play: true,
        rotateX: -24,
        rotateY: 0,
        rotateZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        axesWidth: 0.125,
        axes: false,
        xAxe: '#deee75',
        yAxe: '#9375ee',
        zAxe: '#ee75ec',
    },
    floor: {
        rotateX: 90,
        translateY: 0,
        gap: 0.455,
        spotlight: 42,
        size: 4
    },
    tower: {
        height: 10,
        width: 4,
        gap: 7.6250
    }
}

const prop = (name, value) => {
    document.documentElement.style.setProperty(`--${name}`, value);
}

const global = pane.addFolder({title: 'Global', expanded: false});
global.addBinding(config.global, 'colorPrimary').on('change', ({value}) => prop('color-primary', value));
global.addBinding(config.global, 'colorSecondary').on('change', ({value}) => prop('color-secondary', value));
global.addBinding(config.global, 'colorSurface').on('change', ({value}) => prop('color-surface', value));
const scene = pane.addFolder({title: 'Scene', expanded: false});

scene.addBinding(config.scene, 'play')
    .on('change', ({value}) => prop('scene-animation-duration', value ? `${config.scene.speed}s` : '0'));
scene.addBinding(config.scene, 'perspective', {min: 0, max: 75, step: 0.0625})
    .on('change', ({value, target}) => prop(target.key, `${value}rem`));
scene.addBinding(config.scene, 'speed', {min: 0, max: 240, step: 1})
    .on('change', ({value}) => prop('scene-animation-duration', config.scene.play ? `${value}s` : '0'));
scene.addBinding(config.scene, 'rotateX', {min: -360, max: 360, step: .01})
    .on('change', ({value}) => prop('scene-rotate-x', `${value}deg`));
scene.addBinding(config.scene, 'rotateY', {min: -360, max: 360, step: .01})
    .on('change', ({value}) => prop('scene-rotate-y', `${value}deg`));
scene.addBinding(config.scene, 'rotateZ', {min: -360, max: 360, step: .01})
    .on('change', ({value}) => prop('scene-rotate-z', `${value}deg`));

scene.addBinding(config.scene, 'translateX', {min: -100, max: 100, step: .0625})
    .on('change', ({value}) => prop('scene-translate-x', `${value}rem`));
scene.addBinding(config.scene, 'translateY', {min: -100, max: 100, step: .0625})
    .on('change', ({value}) => prop('scene-translate-y', `${value}rem`));
scene.addBinding(config.scene, 'translateZ', {min: -100, max: 100, step: .0625})
    .on('change', ({value}) => prop('scene-translate-z', `${value}rem`));


scene.addBinding(config.scene, 'axesWidth', {min: 0, max: .625, step: .0625})
    .on('change', ({value}) => prop('axes-width', `${value}rem`));
scene.addBinding(config.scene, 'xAxe').on('change', ({value}) => prop('color-axes-x', config.scene.axes ? value : 'transparent'));
scene.addBinding(config.scene, 'yAxe').on('change', ({value}) => prop('color-axes-y', config.scene.axes ? value : 'transparent'));
scene.addBinding(config.scene, 'zAxe').on('change', ({value}) => prop('color-axes-z', config.scene.axes ? value : 'transparent'));

scene.addBinding(config.scene, 'axes')
    .on('change', ({value}) => {
        prop('color-axes-x', value ? config.scene.xAxe : 'transparent');
        prop('color-axes-y', value ? config.scene.yAxe : 'transparent');
        prop('color-axes-z', value ? config.scene.zAxe : 'transparent');
    });

const floor = pane.addFolder({title: 'Floor', expanded: false});

// floor
floor.addBinding(config.floor, 'rotateX', {min: -360, max: 360, step: 1})
    .on('change', ({value}) => prop('floor-rotate-x', `${value}deg`));
floor.addBinding(config.floor, 'translateY', {min: -20, max: 20, step: .5})
    .on('change', ({value}) => prop('floor-translate-y', `${value}rem`));
floor.addBinding(config.floor, 'gap', {min: 0, max: 20, step: .065})
    .on('change', ({value}) => prop('floor-tile-size', `${value}rem`));
floor.addBinding(config.floor, 'spotlight', {min: 0, max: 100, step: 1})
    .on('change', ({value}) => prop('floor-spotlight', `${value}%`));
floor.addBinding(config.floor, 'size', {min: -100, max: 100, step: 1})
    .on('change', ({value}) => prop('floor-size', `-${value}rem`));

// tower
const tower = pane.addFolder({title: 'Tower', expanded: false});
tower.addBinding(config.tower, 'height', {min: 0, max: 50, step: .0625})
    .on('change', ({value}) => prop('tower-height', `${value}rem`));
tower.addBinding(config.tower, 'width', {min: 0, max: 50, step: .0625})
    .on('change', ({value}) => prop('tower-width', `${value}rem`));
tower.addBinding(config.tower, 'gap', {min: 0, max: 50, step: .0625})
    .on('change', ({value}) => prop('tower-gap', `${value}rem`));


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
