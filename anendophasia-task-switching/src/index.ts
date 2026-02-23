import { JsPsych } from "jspsych"
import JsPsychSurveyText from "@jspsych/plugin-survey-text"
import JsPsychInstructions from "@jspsych/plugin-instructions"
import jsPsychHTMLKeyboardResponse from "@jspsych/plugin-html-keyboard-response"

function buildSetVariables(startWith, feedback, n_trials, switching){
    var variables = []

    console.log('beginning of buildSetVariables logs')
    console.log(`args are:\nn_trials is ${n_trials},\nstartWith is ${startWith},\nfeedback is ${feedback},\nswitching is ${switching}`)

    var practice = Array(feedback).fill(null).map(() => {
        return {
            feedback: true,
            number: Math.floor(Math.random() * (96-13))+13,
            operation: startWith
        }
    });

    var test = Array(n_trials).fill(null).map(() => {
        return {
            feedback: false,
            number: Math.floor(Math.random() * (96-13))+13,
            operation: startWith
        }
    });

    var cueBlock = practice.concat(test);

    if (switching == true) {
        for (var j = 1; j < cueBlock.length; j++) {
            const lastOperation = cueBlock[j - 1].operation;
            cueBlock[j].operation = lastOperation === 'addition' ? 'subtraction' : 'addition';
        }
    }

    variables = variables.concat(cueBlock)

    return variables
}

function buildSet(jsPsych, setOptions, cue, starting_operation, cueInfo, instructOptions){ // add argument for a demo section?

    const trial = {
        type: JsPsychSurveyText,
        questions: () => [{
            prompt:`
            <div style="font-size:60px; padding:50px; ${
                jsPsych.evaluateTimelineVariable('cue') === 'color' ? 
                jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                `color:${cueInfo.cueColors['add']}` : `color:${cueInfo.cueColors['sub']}` : '' }">
                ${jsPsych.evaluateTimelineVariable('number')}
                ${jsPsych.evaluateTimelineVariable('cue') === 'sign' ? 
                    jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                    cueInfo.cueSigns['add'] : cueInfo.cueSigns['sub'] : ''}
            </div>`,
            columns: 2, 
            required: true, 
            name:'question',
        }],
        button_label: "Enter",
        data: {
            correct_response: function(){
                console.log('operation for this trial is ' + jsPsych.evaluateTimelineVariable('operation'))
                const correctResponse = jsPsych.evaluateTimelineVariable('operation') === 'addition' ? 
                    jsPsych.evaluateTimelineVariable('number') + 3 : 
                    jsPsych.evaluateTimelineVariable('number') - 3;
                return correctResponse
            },
        },
        on_finish: function(data) {
            data.correct = data.response.question === data.correct_response;
        }
    }

    const feedback = {
        timeline: [{
            type: jsPsychHTMLKeyboardResponse,
            stimulus: function(){
                const lastTrialData = jsPsych.data.get().last(1).values()[0];
                if (lastTrialData.correct){
                    return '<div style="font-size:40px; color:green; padding:50px;">Correct!</div>';
                } else {
                    return `<div style="font-size:40px; color:red; padding:50px;">Incorrect. The correct answer was ${lastTrialData.correct_response}.</div>`;
                }
            },
            choices: "NO_KEYS",
            trial_duration: 1000,
        }],
        conditional_function: function(){
            return jsPsych.evaluateTimelineVariable('feedback');
        }
    }

    const instructions = {
        timeline: [{
            type: JsPsychInstructions,
            pages: jsPsych.timelineVariable('text'),
            allow_keys: false,
            data: {experiment:'task_switching'},
            show_clickable_nav: true
        }],
        conditional_function: function(){
            return jsPsych.evaluateTimelineVariable('include') == true;
        }
    }
    
    var trialTimeline = {
        timeline: [trial, feedback]
    }

    var setVars = buildSetVariables(
        starting_operation, 
        setOptions.feedback, 
        setOptions.nTrials, 
        setOptions.switch).map(trial => ({cue: cue, ...trial}))

    console.log('variables for block are ' + JSON.stringify(setVars))

    var setTrials = {
        timeline: [trialTimeline],
        timeline_variables: setVars,
    }

    var set = {
        timeline: [instructions, setTrials],
        timeline_variables: instructOptions,
    }

    return set
}

function fetchInstructions(taskOptions, instructOptions){
    if (taskOptions.switch == false){
        return taskOptions.starting_operation.map(starting_operation => instructOptions.tasks[starting_operation])
    } else {
        return taskOptions.cues.map(cue => instructOptions.tasks['switch_' + cue])
    }
}

function buildInstructions(include, text){
    if (include == true){
        return {
            type: JsPsychInstructions,
            pages: text,
            allow_keys: false,
            data: {experiment:'task_switching'},
            show_clickable_nav: true
        }
    } else {
        return {}
    }
}

// Things to add:
// intro trials for each task
// intro trial for whole timeline
// input evaluation for data object
export function createTimeline(jsPsych:JsPsych,  options: Partial<CreateTimelineOptions> = {}){
    var main_timeline = []

    const defaultOptions = {
        instructions: {
            intro: {
                include: true,
                text: ['This is an experiment investigating how you switch between differen tasks. ' +
                    '<p>You will see some simple addition and subtraction problems (adding or subtraction 3) that you have to solve as quickly as you can. </p>' +
                    '<p>During an addition block, for example, you might see 35 to which you would answer 38 (35 + 3 = 38). <br>If you saw 35 during a subtraction block, you should answer 32 (35 - 3 = 32).</p>' +
                    '<p>Sometimes there will just be problems of the same kind (i.e. only plus or only minus), and sometimes they will switch. You will get more instructions as you go along. '+
                    '<p>Use the number keys on your keyboard to answer the problems.'+
                    '<p>Click the button below to begin.</p>'],
            },
            tasks: {
                addition: {
                    include: true,
                    text: ['<p>During the following block, you should add 3 to every number. First there will be 10 training trials with feedback, then 30 trials without.'],
                },
                subtraction: {
                    include: true,
                    text: ['<p>During the following block, you should subtract 3 to every number. First there will be 10 training trials with feedback, then 30 trials without.'],
                },
                switch_none: {
                    include: true,
                    text: ['<p>During the following block, you should switch between adding and subtracting 3. Start by adding 3 to the first number, then subtract 3 from the second, and so on.'+
                            '<p>There will be no cue indicating whether you have to add or subtract on a given trial, you will have to keep track of that yourself. </p>'+
                            '<p>First there will be 10 training trials with feedback, then 30 trials without.</p>'],
                },
                switch_color: {
                    include: true,
                    text: ['<p>During the following block, you should switch between adding and subtracting 3. Start by adding 3 to the first number, then subtract 3 from the second, and so on.'+
                            '<p>If the number is written in <b style="color:red">red</b> you should add 3, if the number is written in  <b style="color:blue">blue</b> you should subtract 3.'+
                            '<p>First there will be 10 training trials with feedback, then 30 trials without.</p>'],
                },
                switch_sign: {
                    include: true,
                    text: ['<p>During the following block, you should switch between adding and subtracting 3. Start by adding 3 to the first number, then subtract 3 from the second, and so on.'+
                            '<p>If the number is followed by a <b style="font-size:42px;">+</b> you should add 3, if the number followed by a <b style="font-size:42px;">-</b> you should subtract 3.'+
                            '<p>First there will be 10 training trials with feedback, then 30 trials without.</p>'],
                }
            },
        },
        control: {
            switch: false,
            starting_operation: ['addition', 'subtraction'],
            feedback: 5,
            nTrials: 10,
            cues: ['none', 'none'],
        },
        test: {
            switch: true,
            starting_operation: ['addition', 'addition', 'addition'],
            feedback: 5,
            nTrials: 10,
            cues: ['sign', 'color', 'none'],
        },
        cueInfo: {
            cueColors: {add: 'green', sub: 'red'},
            cueSigns: {add: '+', sub: '-'}
        }
    }

    options = {
        ...defaultOptions,
        ...options,
    };

    main_timeline.push(buildInstructions(options.instructions.intro.include, options.instructions.intro.text))

    // still a bug with the way operations are read, based on indexOf cues
    for (const cue of options.control.cues){
        main_timeline.push(buildSet(
            jsPsych, 
            options.control, 
            cue, 
            options.control.starting_operation[options.control.cues.indexOf(cue)], 
            options.cueInfo, 
            fetchInstructions(options.control, options.instructions)))
    }
    for (const cue of options.test.cues){
        main_timeline.push(buildSet(
            jsPsych, 
            options.test, 
            cue, 
            options.test.starting_operation[options.test.cues.indexOf(cue)], 
            options.cueInfo, 
            fetchInstructions(options.test, options.instructions)))
    }

    return main_timeline
}

export interface CreateTimelineOptions {
    instructions: {
        intro: {
            include: boolean,
            text: string[],
        },
        tasks: {
            addition: {
                include: boolean,
                text: string[],
            },
            subtraction: {
                include: boolean,
                text: string[],
            },
            switch_none: {
                include: boolean,
                text: string[],
            },
            switch_color: {
                include: boolean,
                text: string[],
            },
            switch_sign: {
                include: boolean,
                text: string[],
            }
        }
    },
    control: {
        switch: boolean,
        starting_operation: string[],
        feedback: number,
        nTrials: number,
        cues: string[],
    },
    test: {
        switch: boolean, // consider getting rid of switch parameters to keep it clear to the user that control is for not switching
        starting_operation: string[],
        feedback: number,
        nTrials: number,
        cues: string[],
    },
    cueInfo: {
        cueColors: object,
        cueSigns: object
    }
}

export const timelineUnits = {}

export const utils = {}