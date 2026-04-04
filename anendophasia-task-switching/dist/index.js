import JsPsychSurveyText from '@jspsych/plugin-survey-text';
import JsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychHTMLKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var TrialTemplates = class {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  Test(cueInfo) {
    return {
      type: JsPsychSurveyText,
      questions: () => [{
        prompt: `
                <div style="font-size:60px; padding:50px; ${this.jsPsych.evaluateTimelineVariable("cue") === "color" ? this.jsPsych.evaluateTimelineVariable("operation") == "addition" ? `color:${cueInfo.cueColors["add"]}` : `color:${cueInfo.cueColors["sub"]}` : ""}">
                    ${this.jsPsych.evaluateTimelineVariable("number")}
                    ${this.jsPsych.evaluateTimelineVariable("cue") === "sign" ? this.jsPsych.evaluateTimelineVariable("operation") == "addition" ? cueInfo.cueSigns["add"] : cueInfo.cueSigns["sub"] : ""}
                </div>`,
        columns: 2,
        required: true,
        name: "question"
      }],
      button_label: "Enter",
      data: {
        correct_response: () => {
          console.log("operation for this trial is " + this.jsPsych.evaluateTimelineVariable("operation"));
          const correctResponse = this.jsPsych.evaluateTimelineVariable("operation") === "addition" ? this.jsPsych.evaluateTimelineVariable("number") + 3 : this.jsPsych.evaluateTimelineVariable("number") - 3;
          return correctResponse;
        }
      },
      on_finish: function(data) {
        data.correct = parseInt(data.response.question) === data.correct_response;
      }
    };
  }
  Feedback() {
    return {
      timeline: [{
        type: jsPsychHTMLKeyboardResponse,
        stimulus: () => {
          const lastTrialData = this.jsPsych.data.get().last(1).values()[0];
          if (lastTrialData.correct) {
            return '<div style="font-size:40px; color:green; padding:50px;">Correct!</div>';
          } else {
            return `<div style="font-size:40px; color:red; padding:50px;">Incorrect. The correct answer was ${lastTrialData.correct_response}.</div>`;
          }
        },
        choices: "NO_KEYS",
        trial_duration: 1e3
      }]
    };
  }
  Instructions() {
    return {
      timeline: [{
        type: JsPsychInstructions,
        pages: this.jsPsych.timelineVariable("text"),
        allow_keys: false,
        data: { experiment: "task_switching" },
        show_clickable_nav: true
      }],
      conditional_function: () => {
        return this.jsPsych.evaluateTimelineVariable("include") == true;
      }
    };
  }
};
function buildSetVariables(startWith, n_trials, switching) {
  console.log("beginning of buildSetVariables logs");
  console.log(`args are:
n_trials is ${n_trials},
startWith is ${startWith},
switching is ${switching}`);
  var variables = Array(n_trials).fill(null).map(() => {
    return {
      number: Math.floor(Math.random() * (96 - 13)) + 13,
      operation: startWith
    };
  });
  if (switching == true) {
    for (var j = 1; j < variables.length; j++) {
      const lastOperation = variables[j - 1].operation;
      variables[j].operation = lastOperation === "addition" ? "subtraction" : "addition";
    }
  }
  console.log("end of buildSetVariables logs");
  return variables;
}
function buildTestSubtimeline(jsPsych, nTrials, cue, starting_operation, switching, cueInfo, instructOptions) {
  console.log("beginning of buildSet logs");
  console.log(`args are:
        
nTrials is ${nTrials},
        
cue is ${cue},
        
starting_operation is ${starting_operation},
        
switch is ${switching},
        
cueInfo is ${JSON.stringify(cueInfo)}`);
  const trialTemplates = new TrialTemplates(jsPsych);
  const instructVars = [instructOptions.end_feedback];
  console.log("instruct vars are " + JSON.stringify(instructVars));
  var variables = buildSetVariables(
    starting_operation,
    nTrials,
    switching
  ).map((trial) => __spreadValues({ cue }, trial));
  console.log("variables for block are " + JSON.stringify(variables));
  const setTrials = {
    timeline: [trialTemplates.Test(cueInfo)],
    timeline_variables: variables
  };
  var setSubtimeline = {
    timeline: [trialTemplates.Instructions(), setTrials],
    timeline_variables: instructVars
  };
  console.log("end of buildSet logs");
  return setSubtimeline;
}
function buildDemoSubtimeline(jsPsych, nTrials, cue, starting_operation, switching, cueInfo, instructOptions) {
  const trialTemplates = new TrialTemplates(jsPsych);
  var instructVars = [];
  if (switching == false) {
    instructVars = [instructOptions.tasks[starting_operation]];
  } else {
    instructVars = [instructOptions.tasks["switch_" + cue]];
  }
  var variables = buildSetVariables(
    starting_operation,
    nTrials,
    switching
  ).map((trial) => __spreadValues({ cue }, trial));
  const setTrials = {
    timeline: [trialTemplates.Test(cueInfo), trialTemplates.Feedback()],
    timeline_variables: variables
  };
  var setSubtimeline = {
    timeline: [trialTemplates.Instructions(), setTrials],
    timeline_variables: instructVars
  };
  console.log("end of buildSet logs");
  return setSubtimeline;
}
function createTimeline(jsPsych, options = {}) {
  var main_timeline = [];
  const trialTemplates = new TrialTemplates(jsPsych);
  const defaultOptions = {
    // see if this can be factored out of the creatTimeline function and moved elsewhere / incrementalized
    instructions: {
      intro: {
        include: true,
        text: ["This is an experiment investigating how you switch between differen tasks. <p>You will see some simple addition and subtraction problems (adding or subtraction 3) that you have to solve as quickly as you can. </p><p>During an addition block, for example, you might see 35 to which you would answer 38 (35 + 3 = 38). <br>If you saw 35 during a subtraction block, you should answer 32 (35 - 3 = 32).</p><p>Sometimes there will just be problems of the same kind (i.e. only plus or only minus), and sometimes they will switch. You will get more instructions as you go along. <p>Use the number keys on your keyboard to answer the problems.<p>Click the button below to begin.</p>"]
      },
      tasks: {
        addition: {
          include: true,
          text: ["<p>During the following block, you should add 3 to every number. First there will be 10 training trials with feedback, then 30 trials without."]
        },
        subtraction: {
          include: true,
          text: ["<p>During the following block, you should subtract 3 to every number. First there will be 10 training trials with feedback, then 30 trials without."]
        },
        switch_none: {
          include: true,
          text: ["<p>During the following block, you should switch between adding and subtracting 3. Start by adding 3 to the first number, then subtract 3 from the second, and so on.<p>There will be no cue indicating whether you have to add or subtract on a given trial, you will have to keep track of that yourself. </p><p>First there will be 10 training trials with feedback, then 30 trials without.</p>"]
        },
        switch_color: {
          include: true,
          text: ['<p>During the following block, you should switch between adding and subtracting 3. Start by adding 3 to the first number, then subtract 3 from the second, and so on.<p>If the number is written in <b style="color:red">red</b> you should add 3, if the number is written in  <b style="color:blue">blue</b> you should subtract 3.<p>First there will be 10 training trials with feedback, then 30 trials without.</p>']
        },
        switch_sign: {
          include: true,
          text: ['<p>During the following block, you should switch between adding and subtracting 3. Start by adding 3 to the first number, then subtract 3 from the second, and so on.<p>If the number is followed by a <b style="font-size:42px;">+</b> you should add 3, if the number followed by a <b style="font-size:42px;">-</b> you should subtract 3.<p>First there will be 10 training trials with feedback, then 30 trials without.</p>']
        }
      },
      end_feedback: {
        include: true,
        text: ["<p>Now the real block begins. You will no longer receive feedback. Solve the problems as quickly as you can.</p>"]
      }
    },
    control: {
      switch: false,
      starting_operation: ["addition", "subtraction"],
      feedback: 5,
      nTrials: 10,
      cues: ["none", "none"]
    },
    test: {
      switch: true,
      starting_operation: ["addition", "addition", "addition"],
      feedback: 5,
      nTrials: 10,
      cues: ["sign", "color", "none"]
    },
    cueInfo: {
      // copy the way Cherrie set out a separate StimulusInfo Object for hearts-and-flowers
      cueColors: { add: "green", sub: "red" },
      cueSigns: { add: "+", sub: "-" }
    }
  };
  options = __spreadValues(__spreadValues({}, defaultOptions), options);
  main_timeline.push({
    timeline: [trialTemplates.Instructions()],
    timeline_variables: [options.instructions.intro]
  });
  for (var cueIndex = 0; cueIndex < options.control.cues.length; cueIndex++) {
    main_timeline.push(buildDemoSubtimeline(
      jsPsych,
      options.control.feedback,
      options.control.cues[cueIndex],
      options.control.starting_operation[cueIndex],
      options.control.switch,
      options.cueInfo,
      options.instructions
    ));
    main_timeline.push(buildTestSubtimeline(
      jsPsych,
      options.control.nTrials,
      options.control.cues[cueIndex],
      options.control.starting_operation[cueIndex],
      options.control.switch,
      options.cueInfo,
      options.instructions
    ));
  }
  for (var cueIndex = 0; cueIndex < options.test.cues.length; cueIndex++) {
    main_timeline.push(buildDemoSubtimeline(
      jsPsych,
      options.test.feedback,
      options.test.cues[cueIndex],
      options.test.starting_operation[cueIndex],
      options.test.switch,
      options.cueInfo,
      options.instructions
    ));
    main_timeline.push(buildTestSubtimeline(
      jsPsych,
      options.test.nTrials,
      options.test.cues[cueIndex],
      options.test.starting_operation[cueIndex],
      options.test.switch,
      options.cueInfo,
      options.instructions
    ));
  }
  return main_timeline;
}
var timelineUnits = {};
var utils = {};

export { createTimeline, timelineUnits, utils };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map