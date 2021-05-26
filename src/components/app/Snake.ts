import { Position } from "types/types";

type Direction = "right" | "down" | "left" | "up";

const SPEED = 5; // initial speed value and speed increasing value
const SPEED_CAP = 80;

/**
 * Snake Class.
 */
export class Snake {
    // VARIABLES

    /**
     * Snake's starting position on the grid.
     */
    startingPosition: Position[];

    /**
     * Snake's current position on the grid.
     */
    currentPosition: Position[];

    /**
     * Snake's direction.
     */
    direction: Direction;

    /**
     * Snake's movement speed.
     */
    speed: number;

    // CONSTRUCTORS

    /**
     * Default constructor.
     *
     * Initializes snake's position, length, direction and speed.
     */
    constructor() {
        // Snake's starting length is 1
        //
        // First array element is the snake's tail
        // Last array element is the snake's head
        const startingPosition: Position[] = [
            {
                x: 0,
                y: 0,
            },
        ];

        this.startingPosition = [...startingPosition];
        this.currentPosition = [...startingPosition];
        this.direction = "right";
        this.speed = SPEED;
    }

    // METHODS

    /**
     * Resets snake's necessary properties back to the initial values.
     */
    reset = () => {
        this.currentPosition = [...this.startingPosition];
        this.direction = "right";
        this.speed = SPEED;
    };

    /**
     * Moves snake to the right, removes snake's tail and returns it.
     */
    moveRight = () => {
        this.currentPosition.push({
            x: this.currentPosition[this.currentPosition.length - 1].x + 1,
            y: this.currentPosition[this.currentPosition.length - 1].y,
        });

        return this.currentPosition.shift()!;
    };

    /**
     * Moves snake down, removes snake's tail and returns it.
     */
    moveDown = () => {
        this.currentPosition.push({
            x: this.currentPosition[this.currentPosition.length - 1].x,
            y: this.currentPosition[this.currentPosition.length - 1].y - 1,
        });

        return this.currentPosition.shift()!;
    };

    /**
     * Moves snake to the left, removes snake's tail and returns it.
     */
    moveLeft = () => {
        this.currentPosition.push({
            x: this.currentPosition[this.currentPosition.length - 1].x - 1,
            y: this.currentPosition[this.currentPosition.length - 1].y,
        });

        return this.currentPosition.shift()!;
    };

    /**
     * Moves snake up, removes snake's tail and returns it.
     */
    moveUp = () => {
        this.currentPosition.push({
            x: this.currentPosition[this.currentPosition.length - 1].x,
            y: this.currentPosition[this.currentPosition.length - 1].y + 1,
        });

        return this.currentPosition.shift()!;
    };

    /**
     * Makes snake to grow longer.
     */
    grow = () => {
        let direction: Direction = this.direction; // in which direction snake's end is moving

        if (this.currentPosition.length > 1) {
            // Snake's end
            const tail = this.currentPosition[0];
            const tailNeighbor = this.currentPosition[1];

            // Snake's end moving vertically
            if (tail.x === tailNeighbor.x) {
                // Snake's end moving down
                if (tail.y < tailNeighbor.y) {
                    direction = "down";
                }
                // Snake's end moving up
                else {
                    direction = "up";
                }
            }
            // Snake's end moving horizontally
            else if (tail.y === tailNeighbor.y) {
                // Snake's end moving right
                if (tail.x < tailNeighbor.x) {
                    direction = "right";
                }
                // Snake's end moving left
                else {
                    direction = "left";
                }
            }
        }

        switch (direction) {
            case "down":
                this.currentPosition.unshift({
                    x: this.currentPosition[0].x,
                    y: this.currentPosition[0].y + 1,
                });

                break;
            case "left":
                this.currentPosition.unshift({
                    x: this.currentPosition[0].x + 1,
                    y: this.currentPosition[0].y,
                });

                break;
            case "up":
                this.currentPosition.unshift({
                    x: this.currentPosition[0].x,
                    y: this.currentPosition[0].y - 1,
                });

                break;
            default:
                this.currentPosition.unshift({
                    x: this.currentPosition[0].x - 1,
                    y: this.currentPosition[0].y,
                });
        }
    };

    /**
     * Determines whether snake has reached its speed cap.
     */
    hasReachedSpeedCap = () => {
        return this.speed === SPEED_CAP;
    };

    /**
     * Increases snake's speed based on game's current points.
     * @param currentScore - game's current points
     */
    increaseSpeed = (currentScore: number) => {
        this.speed = SPEED * (currentScore + 1);
    };
}
