// Global type definitions

export type Position = {
    x: number;
    y: number;
};

/**
 * X's array first element is the left boundary
 * and last element is the right boundary.
 *
 * Y's array first element is the bottom boundary
 * and last element is the top boundary.
 */
export type Boundaries = {
    x: number[];
    y: number[];
};
