import React, { useEffect, useState } from "react";

const Memorygame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [card, setCard] = useState([]);
  const [fliped, setFliped] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [slove, setSlove] = useState([]);
  const [won, setWon] = useState(false);

  const handelGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({
        id: index,
        number,
      }));
    setCard(shuffledCards);
    setFliped([]);
    setSlove([]);
    setWon(false);
    setDisabled(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const handelClick = (id) => {
    if (disabled || won || fliped.includes(id) || slove.includes(id)) return;

    if (fliped.length === 0) {
      setFliped([id]);
    } else if (fliped.length === 1) {
      setFliped([...fliped, id]);
      setDisabled(true);

      const firstCard = card.find((c) => c.id === fliped[0]);
      const secondCard = card.find((c) => c.id === id);

      if (firstCard.number === secondCard.number) {
        setSlove([...slove, fliped[0], id]);
        setFliped([]);
        setDisabled(false);
        if (slove.length + 2 === card.length) setWon(true);
      } else {
        setTimeout(() => {
          setFliped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const handelReset = () => {
    initializeGame();
  };

  const isFlipped = (id) => fliped.includes(id) || slove.includes(id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Gameboard</h1>
      <div className="mb-4">
        <label htmlFor="gridSize">Grid Size : (max 10) </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          className="border-2 border-gray-200 rounded px-2 py-1"
          onChange={handelGridSizeChange}
        />
      </div>
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(110%, ${gridSize * 5.5}rem)`,
        }}
      >
        {card.map((card) => (
          <div
            key={card.id}
            onClick={() => handelClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl rounded-lg font-bold cursor-pointer transition-all duration-300 ${
              slove.includes(card.id)
                ? "bg-green-500 text-white"
                : isFlipped(card.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>
      {won && (
        <h2 className="text-2xl font-bold text-green-500 mt-4">
          You Won!🎉🎉🎉
        </h2>
      )}

      <button
        onClick={handelReset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Reset
      </button>
    </div>
  );
};

export default Memorygame;
