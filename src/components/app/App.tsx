import { BLOCK_SIZE, COLS, HEIGHT, ROWS, WIDTH } from "constants/constants";
import React, { Component } from "react";

import { Food } from "./Food";
import { Grid } from "./Grid";
import { Position } from "types/types";
import { Snake } from "./Snake";
import appData from "assets/data/app.json";
import classNames from "classnames";
import styles from "./App.module.scss";

type GameStatus = "idle" | "in-progress" | "game-over";

interface Props {}

interface State {
    /**
     * Game's current points.
     */
    currentScore: number;

    /**
     * Last game's points.
     */
    lastScore: number;

    /**
     * Highest points.
     */
    highestScore: number;

    /**
     * Game status.
     */
    gameStatus: GameStatus;

    /**
     * Determines whether a key is pressed or not.
     *
     * Fixes the issue where by chaning directions
     * too quickly snake can eat itself or turn
     * 180 degrees.
     */
    isKeyPressed: boolean;

    /**
     * Determines whether to do a re-render or not.
     *
     * Used to display recent updates on the grid.
     */
    doRender: boolean;
}

const {
    title,
    highestScoreLabel,
    lastScoreLabel,
    currentScoreLabel,
    startGame,
    inProgress,
    restartGame,
} = appData;

const INITIAL_TICKS = 850;

/**
 * App component renders 2D Snake Game.
 */
class App extends Component<Props, State> {
    /**
     * setTimeout.
     */
    timeoutID = 0;

    /**
     * Timeout interval.
     */
    timeout = INITIAL_TICKS;

    /**
     * Ref for <div> element with className "app".
     */
    appRef;

    /**
     * Grid.
     */
    grid = new Grid();

    /**
     * Snake.
     */
    snake = new Snake();

    /**
     * Food.
     */
    food = new Food();

    constructor(props: Props) {
        super(props);

        this.appRef = React.createRef() as React.MutableRefObject<HTMLDivElement>;

        this.state = {
            currentScore: 0,
            lastScore: 0,
            highestScore: 0,
            gameStatus: "idle",
            isKeyPressed: false,
            doRender: false,
        };
    }

    /**
     * Resets grid and snake's properties.
     */
    reset = () => {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                this.grid.values[row][col].value = "B";
            }
        }

        this.snake.reset();
    };

    /**
     * Renders snake on the grid.
     * @param snakePosition - snake's position on the grid
     */
    renderSnake = (snakePosition: Position[]) => {
        for (let index = 0; index < snakePosition.length; index++) {
            rows: for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    if (
                        snakePosition[index].x === this.grid.values[row][col].position.x &&
                        snakePosition[index].y === this.grid.values[row][col].position.y
                    ) {
                        this.grid.values[row][col].value = "X";

                        break rows;
                    }
                }
            }
        }
    };

    /**
     * Renders food on the grid.
     */
    renderFood = () => {
        if (this.food.position !== null) {
            rows: for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    if (
                        this.food.position.x === this.grid.values[row][col].position.x &&
                        this.food.position.y === this.grid.values[row][col].position.y
                    ) {
                        this.grid.values[row][col].value = "F";

                        break rows;
                    }
                }
            }
        }
    };

    /**
     * Moves snake on the grid.
     * @param snakeTail - snake's tail
     */
    moveSnake = (snakeTail: Position) => {
        rows: for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (
                    snakeTail.x === this.grid.values[row][col].position.x &&
                    snakeTail.y === this.grid.values[row][col].position.y
                ) {
                    this.grid.values[row][col].value = "B";

                    break rows;
                }
            }
        }
    };

    /**
     * Game's main functionality can be found here.
     */
    game = () => {
        let isGameOver = false;
        let { x, y } = this.snake.currentPosition[this.snake.currentPosition.length - 1]; // snake's head

        this.setState({
            isKeyPressed: false,
        });

        // SNAKE'S MOVEMENT SECTION

        switch (this.snake.direction) {
            case "down":
                if (y - 1 >= this.grid.boundaries.y[0]) {
                    const snakeTail = this.snake.moveDown();

                    this.moveSnake(snakeTail);
                } else {
                    isGameOver = true;
                }

                break;
            case "left":
                if (x - 1 >= this.grid.boundaries.x[0]) {
                    const snakeTail = this.snake.moveLeft();

                    this.moveSnake(snakeTail);
                } else {
                    isGameOver = true;
                }

                break;
            case "up":
                if (y + 1 <= this.grid.boundaries.y[1]) {
                    const snakeTail = this.snake.moveUp();

                    this.moveSnake(snakeTail);
                } else {
                    isGameOver = true;
                }

                break;
            default:
                if (x + 1 <= this.grid.boundaries.x[1]) {
                    const snakeTail = this.snake.moveRight();

                    this.moveSnake(snakeTail);
                } else {
                    isGameOver = true;
                }
        }

        ({ x, y } = this.snake.currentPosition[this.snake.currentPosition.length - 1]);

        // Check if snake has not eaten itself
        //
        // Works correctly, but appears buggy
        for (let index = 0; index < this.snake.currentPosition.length - 1; index++) {
            if (
                x === this.snake.currentPosition[index].x &&
                y === this.snake.currentPosition[index].y
            ) {
                isGameOver = true;

                break;
            }
        }

        if (!isGameOver) {
            this.renderSnake(this.snake.currentPosition);

            if (this.food.position !== null) {
                if (this.food.position.x === x && this.food.position.y === y) {
                    // SNAKE EATS SECTION

                    this.setState(
                        (prevState) => ({
                            currentScore: prevState.currentScore + 1,
                        }),
                        () => {
                            if (!this.snake.hasReachedSpeedCap()) {
                                this.snake.increaseSpeed(this.state.currentScore);

                                this.timeout -= this.snake.speed;
                            }
                        },
                    );

                    this.snake.grow();

                    this.food.generatePosition(this.grid.boundaries, this.snake.currentPosition);

                    this.renderSnake(this.snake.currentPosition);

                    this.renderFood();
                }
            }

            this.setState({
                doRender: true,
            });

            this.timeoutID = window.setTimeout(() => {
                this.game();
            }, this.timeout);
        } else {
            // GAME OVER SECTION

            clearTimeout(this.timeoutID);
            let highestScore = this.state.highestScore;

            if (this.state.currentScore > this.state.highestScore) {
                highestScore = this.state.currentScore;
            }

            this.setState({
                highestScore,
                lastScore: this.state.currentScore,
                gameStatus: "game-over",
            });
        }
    };

    /**
     * onKeyDown event handler for chaning snake's direction.
     * @param event - KeyboardEvent object
     */
    handleDirectionChange = (event: React.KeyboardEvent) => {
        if (this.state.gameStatus === "in-progress" && !this.state.isKeyPressed) {
            switch (event.key) {
                case "ArrowRight":
                    if (this.snake.direction === "down" || this.snake.direction === "up") {
                        this.snake.direction = "right";
                    }

                    break;
                case "ArrowDown":
                    if (this.snake.direction === "right" || this.snake.direction === "left") {
                        this.snake.direction = "down";
                    }

                    break;
                case "ArrowLeft":
                    if (this.snake.direction === "down" || this.snake.direction === "up") {
                        this.snake.direction = "left";
                    }

                    break;
                case "ArrowUp":
                    if (this.snake.direction === "right" || this.snake.direction === "left") {
                        this.snake.direction = "up";
                    }

                    break;
                default:
                    return;
            }

            this.setState({
                isKeyPressed: true,
            });
        }
    };

    /**
     * Click event handler for starting/restarting the game.
     */
    handleGame = () => {
        if (this.state.gameStatus === "idle" || this.state.gameStatus === "game-over") {
            if (this.appRef && this.appRef.current) {
                this.appRef.current.focus();
            }

            if (this.state.gameStatus === "game-over") {
                this.reset();
            }

            this.setState({
                currentScore: 0,
                gameStatus: "in-progress",
            });

            this.renderSnake(this.snake.startingPosition);

            this.food.generatePosition(this.grid.boundaries, this.snake.startingPosition);

            this.renderFood();

            this.timeoutID = window.setTimeout(() => {
                this.game();
            }, this.timeout);
        }
    };

    /**
     * Renders the grid.
     */
    renderGrid = () => {
        return this.grid.values.map((row, rowIndex) => (
            <div key={rowIndex} className={styles["grid-row"]} style={{ width: WIDTH }}>
                {row.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        className={styles["grid-col"]}
                        style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}>
                        {/* {col.value === "B" && <div className={styles["blank"]} />}
                        {col.value === "X" && <div className={styles["snake"]} />}
                        {col.value === "F" && <div className={styles["food"]} />} */}
                        <div
                            className={classNames(
                                styles["field"],
                                col.value === "B"
                                    ? styles["blank"]
                                    : col.value === "X"
                                    ? styles["snake"]
                                    : styles["food"],
                            )}
                        />
                    </div>
                ))}
            </div>
        ));
    };

    render() {
        const { currentScore, lastScore, highestScore, gameStatus } = this.state;
        let buttonLabel = startGame;

        if (gameStatus === "in-progress") {
            buttonLabel = inProgress;
        } else if (gameStatus === "game-over") {
            buttonLabel = restartGame;
        }

        return (
            <div
                ref={this.appRef}
                className={styles["app"]}
                tabIndex={0}
                onKeyDown={this.handleDirectionChange}>
                <div className={styles["header"]}>
                    <div className={styles["title"]}>{title}</div>
                </div>
                <div className={styles["container"]}>
                    <div className={styles["grid"]} style={{ height: HEIGHT }}>
                        {this.renderGrid()}
                    </div>
                    <div className={styles["details"]}>
                        <div className={styles["score-container"]}>
                            <div className={styles["score-label"]}>
                                {`${highestScoreLabel}: `}
                                <span className={styles["score"]}>{highestScore}</span>
                            </div>
                            <div className={styles["score-label"]}>
                                {`${lastScoreLabel}: `}
                                <span className={styles["score"]}>{lastScore}</span>
                            </div>
                            <div className={styles["score-label"]}>
                                {`${currentScoreLabel}: `}
                                <span className={styles["score"]}>{currentScore}</span>
                            </div>
                        </div>
                        <div className={styles["button-container"]}>
                            <button
                                className={classNames(
                                    styles["button"],
                                    styles[`button-${gameStatus}`],
                                )}
                                onClick={this.handleGame}>
                                {buttonLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
