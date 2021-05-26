import { Boundaries, Position } from "types/types";

/**
 * Class Food.
 */
export class Food {
    // VARIABLES

    /**
     * Food position.
     */
    position: Position | null;

    // CONSTRUCTORS

    /**
     * Default constructor.
     *
     * Initializes food position.
     */
    constructor() {
        this.position = null;
    }

    // METHODS

    /**
     * Generates a random food position.
     * @param boundaries - boundaries where food can be generated
     * @param snakePosition - current snake position
     */
    generatePosition = (boundaries: Boundaries, snakePosition: Position[]) => {
        let isPositionGenerated = false;
        let x = 0;
        let y = 0;

        while (!isPositionGenerated) {
            x = Math.floor(Math.random() * (boundaries.x[1] - boundaries.x[0]) + boundaries.x[0]);
            y = Math.floor(Math.random() * (boundaries.y[1] - boundaries.y[0]) + boundaries.y[0]);

            for (let index = 0; index < snakePosition.length; index++) {
                if (snakePosition[index].x === x && snakePosition[index].y === y) {
                    break;
                } else if (index === snakePosition.length - 1) {
                    isPositionGenerated = true;
                }
            }
        }

        this.position = {
            x,
            y,
        };
    };
}
