import { JsPsych } from 'jspsych';

declare function createTimeline(jsPsych: JsPsych, options?: Partial<CreateTimelineOptions>): any[];
interface CreateTimelineOptions {
    instructions: {
        intro: {
            include: boolean;
            text: string[];
        };
        tasks: {
            addition: {
                include: boolean;
                text: string[];
            };
            subtraction: {
                include: boolean;
                text: string[];
            };
            switch_none: {
                include: boolean;
                text: string[];
            };
            switch_color: {
                include: boolean;
                text: string[];
            };
            switch_sign: {
                include: boolean;
                text: string[];
            };
        };
        end_feedback: {
            include: boolean;
            text: string[];
        };
    };
    control: {
        switch: boolean;
        starting_operation: string[];
        feedback: number;
        nTrials: number;
        cues: string[];
    };
    test: {
        switch: boolean;
        starting_operation: string[];
        feedback: number;
        nTrials: number;
        cues: string[];
    };
    cueInfo: {
        cueColors: object;
        cueSigns: object;
    };
}
declare const timelineUnits: {};
declare const utils: {};

export { CreateTimelineOptions, createTimeline, timelineUnits, utils };
