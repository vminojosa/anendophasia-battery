import { JsPsych } from "jspsych"
import JsPsychSurveyText from "@jspsych/plugin-survey-text"

function buildBlockVariables(n_trials, startWith){
    var timelineVariables = []

    for (var i=0; i<n_trials; i++){
        if (i===0){
            var timelineVariable:any = {}
            timelineVariable.operation = startWith
        } else {
            var timelineVariable:any = {}
            timelineVariable.operation = timelineVariables[i-1].operation === 'addition' ? 'subtraction' : 'addition'
        }
        timelineVariables.push(timelineVariable)
    }
    return timelineVariables
}

function buildCueVariables(cueOrder){
    var variables = []

    for (var i=0; i<cueOrder.length; i++){
        variables.push({ cue:cueOrder[i] })
    }
    
    console.log(variables)
    return variables
}

// Things to add:
// intro trials for each task
// intro trial for whole timeline
// input evaluation for data object
export function createTimeline(jsPsych:JsPsych,  options: Partial<CreateTimelineOptions> = {}){
    var main_timeline = []

    const defaultOptions = {
        nTrials: 10,
        cueOrder: ['sign', 'color', 'none'],
        cueColors: {add: 'green', sub: 'red'},
        cueSigns: {add: '+', sub: '-'}
    }

    options = {
        ...defaultOptions,
        ...options,
    };

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
        timeline_variables: [
            { cue: 'none' },
        ],
        repetitions: options.nTrials
    }

    var control_blocks = {
        timeline: [control_block],
        timeline_variables: [
            { operation: 'addition' },
            { operation: 'subtraction' }
        ]
    }

    var switch_block = {
        timeline: [trial],
        timeline_variables: buildBlockVariables(options.nTrials, 'addition'),
    }

    var switch_blocks = {
        timeline: [switch_block],
        timeline_variables: buildCueVariables(options.cueOrder)
    }

    main_timeline.push(control_blocks, switch_blocks)

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