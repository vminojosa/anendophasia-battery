import jsPsychSurveyLikert from '@jspsych/plugin-survey-likert';
import jsPsychHTMLKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// stimuli.json
var require_stimuli = __commonJS({
  "stimuli.json"(exports, module) {
    module.exports = [
      {
        prompt: "I often enjoy the use of mental pictures to reminisce",
        factor: "visual",
        visual: 0.785,
        verbal: 0.06,
        orthographic: 0.101,
        manipulation: 0.086
      },
      {
        prompt: "I can close my eyes and easily picture a scene that I have experienced",
        factor: "visual",
        visual: 0.753,
        verbal: 0.026,
        orthographic: 0.139,
        manipulation: 0.096
      },
      {
        prompt: "My mental images are very vivid and photographic",
        factor: "visual",
        visual: 0.74,
        verbal: 0.178,
        orthographic: 0.23,
        manipulation: 0.018
      },
      {
        prompt: "The old saying \u201CA picture is worth a thousand words\u201D is certainly true for me",
        factor: "visual",
        visual: 0.685,
        verbal: 0.095,
        orthographic: 0.066,
        manipulation: 0.206
      },
      {
        prompt: "When I think about someone I know well, I instantly see their face in my mind",
        factor: "visual",
        visual: 0.68,
        verbal: 0.023,
        orthographic: 0.12,
        manipulation: 0.063
      },
      {
        prompt: "I often use mental images or pictures to help me remember things",
        factor: "visual",
        visual: 0.665,
        verbal: 0.097,
        orthographic: 0.14,
        manipulation: 0.074
      },
      {
        prompt: "My memories are mainly visual in nature",
        factor: "visual",
        visual: 0.638,
        verbal: 0.046,
        orthographic: 1e-3,
        manipulation: 4e-3
      },
      {
        prompt: "When traveling to get to somewhere I tend to think more visually than verbally",
        factor: "visual",
        visual: 0.612,
        verbal: 0.153,
        orthographic: 0.01,
        manipulation: 1e-3
      },
      {
        prompt: "If I talk to myself in my head it is usually accompanied by visual imagery",
        factor: "visual",
        visual: 0.542,
        verbal: 0.077,
        orthographic: 0.332,
        manipulation: 0.166
      },
      {
        prompt: "If I imagine my memories visually they are more often static than moving",
        factor: "visual",
        visual: 0.418,
        verbal: 0.043,
        orthographic: 0.137,
        manipulation: 0.22
      },
      {
        prompt: "If I am walking somewhere by myself, I often have a silent conversation with myself",
        factor: "verbal"
      },
      {
        prompt: "If I am walking somewhere by myself, I frequently think of conversations that I\u2019ve recently had",
        factor: "verbal"
      },
      {
        prompt: "My inner speech helps my imagination",
        factor: "verbal"
      },
      {
        prompt: "I tend to think things through verbally when I am relaxing",
        factor: "verbal"
      },
      {
        prompt: "When thinking about a social problem, I often talk it through in my head",
        factor: "verbal"
      },
      {
        prompt: "I like to give myself some down time to talk through thoughts in my mind",
        factor: "verbal"
      },
      {
        prompt: `I hear words in my "mind's ear" when I think`,
        factor: "verbal"
      },
      {
        prompt: `I hear words in my "mind's ear" when I think`,
        factor: "verbal"
      },
      {
        prompt: "I rarely vocalize thoughts in my mind",
        factor: "verbal"
      },
      {
        prompt: "I often talk to myself internally while watching TV",
        factor: "verbal"
      },
      {
        prompt: "My memories often involve conversations I've had",
        factor: "verbal"
      },
      {
        prompt: `When I read, I tend to hear a voice in my "mind's ear"`,
        factor: "verbal"
      },
      {
        prompt: "When I hear someone talking, I see words written down in my mind",
        factor: "orthographic"
      },
      {
        prompt: `I see words in my "mind's eye" when I think`,
        factor: "orthographic"
      },
      {
        prompt: "When I am introduced to someone for the first time, I imagine what their name would look like when written down",
        factor: "orthographic"
      },
      {
        prompt: "A strategy I use to help me remember written material is imagining what the writing looks like",
        factor: "orthographic"
      },
      {
        prompt: "I hear a running summary of everything I am doing in my head",
        factor: "orthographic"
      },
      {
        prompt: "I rehearse in my mind how someone might respond to a text message before I send it",
        factor: "orthographic"
      },
      {
        prompt: "I can easily imagine and mentally rotate three-dimensional geometric figures",
        factor: "manipulation"
      },
      {
        prompt: "I can easily choose to imagine this sentence in my mind pronounced unnaturally slowly",
        factor: "manipulation"
      },
      {
        prompt: "In school, I had no problems with geometry",
        factor: "manipulation"
      },
      {
        prompt: "It is easy for me to imagine the sensation of licking a brick",
        factor: "manipulation"
      },
      {
        prompt: "I find it difficult to imagine how a three-dimensional geometric figure would exactly look like when rotated",
        factor: "manipulation"
      },
      {
        prompt: "I can easily imagine someone clearly talking, and then imagine the same voice with a heavy cold",
        factor: "manipulation"
      },
      {
        prompt: "I think I have a large vocabulary in my native language compared to others",
        factor: "manipulation"
      },
      {
        prompt: "I can easily imagine the sound of a trumpet getting louder",
        factor: "manipulation"
      }
    ];
  }
});
var stimuli = require_stimuli();
function buildSurvey(factors, n) {
  var survey = [];
  const stimuliFactors = stimuli.reduce((acc, curr) => {
    if (!acc.includes(curr.factor)) {
      acc.push(curr.factor);
    }
    return acc;
  }, []);
  if (!factors.every((factor) => stimuliFactors.includes(factor))) {
    throw new Error("One or more specified factors do not exist in the questionnaire.");
  }
  if (n.reduce((a, b) => a + b, 0) > stimuli.length) {
    throw new Error("The total number of questions requested exceeds the number of available questions.");
  }
  if (n.length == factors.length + 1) {
    var n_nonfactor = n[n.length - 1];
    n = n.slice(0, factors.length);
  } else if (n.length != factors.length) {
    throw new Error("Each value in num_questions must correspond to a factor in factors, with an optional extra value for non-factor questions.");
  }
  for (var i = 0; i < n.length; i++) {
    var factorSelected = stimuli.filter((item) => item.factor == factors[i]);
    if (factorSelected.length < n[i]) {
      console.warn(`Warning: Requested number of questions (${n[i]}) for factor "${factors[i]}" exceeds available questions. Using all available questions.`);
      if (n_nonfactor) {
        n_nonfactor += n[i] - factorSelected.length;
      } else {
        var n_nonfactor = n[i] - factorSelected.length;
      }
    }
    var questionsSelected = factorSelected.sort(() => 0.5 - Math.random()).slice(0, n[i]);
    survey = survey.concat(questionsSelected);
  }
  if (n_nonfactor) {
    var stimuliLeft = stimuli.filter((item) => !survey.map((s) => s.prompt).includes(item.prompt));
    console.log(stimuliLeft);
    survey = survey.concat(stimuliLeft.sort(() => 0.5 - Math.random()).slice(0, n_nonfactor));
  }
  console.log(survey);
  return survey;
}
function createTimeline(jsPsych, options = {}) {
  var main_timeline = [];
  const defaultOptions = {
    factors: ["verbal"],
    num_questions: [10]
  };
  options = __spreadValues(__spreadValues({}, defaultOptions), options);
  var question = {
    type: jsPsychSurveyLikert,
    questions: () => [
      {
        prompt: jsPsych.evaluateTimelineVariable("prompt"),
        labels: [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree"
        ]
      }
    ],
    data: () => {
      return {
        task: jsPsych.evaluateTimelineVariable("factor")
      };
    },
    on_finish: function(data) {
      data.score = data.response.Q0;
    }
  };
  var survey_timeline = {
    timeline: [question],
    timeline_variables: buildSurvey(options.factors, options.num_questions),
    randomize_order: true
  };
  var debrief_block = {
    type: jsPsychHTMLKeyboardResponse,
    stimulus: function() {
      var data = jsPsych.data.get();
      var html = `<p>Your scores are:</p>`;
      for (var factor of options.factors) {
        html += `<p>${factor}: ${data.filter({ task: factor }).select("score").mean().toFixed(2)}</p>`;
      }
      html += `<p>Press any key to complete the experiment. Thank you!</p>`;
      return html;
    }
  };
  main_timeline.push(survey_timeline, debrief_block);
  return main_timeline;
}
var timelineUnits = {};
var utils = {};

export { createTimeline, timelineUnits, utils };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map