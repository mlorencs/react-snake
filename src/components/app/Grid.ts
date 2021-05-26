import { Boundaries, Position } from "types/types";
import { COLS, ROWS } from "constants/constants";

/**
 * Properties:
 *  - X - snake;
 *  - F - food;
 *  - B - blank cell.
 */
type GridValue = "X" | "F" | "B";

type GridType = {
    position: Position;
    value: GridValue;
};

/**
 * Class Grid.
 */
export class Grid {
    // VARIABLES

    /**
     * Grid's boundaries.
     */
    boundaries: Boundaries;

    /**
     * Two dimensional array represented as a grid with each grid having its own position and value.
     */
    values: GridType[][];

    // CONSTRUCTORS

    /**
     * Default constructor.
     */
    constructor() {
        this.boundaries = {
            x: [],
            y: [],
        };

        this.values = [];

        // Expand to have the correct amount of rows
        for (let row = 0; row < ROWS; row++) {
            this.values.push([]);
        }

        // Expand all rows to have the correct amount of columns
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const position: Position = {
                    x: col + 1 - Math.ceil(COLS / 2),
                    y: ROWS - 1 - row + 1 - Math.ceil(ROWS / 2),
                };

                const grid: GridType = {
                    position,
                    value: "B",
                };

                this.values[row].push(grid);
            }
        }

        this.boundaries.x.push(this.values[0][0].position.x);
        this.boundaries.x.push(this.values[0][COLS - 1].position.x);

        this.boundaries.y.push(this.values[ROWS - 1][0].position.y);
        this.boundaries.y.push(this.values[0][0].position.y);
    }
}
