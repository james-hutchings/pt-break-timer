/*
types.ts
This file contains the type definitions for the application. 
*/

// Type exercise, represents an individual exercise that a user will complete during a PT break.
export type Exercise = {
    id: string;
    name: string;
    type: string;
    area: string;
    bodyPart: string;
    instructions: string;
    durationSeconds: number;
    active: boolean;
};
