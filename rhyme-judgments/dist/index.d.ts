import { JsPsych } from 'jspsych';

declare function createTimeline(jsPsych: JsPsych, options?: Partial<CreateTimelineOptions>): any[];
interface CreateTimelineOptions {
    numTrials: number;
    duplicatesAllowed: boolean;
    percentPhonetic: number;
    percentOrtho: number;
    phoneticWeights?: object[];
    minNameAgreement?: number;
}
declare const timelineUnits: {};
declare const utils: {};

export { CreateTimelineOptions, createTimeline, timelineUnits, utils };
