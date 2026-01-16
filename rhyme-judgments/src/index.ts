import { JsPsych } from "jspsych"
import JsPsychHTMLKeyboardResponse from "@jspsych/plugin-html-keyboard-response"

// General Notes on Development:
// - Scalability was improved by having one large n-squared pairing list, with properties to build parameters on

var stimuli = require('../stimuli.json')

// Global To-Do List:
// - Develop duplicatesAllowed in buildTimelineVariables function
// - Integrate minNameAgreement parameter
// - Set up so I can test rhymeDistribution parameter

function checkOptions(options, phoneticsRhyme, orthographicsRhyme){
    if (options.percentPhonetic + options.percentOrtho > 1) {
        throw new Error(`
The sum of percentPhonetic and percentOrtho cannot exceed 1.
Please adjust these parameters accordingly.
        `)}
    if (phoneticsRhyme.length == 0 && options.percentPhonetic > 0) {
        console.warn(`
Your stimuli.json file does not contain any phonetic rhymes, even though you requested trials with phonetic rhymes.
Please either add stimuli that rhyme phonetically to stimuli.json, or set percentPhonetic to 0 to avoid this warning.
For now, we will make up the difference with non-rhyming trials.
        `)
        options.percentPhonetic = 0 }
    if (orthographicsRhyme.length == 0 && options.percentOrtho > 0 ) {
        console.warn(`
Your stimuli.json file does not contain any orthographic rhymes, even though you requested trials with orthographic rhymes.
Please either add stimuli that rhyme orthographic to stimuli.json, or set percentOrthographic to 0 to avoid this warning.
For now, we will make up the difference with non-rhyming trials.
        `)
        options.percentOrtho = 0 }
    if (options.percentOrtho * options.numTrials > orthographicsRhyme.length) {
        console.warn(`
Your stimuli.json file only contains ${orthographicsRhyme.length} unique orthographic rhymes, but you requested ${options.percentOrtho * options.numTrials} orthographic rhymes.
Please either reduce the number of total trials, or reduce the proportion of trials with orthographic rhymes.
For now, we will make up the difference with duplicates.
        `)}
    if (options.percentPhonetic * options.numTrials > phoneticsRhyme.length) {
        console.warn(`
Your stimuli.json file only contains ${phoneticsRhyme.length} unique phonetic rhymes, but you requested ${options.percentPhonetic * options.numTrials} phonetic rhymes.
Please either reduce the number of total trials, or reduce the proportion of trials with phonetic rhymes.
For now, we will make up the difference with duplicates.
        `)}
    return options
}

// consider refactoring
function buildPairingMap(){ 
// argument is redundant; 
// duplicate trials can be handled in buildTimelineVariables 
// and don't need to be anywhere in the pairingMap
    let pairingMap = [] // maybe this loop can be the start to determining if some endings have no rhymes
    for (let i = 0; i < stimuli.length; i++) {
        for (let j = 0; j < stimuli.length; j++) {
            if (pairingMap.map(item => item.words).includes(`${stimuli[j].word}-${stimuli[i].word}`) || i === j) { 
                continue
            } else {
                pairingMap.push(
                    {
                        words: `${stimuli[i].word}-${stimuli[j].word}`,
                        pairing: [stimuli[i], stimuli[j]],
                        phonetics: [stimuli[i].endingPhonetic, stimuli[j].endingPhonetic],
                        orthographics: [stimuli[i].endingOrthographic, stimuli[j].endingOrthogaphic],
                        html: `<div style='display:flex;align-items:center;justify-content:center;'> 
                            <img src=${stimuli[i].img} style='width:50'></img>
                            <p>+</p>
                            <img src=${stimuli[j].img} style='width:50'></img>
                        </div>`, // problem with the stimuli not appearing side-by-side
                        // set this up so that stimuli are randomized left/right; this might end up refactoring the html in the grabStimuli function
                        rhymePhonetic: (stimuli[i].endingPhonetic === stimuli[j].endingPhonetic) ? true : false,
                        rhymeOrthographic: (stimuli[i].endingOrthographic === stimuli[j].endingOrthographic) ? true : false,
                    }
                )
            }
        }
    }
    console.log(pairingMap)
    return pairingMap   
} // test to see if duplicate combinations or same-word combinations exist in pairingMap

// for buildTimelineVariables:
// - integrate duplicatesAllowed parameter (this may take longer than expected, or come at the end; no clear idea how to set up a duplicates parameter)
// Notes on duplicatesAllowed parameter:
// - it could effect if duplicate phonetic endings are selected
// -- between rhyme classes of end-pairings (i.e., phonetic, orthographic, control)
// -- within a single rhyme class of end-pairings
// -- among versions of a single end-pairing (e.g. "cat-hat" appearing twice)
function buildTimelineVariables(pairingMap, options){
    console.log("building timeline variables")
    var timelineVariables = []

    var phonetics = stimuli.reduce(
        (accumulator, currentValue) => {
            if (!accumulator.map(item => item).includes(currentValue.endingPhonetic)) { //maybe rename endingPhonetics to just phonetic
                accumulator.push(currentValue.endingPhonetic)
            }
            return accumulator;
        },
        []
    )
    if (options.hasOwnProperty('phoneticWeights')) {
        for (let i = 0; i < Object.keys(options.phoneticWeights).length ; i++) {
            const endingWeighted = Object.keys(options.phoneticWeights)[i]
            while (phonetics.filter(ending => ending === endingWeighted).length < options.phoneticWeights[endingWeighted]) {
                phonetics.push(endingWeighted)
            }
        }
    }

    var rhymesPhonetic = pairingMap.filter((item) => item.rhymePhonetic === true && item.rhymeOrthographic === false)
    rhymesPhonetic = rhymesPhonetic.reduce(
        (accumulator, currentValue) => {
            if (!accumulator.map(item => item).includes(currentValue.phonetics[0])) {
                accumulator.push(currentValue.phonetics[0])
            }
            return accumulator;
        },
        []
    )
    if (options.hasOwnProperty('phoneticWeights')) {
        for (let i = 0; i < Object.keys(options.phoneticWeights).length ; i++) {
            const endingWeighted = Object.keys(options.phoneticWeights)[i]
            while (rhymesPhonetic.filter(ending => ending === endingWeighted).length < options.phoneticWeights[endingWeighted]) {
                rhymesPhonetic.push(endingWeighted)
            }
        }
    }
    console.log(`Phonetic rhymes available: ${rhymesPhonetic}`)

    var rhymesOrthographic = pairingMap.filter((item) => item.rhymeOrthographic === true)
    rhymesOrthographic = rhymesOrthographic.reduce(
        (accumulator, currentValue) => {
            if (!accumulator.map(item => item).includes(currentValue.phonetics[0])) {
                accumulator.push(currentValue.phonetics[0])
            }
            return accumulator;
        },
        []
    )
    if (options.hasOwnProperty('phoneticWeights')) {
        for (let i = 0; i < Object.keys(options.phoneticWeights).length ; i++) {
            const endingWeighted = Object.keys(options.phoneticWeights)[i]
            while (rhymesOrthographic.filter(ending => ending === endingWeighted).length < options.phoneticWeights[endingWeighted]) {
                rhymesOrthographic.push(endingWeighted)
            }
        }
    }
    console.log(`Orthographic rhymes available: ${rhymesOrthographic}`)

    options = checkOptions(
        options, 
        rhymesPhonetic, 
        rhymesOrthographic)

    var numPhonetic = options.percentPhonetic * options.numTrials
    var numOrthographic = options.percentOrtho * options.numTrials
    var numControl = options.numTrials - (numPhonetic + numOrthographic)
    console.log(`I want ${numPhonetic} phonetic rhymes and ${numOrthographic} orthographic rhymes`)

    var selectedOrthographics = rhymesOrthographic.sort(() => 0.5 - Math.random()).slice(0, numOrthographic)
    while (selectedOrthographics.length < numOrthographic) {
        numOrthographic = numOrthographic - selectedOrthographics.length
        selectedOrthographics = selectedOrthographics.concat(rhymesOrthographic.sort(() => 0.5 - Math.random()).slice(0, numOrthographic))
    }
    const variablesOrthographic = selectedOrthographics.map(item => ({
        endingPhonetic: item,
        rhymePhonetic: true, // assumes every orthographic rhyme is also a phonetic rhyme
        rhymeOrthographic: true,
    }))

    if (!options.duplicatesAllowed) {
        rhymesPhonetic = rhymesPhonetic.filter(item => !selectedOrthographics.includes(item))
    }
    var selectedPhonetics = rhymesPhonetic.sort(() => 0.5 - Math.random()).slice(0, numPhonetic)
    while (selectedPhonetics.length < numPhonetic) {
        numPhonetic = numPhonetic - selectedPhonetics.length
        selectedPhonetics = selectedPhonetics.concat(rhymesPhonetic.sort(() => 0.5 - Math.random()).slice(0, numPhonetic))
    }
    const variablesPhonetic = selectedPhonetics.map(item => ({
        endingPhonetic: item,
        rhymePhonetic: true,
        rhymeOrthographic: false, // this may not always be true, if the only available phonetic rhymes are also orthographic rhymes
    }))

    if (!options.duplicatesAllowed) {
        phonetics = phonetics.filter(item => !selectedPhonetics.includes(item) && !selectedOrthographics.includes(item))
    }
    var controlSelected = phonetics.sort(() => 0.5 - Math.random()).slice(0, numControl)
    while (controlSelected.length < numControl) {
        numControl = numControl - controlSelected.length
        controlSelected = controlSelected.concat(phonetics.sort(() => 0.5 - Math.random()).slice(0, numControl))
    }
    const variablesControl = controlSelected.map(item => ({
        endingPhonetic: item,
        rhymePhonetic: false,
        rhymeOrthographic: false,
    }))

    timelineVariables = variablesControl.concat(variablesPhonetic, variablesOrthographic)

    console.log(timelineVariables)
    console.log('done')
    return timelineVariables
} 
// tests:
// that the correct number of trials are created
// that the correct number of rhyming vs. non-rhyming items are selected everytime
// that duplicates never appear when not allowed

function buildIntro(jsPsych: JsPsych, options){
    if (options.intro == true){
        const intro = {
            type: JsPsychHTMLKeyboardResponse,
            stimulus: `<h2>Rhyme Judgment Task</h2>
                    ${options.text}`,
        }
        return intro
    } else {
        return {}
    }
}

function buildTrials(jsPsych: JsPsych, pairingMap, variables){
    const trial = {
        type: JsPsychHTMLKeyboardResponse,
        stimulus: () => grabStimuli(
            pairingMap, // refactor this into yet another timeline variable? Of just the relevant pairings?
            jsPsych.evaluateTimelineVariable('endingPhonetic'), 
            jsPsych.evaluateTimelineVariable('rhymePhonetic'),
            jsPsych.evaluateTimelineVariable('rhymeOrthographic')
        ),
        prompt: `<p>Do the names of these items rhyme?</p></br>
                <p>Press F for "Yes" and J for "No"</p>`,
        choices: ['f', 'j'],
    }

    var trial_timeline = {
        timeline: [trial],
        timeline_variables: variables,
        randomize_order: false,
    }

    return trial_timeline
}

function grabStimuli(pairingMap, phonetic, rhymePhonetic, rhymeOrthographic){
    console.log(`Variables are ${phonetic}, ${rhymePhonetic}, ${rhymeOrthographic}`)
    var pairings = pairingMap.filter((item) => item.phonetics.includes(phonetic)) // filter by phonetics first
    console.log(pairings)
    if (rhymePhonetic === true) {
        pairings = pairings.filter((item) => item.rhymePhonetic === true)
        if (rhymeOrthographic === true /* assume proportionOrtho is relative to proportionPhonetic */ ) {
            pairings = pairings.filter((item) => item.rhymeOrthographic === true)
        } else {
            pairings = pairings.filter((item) => item.rhymeOrthographic === false)
        }
    } else {
        pairings = pairings.filter((item) => item.rhymePhonetic === false)
    }
    console.log(pairings)
    const trialStimulus = pairings[Math.floor(Math.random() * pairings.length)]
    console.log(trialStimulus.words)
    return trialStimulus.html
} // test that it doesn't break if there are no rhymes

export function createTimeline(jsPsych:JsPsych, options: Partial<CreateTimelineOptions> = {}){
    var main_timeline = []

    const defaultOptions = {
        introOptions: {
            intro: true,
            text: 'This is an experiment investigating rhyme judgments. ' +
                '<p>You will see two images at a time and have to judge whether the names of the items rhyme or not. </p>' +
                '<p>For example, if you see a picture of a LAMP and a picture of a CAMP, you should respond that they rhyme (press UP arrow). If you see a picture of a BEAR and a picture of a CUP, you should respond that they <b>do not</b> rhyme (press DOWN arrow).</p>' +
                '<p>All the words are short (one syllable). Please make the judgments as quickly and accurately as possible.'+
                '<p>Press UP arrow key if you think they rhyme, press DOWN arrow key if you think they do not rhyme.'+
                '<p>Click the button below to begin.</p>',
        },
        numTrials: 10, // this parameter bugs when percentPhonetic or percentOrtho can't be met by available stimuli
        duplicatesAllowed: false,
        percentPhonetic: 0.5,
        percentOrtho: 0.3,
    }

    options = {
        ...defaultOptions,
        ...options,
    };

    const pairingMap = buildPairingMap()
    let variables = buildTimelineVariables(pairingMap, options)

    main_timeline.push(buildIntro(jsPsych, options.introOptions))
    main_timeline.push(buildTrials(jsPsych, pairingMap, variables))

    return main_timeline
}

export interface CreateTimelineOptions {
    introOptions: {
        intro: boolean,
        text: string,
    },
    numTrials: number,
    duplicatesAllowed: boolean,
    percentPhonetic: number,
    percentOrtho: number,
    phoneticWeights?: object[], // this is just to see if some rhymes get suppressed or boosted
    minNameAgreement?: number,
}

export const timelineUnits = {}

export const utils = {}