import { JsPsych } from 'jspsych';

declare function createTimeline(jsPsych: JsPsych, options?: Partial<CreateTimelineOptions>): any[];
interface CreateTimelineOptions {
    nTrials: number;
    cueOrder: string[];
    cueColors: object;
    cueSigns: object;
}
declare const timelineUnits: {};
declare const utils: {};

export { CreateTimelineOptions, createTimeline, timelineUnits, utils };
