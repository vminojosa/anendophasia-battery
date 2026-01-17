import { JsPsych } from "jspsych"
import JsPsychSurveyText from "@jspsych/plugin-survey-text"

function buildBlockVariables(n_trials, startWith, cueOrder){
    var variables = []
    var cue: string

    console.log(cueOrder)
    for (var i=0; i<cueOrder.length; i++){
        cue = cueOrder[i]
        console.log(cue)
        for (var j=0; j<n_trials; j++){
            var variable: any = {}
            if (j===0){
                variable.cue = cue
                variable.operation = startWith
            } else {
                variable.cue = cue
                variable.operation = variables[j-1].operation === 'addition' ? 'subtraction' : 'addition'
            }
            console.log(variable)
            variables.push(variable)
        }
    }

    console.log(variables)
    return variables
}

function buildTest(jsPsych, block, cue){
    const trial = {
        type: JsPsychSurveyText,
        questions: () => [{
            prompt:`
            <div style="font-size:60px; padding:50px; ${
                jsPsych.evaluateTimelineVariable('cue') === 'color' ? 
                jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                `color:${cue.cueColors['add']}` : `color:${cue.cueColors['sub']}` : '' }">
                ${Math.floor(Math.random() * (96-13))+13}
                ${jsPsych.evaluateTimelineVariable('cue') === 'sign' ? 
                    jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                    cue.cueSigns['add'] : cue.cueSigns['sub'] : ''}
            </div>`, 
            columns: 2, 
            required: true, 
            name:'question',
        }],
        button_label: "Enter"
    }

    var switch_block = {
        timeline: [trial],
        timeline_variables: buildBlockVariables(block.nTrials, 'addition', block.cues),
    }

    return switch_block
}

// Things to add:
// intro trials for each task
// intro trial for whole timeline
// input evaluation for data object
export function createTimeline(jsPsych:JsPsych,  options: Partial<CreateTimelineOptions> = {}){
    var main_timeline = []

    const defaultOptions = {
        control: {
            nTrials: 5,
            cues: ['none'],
        },
        test: {
            nTrials: 5,
            cues: ['sign', 'color', 'none'],
        },
        cue: {
            cueColors: {add: 'green', sub: 'red'},
            cueSigns: {add: '+', sub: '-'}
        }
    }

    options = {
        ...defaultOptions,
        ...options,
    };

    main_timeline.push(buildTest(jsPsych, options.control, options.cue))
    main_timeline.push(buildTest(jsPsych, options.test, options.cue))

    return main_timeline
}

export interface CreateTimelineOptions {
    control: {
        nTrials: number,
        cues: string[],
    },
    test: {
        nTrials: number,
        cues: string[],
    },
    cue: {
        cueColors: object,
        cueSigns: object
    }
}

export const timelineUnits = {}

export const utils = {}