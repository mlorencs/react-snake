import { BLOCK_SIZE, HEIGHT, WIDTH } from "constants/constants";
import React, { useState } from "react";

import appData from "assets/data/app.json";
import classNames from "classnames";
import { initializeGrid } from "modules/grid";
import styles from "./App.module.scss";

type GameStatus = "idle" | "in-progress" | "game-over";

const {
    title,
    highestScoreLabel,
    lastScoreLabel,
    currentScoreLabel,
    startGame,
    inProgress,
    restartGame,
} = appData;

const initialGridState = initializeGrid();

/**
 * App component renders ... .
 */
const App: React.FC = () => {
    const [currentScore, setCurrentScore] = useState(0);
    const [lastScore, setLastScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
    const [grid, setGrid] = useState(initialGridState);
    let buttonLabel = startGame;

    if (gameStatus === "in-progress") {
        buttonLabel = inProgress;
    } else if (gameStatus === "game-over") {
        buttonLabel = restartGame;
    }

    const handleGame = () => {};

    const renderGrid = () => {
        return grid.map((row) => (
            <div className={styles["grid-row"]} style={{ width: WIDTH }}>
                {row.map((col) => (
                    <div
                        className={styles["grid-col"]}
                        style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}
                    />
                ))}
            </div>
        ));
    };

    return (
        <div className={styles["app"]}>
            <div className={styles["header"]}>
                <div className={styles["title"]}>{title}</div>
            </div>
            <div className={styles["container"]}>
                <div className={styles["grid"]} style={{ height: HEIGHT }}>
                    {renderGrid()}
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
                            )}>
                            {buttonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
