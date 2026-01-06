import { JsPsych } from 'jspsych';

declare function createTimeline(jsPsych: JsPsych, options?: Partial<CreateTimelineOptions>): any[];
interface CreateTimelineOptions {
    factors: any[];
    num_questions: number[];
}
declare const timelineUnits: {};
declare const utils: {};

export { CreateTimelineOptions, createTimeline, timelineUnits, utils };
