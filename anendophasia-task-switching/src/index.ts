import { JsPsych } from "jspsych"
import JsPsychSurveyText from "@jspsych/plugin-survey-text"

function buildBlockVariables(n_trials, startWith){
    var variables = []

    for (var i=0; i<n_trials; i++){
        if (i===0){
            var variable:any = {}
            variable.operation = startWith
        } else {
            var variable:any = {}
            variable.operation = variables[i-1].operation === 'addition' ? 'subtraction' : 'addition'
        }
        variables.push(variable)
    }

    console.log(variables)
    return variables
}

function buildCueVariables(cueOrder){
    var variables = []

    for (var i=0; i<cueOrder.length; i++){
        variables.push({ cue:cueOrder[i] })
    }
    
    console.log(variables)
    return variables
}

function buildControl(jsPsych, options){
    const trial = {
        type: JsPsychSurveyText,
        questions: () => [{
            prompt:`
            <div style="font-size:60px; padding:50px; ${
                jsPsych.evaluateTimelineVariable('cue') === 'color' ? 
                jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                `color:${options.cueColors['add']}` : `color:${options.cueColors['sub']}` : '' }">
                ${Math.floor(Math.random() * (96-13))+13}
                ${jsPsych.evaluateTimelineVariable('cue') === 'sign' ? 
                    jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                    options.cueSigns['add'] : options.cueSigns['sub'] : ''}
            </div>`, 
            columns: 2, 
            required: true, 
            name:'question',
        }],
        button_label: "Enter"
    }

    var control_block = {
        timeline: [trial],
        timeline_variables: buildBlockVariables(options.nTrials, 'addition')
    }

    var control_blocks = {
        timeline: [control_block],
        timeline_variables: [
            { cue: 'none'}
        ]
    }

    return control_blocks
}

function buildTest(jsPsych, options){
    const trial = {
        type: JsPsychSurveyText,
        questions: () => [{
            prompt:`
            <div style="font-size:60px; padding:50px; ${
                jsPsych.evaluateTimelineVariable('cue') === 'color' ? 
                jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                `color:${options.cueColors['add']}` : `color:${options.cueColors['sub']}` : '' }">
                ${Math.floor(Math.random() * (96-13))+13}
                ${jsPsych.evaluateTimelineVariable('cue') === 'sign' ? 
                    jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                    options.cueSigns['add'] : options.cueSigns['sub'] : ''}
            </div>`, 
            columns: 2, 
            required: true, 
            name:'question',
        }],
        button_label: "Enter"
    }

    var switch_block = {
        timeline: [trial],
        timeline_variables: buildBlockVariables(options.nTrials, 'addition'),
    }

    var switch_blocks = {
        timeline: [switch_block],
        timeline_variables: buildCueVariables(options.cueOrder)
    }

    return switch_blocks
}

// Things to add:
// intro trials for each task
// intro trial for whole timeline
// input evaluation for data object
export function createTimeline(jsPsych:JsPsych,  options: Partial<CreateTimelineOptions> = {}){
    var main_timeline = []

    const defaultOptions = {
        nTrials: 5,
        cueOrder: ['sign', 'color', 'none'],
        cueColors: {add: 'green', sub: 'red'},
        cueSigns: {add: '+', sub: '-'}
    }

    options = {
        ...defaultOptions,
        ...options,
    };

    main_timeline.push(buildControl(jsPsych, options))
    main_timeline.push(buildTest(jsPsych, options))

    return main_timeline
}

export interface CreateTimelineOptions {
    nTrials: number,
    cueOrder: string[],
    cueColors: object,
    cueSigns: object,
}

export const timelineUnits = {}

export const utils = {}