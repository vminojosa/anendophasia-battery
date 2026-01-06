import JsPsychSurveyText from '@jspsych/plugin-survey-text';

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
function buildBlockVariables(n_trials, startWith) {
  var timelineVariables = [];
  for (var i = 0; i < n_trials; i++) {
    if (i === 0) {
      var timelineVariable = {};
      timelineVariable.operation = startWith;
    } else {
      var timelineVariable = {};
      timelineVariable.operation = timelineVariables[i - 1].operation === "addition" ? "subtraction" : "addition";
    }
    timelineVariables.push(timelineVariable);
  }
  return timelineVariables;
}
function buildCueVariables(cueOrder) {
  var variables = [];
  for (var i = 0; i < cueOrder.length; i++) {
    variables.push({ cue: cueOrder[i] });
  }
  console.log(variables);
  return variables;
}
function createTimeline(jsPsych, options = {}) {
  var main_timeline = [];
  const defaultOptions = {
    nTrials: 10,
    cueOrder: ["sign", "color", "none"],
    cueColors: { add: "green", sub: "red" },
    cueSigns: { add: "+", sub: "-" }
  };
  options = __spreadValues(__spreadValues({}, defaultOptions), options);
  const trial = {
    type: JsPsychSurveyText,
    questions: () => [{
      prompt: `
            <div style="font-size:60px; padding:50px; ${jsPsych.evaluateTimelineVariable("cue") === "color" ? jsPsych.evaluateTimelineVariable("operation") == "addition" ? `color:${options.cueColors["add"]}` : `color:${options.cueColors["sub"]}` : ""}">
                ${Math.floor(Math.random() * (96 - 13)) + 13}
                ${jsPsych.evaluateTimelineVariable("cue") === "sign" ? jsPsych.evaluateTimelineVariable("operation") == "addition" ? options.cueSigns["add"] : options.cueSigns["sub"] : ""}
            </div>`,
      columns: 2,
      required: true,
      name: "question"
    }],
    button_label: "Enter"
  };
  var control_block = {
    timeline: [trial],
    timeline_variables: [
      { cue: "none" }
    ],
    repetitions: options.nTrials
  };
  var control_blocks = {
    timeline: [control_block],
    timeline_variables: [
      { operation: "addition" },
      { operation: "subtraction" }
    ]
  };
  var switch_block = {
    timeline: [trial],
    timeline_variables: buildBlockVariables(options.nTrials, "addition")
  };
  var switch_blocks = {
    timeline: [switch_block],
    timeline_variables: buildCueVariables(options.cueOrder)
  };
  main_timeline.push(control_blocks, switch_blocks);
  return main_timeline;
}
var timelineUnits = {};
var utils = {};

export { createTimeline, timelineUnits, utils };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map