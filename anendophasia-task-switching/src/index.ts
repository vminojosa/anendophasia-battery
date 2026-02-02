import { JsPsych } from "jspsych"
import JsPsychSurveyText from "@jspsych/plugin-survey-text"
import JsPsychInstructions from "@jspsych/plugin-instructions"
import jsPsychHTMLKeyboardResponse from "@jspsych/plugin-html-keyboard-response"

function buildBlockVariables(n_trials, startWith, feedback, switching){
    var variables = []

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

function buildTest(jsPsych, block, cue, instructOptions){

    const trial = {
        type: JsPsychSurveyText,
        questions: () => [{
            prompt:`
            <div style="font-size:60px; padding:50px; ${
                jsPsych.evaluateTimelineVariable('cue') === 'color' ? 
                jsPsych.evaluateTimelineVariable('operation') == 'addition' ? 
                `color:${cue.cueColors['add']}` : `color:${cue.cueColors['sub']}` : '' }">
                ${jsPsych.evaluateTimelineVariable('number')}
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

    const feedback = {
        type: jsPsychHTMLKeyboardResponse,
        stimulus: function(){
            const lastTrialData = jsPsych.data.get().last(1).values()[0];
            const correctAnswer = jsPsych.evaluateTimelineVariable('operation') === 'addition' ? 
                jsPsych.evaluateTimelineVariable('number') + 3 : 
                jsPsych.evaluateTimelineVariable('number') - 3;
            const participantAnswer = parseInt(lastTrialData.response.question);
            if (participantAnswer === correctAnswer){
                return '<div style="font-size:40px; color:green; padding:50px;">Correct!</div>';
            } else {
                return `<div style="font-size:40px; color:red; padding:50px;">Incorrect. The correct answer was ${correctAnswer}.</div>`;
            }
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
    }

    const instructions = {
            type: JsPsychInstructions,
            pages: jsPsych.timelineVariable('text'),
            allow_keys: false,
            data: {experiment:'task_switching'},
            show_clickable_nav: true
        }

    var if_feedback = {
        timeline: [feedback],
        conditional_function: function(){
            return jsPsych.evaluateTimelineVariable('feedback');
        }
    }

    var if_instructions = {
        timeline: [instructions],
        conditional_function: function(){
            return jsPsych.evaluateTimelineVariable('include') == true;
        }
    }
    
    var trialTimeline = {
        timeline: [trial, if_feedback]
    }

    instructOptions.map(vars => {
        vars.cue = block.cues[instructOptions.indexOf(vars)]
        vars.startWith = block.startWith[instructOptions.indexOf(vars)]
        return vars
    })

    var task = {
        timeline: [trialTimeline],
        timeline_variables: buildBlockVariables(
            block.nTrials, 
            jsPsych.timelineVariable('startWith'),  
            block.feedback,
            block.switch)
        }

    var test = {
        timeline: [if_instructions, task],
        timeline_variables: instructOptions,
    }

    return test
}

function fetchInstructions(taskOptions, instructOptions){
    if (taskOptions.switch == false){
        return taskOptions.startWith.map(startWith => instructOptions.tasks[startWith])
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
            startWith: ['addition', 'subtraction'],
            feedback: 5,
            nTrials: 10,
            cues: ['none', 'none'],
        },
        test: {
            switch: true,
            startWith: ['addition', 'addition', 'addition'],
            feedback: 5,
            nTrials: 10,
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



    main_timeline.push(buildInstructions(options.instructions.intro.include, options.instructions.intro.text)) // reformat feedback as just separate demo timeline
    main_timeline.push(buildTest(jsPsych, options.control, options.cue, fetchInstructions(options.control, options.instructions)))
    main_timeline.push(buildTest(jsPsych, options.test, options.cue, fetchInstructions(options.test, options.instructions)))

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
        startWith: string[],
        feedback: number,
        nTrials: number,
        cues: string[],
    },
    test: {
        switch: boolean,
        startWith: string[],
        feedback: number,
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