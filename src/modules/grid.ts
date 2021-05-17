import { COLS, ROWS } from "constants/constants";

import { Grid } from "types/types";

/**
 *
 */
export const initializeGrid = (): Grid[][] => {
    const grid: Grid[][] = [];

    // Expand to have the correct amount of rows
    for (let row = 0; row < ROWS; row++) {
        grid.push([]);
    }

    // Expand all rows to have the correct amount of columns
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            grid[row].push("B");
        }
    }

    return grid;
};
