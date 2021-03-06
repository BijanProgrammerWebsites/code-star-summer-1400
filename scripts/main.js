// constants
const MIN_POSITION = -250;
const MAX_POSITION = 250;

const MIN_ROTATION = -20;
const MAX_ROTATION = 20;

const DURATION = 800;
const DELAY = 800;

const SLOW_RATE = 0.1;
const FAST_RATE = 1;

// variables
const animations = [];

// dom
const background = document.querySelector('#background');
const text = document.querySelector('#text');
const svgs = text.querySelectorAll('svg');
const startButton = document.querySelector('#start-button');
const footer = document.querySelector('footer');

// flags
let slowMotion = false;
let startAnimationPlaying = false;

// utils
const generateRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const generateRandomPosition = () => {
    return generateRandomInteger(MIN_POSITION, MAX_POSITION);
};

const generateRandomRotation = () => {
    return generateRandomInteger(MIN_ROTATION, MAX_ROTATION);
};

const generateRandomTranslate = () => {
    return `translate(${generateRandomPosition()}px, ${generateRandomPosition()}px)`;
};

const generateRandomRotate = () => {
    return `rotate(${generateRandomRotation()}deg)`;
};

// keyframes
const backgroundKeyframes = [
    {offset: 0, opacity: '0'},
    {offset: 1, opacity: '1'},
];

// options
const backgroundAnimationOptions = {
    duration: 500,
    easing: 'ease-in',
    fill: 'forwards',
};

const pieceAnimationOptions = {
    duration: 250,
    easing: 'linear',
    fill: 'forwards',
};

// animators
const flip = () => {
    const data = [];
    svgs.forEach((svg, i) => {
        const pieces = [...svg.querySelectorAll('path, polygon')];
        const delay = DURATION / pieces.length;

        data.push(
            ...pieces.map((piece, j) => ({
                element: piece,
                translate: generateRandomTranslate(),
                rotate: generateRandomRotate(),
                delay: i * DELAY + j * delay,
            }))
        );
    });

    data.forEach((x) => {
        const animation = x.element.animate(
            [
                {
                    opacity: '0',
                    transform: `${x.translate} ${x.rotate}`,
                },
                {opacity: '1', transform: 'translate(0, 0) rotate(0)'},
            ],
            {...pieceAnimationOptions, delay: x.delay + backgroundAnimationOptions.duration}
        );

        if (slowMotion) animation.playbackRate = SLOW_RATE;

        animations.push(animation);
    });
};

// events
const startButtonClickHandler = () => {
    if (startAnimationPlaying) return;

    startAnimationPlaying = true;

    text.style.display = 'flex';
    startButton.style.display = 'none';
    footer.style.display = 'none';

    flip();

    background.animate(backgroundKeyframes, backgroundAnimationOptions);
};

const changeAnimationsPlaybackRate = (mouseDown) => {
    slowMotion = mouseDown;

    const rate = slowMotion ? SLOW_RATE : FAST_RATE;
    animations.forEach((animation) => {
        if (animation.playState === 'running') animation.playbackRate = rate;
    });
};

// main
document.addEventListener('mousedown', () => changeAnimationsPlaybackRate(true));
document.addEventListener('mouseup', () => changeAnimationsPlaybackRate(false));

startButton.addEventListener('click', startButtonClickHandler);
