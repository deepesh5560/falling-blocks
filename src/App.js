import React, { useEffect, useState } from 'react';
import './App.css';

// Function to get a random color from a predefined list
const getRandomColor = () => {
  const colors = ['cyan', 'magenta', 'yellow', 'green', 'orange', 'purple', 'red', 'blue'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to darken a color
const darkenColor = (color, factor) => {
  const colorObj = document.createElement('div');
  colorObj.style.color = color;
  document.body.appendChild(colorObj);

  const computedColor = getComputedStyle(colorObj).color;
  document.body.removeChild(colorObj);

  const rgb = computedColor.match(/\d+/g).map(Number);

  return `rgb(${Math.floor(rgb[0] * factor)}, ${Math.floor(rgb[1] * factor)}, ${Math.floor(rgb[2] * factor)})`;
};

function App() {
  const columnCount = 20;
  const rowCount = 15;
  const snakeLength = 7;

  const [activeSnakes, setActiveSnakes] = useState([]);
  const [snakeColor, setSnakeColor] = useState(getRandomColor());

  // this starts new snake 
  const startNewSnake = () => {
    if (activeSnakes.length < 7) {
      const newColumn = Math.floor(Math.random() * columnCount);
      setActiveSnakes(prevSnakes => [
        ...prevSnakes,
        { column: newColumn, position: -snakeLength },
      ]);
    }
  };

  const moveSnakes = () => {
    setActiveSnakes(prevSnakes =>
      prevSnakes
        .map(snake => ({
          ...snake,
          position: snake.position + 1,
        }))
        .filter(snake => snake.position < rowCount)
    );
  };

  useEffect(() => {
    const snakeInterval = setInterval(() => {
      moveSnakes();
      if (activeSnakes.length < 7) {
        startNewSnake();
      }
    }, 30);

    return () => clearInterval(snakeInterval);
  }, [activeSnakes]);

  useEffect(() => {
    // Change the color of all snakes every 5 seconds
    const colorInterval = setInterval(() => {
      setSnakeColor(getRandomColor());
    }, 2000);

    return () => clearInterval(colorInterval);
  }, []);

  // Create 15x20 grid items
  const gridItems = [];
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < columnCount; col++) {
      const snake = activeSnakes.find(
        snake => snake.column === col && row >= snake.position && row < snake.position + snakeLength
      );

      let backgroundColor = '#111';
      if (snake) {
        const segmentIndex = row - snake.position;
        const darkeningFactor = 1 - (segmentIndex / (snakeLength * 1.5));
        backgroundColor = darkenColor(snakeColor, darkeningFactor);
      }

      gridItems.push(
        <div
          key={`${row}-${col}`}
          className="grid-item"
          style={{ backgroundColor }}
        ></div>
      );
    }
  }

  return (
    <>
      <h1 style={{"color":snakeColor||'white'}}>Falling Tile Sankes</h1>
      <div className="grid-container">
      {gridItems}
    </div>
    </>
  );
}

export default App;
