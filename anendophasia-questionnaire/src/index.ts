import {JsPsych} from "jspsych";
import jsPsychSurveyLikert from "@jspsych/plugin-survey-likert";
import jsPsychHTMLKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

var stimuli = require('../stimuli.json')

function buildSurvey(factors: any[], n: number[]) {
	var survey = [];

	const stimuliFactors = stimuli.reduce((acc, curr) => {
		if (!acc.includes(curr.factor)) {
			acc.push(curr.factor);
		}
		return acc;
	}, []);

	if (!factors.every(factor => stimuliFactors.includes(factor))) {
		throw new Error("One or more specified factors do not exist in the questionnaire.");
	}
	if (n.reduce((a, b) => a + b, 0) > stimuli.length) {
		throw new Error("The total number of questions requested exceeds the number of available questions.");
	}

	// evaluate relationship between n and factors
	if (n.length == factors.length + 1) {
		var n_nonfactor = n[n.length - 1];
		n = n.slice(0, factors.length);
	} else if (n.length != factors.length) {
		throw new Error("Each value in num_questions must correspond to a factor in factors, with an optional extra value for non-factor questions.");
	}

	// select questions
	for (var i = 0; i < n.length; i++) {
		var factorSelected = stimuli.filter(item => item.factor == factors[i]);
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
		var stimuliLeft = stimuli.filter(item => !survey.map(s => s.prompt).includes(item.prompt));
		console.log(stimuliLeft);
		survey = survey.concat(stimuliLeft.sort(() => 0.5 - Math.random()).slice(0, n_nonfactor));
	}
	console.log(survey)

	return survey;
}

export function createTimeline(jsPsych: JsPsych, options: Partial<CreateTimelineOptions> = {}) {
	var main_timeline = [];

	const defaultOptions = {
        factors: ["verbal"],
		num_questions: [10],
    }

    options = {
        ...defaultOptions,
        ...options,
    };

	var question = {
		type: jsPsychSurveyLikert,
		questions: () =>[
			{
			prompt: jsPsych.evaluateTimelineVariable('prompt'), 
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
				task: jsPsych.evaluateTimelineVariable('factor')
			}
		},
		on_finish: function(data) {
			data.score = data.response.Q0;
		}
	}

	var survey_timeline = {
		timeline: [question],
		timeline_variables: buildSurvey(options.factors, options.num_questions),
		randomize_order: true,
	}

	var debrief_block = {
		type: jsPsychHTMLKeyboardResponse,
		stimulus: function() {

			var data = jsPsych.data.get();

			var html = `<p>Your scores are:</p>`
			for (var factor of options.factors) {
				html += `<p>${factor}: ${data.filter({task: factor}).select('score').mean().toFixed(2)}</p>`
			}
			html += `<p>Press any key to complete the experiment. Thank you!</p>`;

			return html;
		
		}
	};

	main_timeline.push(survey_timeline, debrief_block);

	return main_timeline;
}

export interface CreateTimelineOptions {
    factors: any[],
	num_questions: number[],
}

export const timelineUnits = {};

export const utils = {};
