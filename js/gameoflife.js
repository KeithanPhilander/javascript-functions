function seed() {
  // convert arguments object into an array with rest parameters ====> ...args
  return [...arguments];
}

function same([x, y], [j, k]) {
  // capture each cell
  const cell1 = arguments[0];
  const cell2 = arguments[1];

  // use array method every() to check whether the values in cell1 match the values in cell2 
  // returns true if they match false if they dont
  return cell1.every((val, index) => val === cell2[index]);
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {

  // turn cell into a string / stringify it
  const cellStr = JSON.stringify(cell);

  // the game state is passed as the `this` value of the function.
  // use array method some() to check if the gamestate or `this` contains the stringifed cell
  return this.some(item => JSON.stringify(item) === cellStr);
}

const printCell = (cell, state) => {
  // use previous contains functions call method and pass state and cell  
  // if alive return \u25A3 else return \u25A2
  return contains.call(state, cell) ? "\u25A3": "\u25A2";
};

function corners(state = []) {
  // // create a variable and set its value to state
  // const gameState = state;
  // // use Math.max method to find the highestX and highestY 
  // // use rest operator to gather all the x and y values to find the highest numbers
  // const highestX = Math.max(...gameState.map(cell => cell[0]));
  // const highestY = Math.max(...gameState.map(cell => cell[1]));

  // // set topRight and bottomLeft
  // const tRight = [highestX, highestY];
  // const bLeft = [1, 1];

  // // check if game state is empty and if true return specified topRight and bottomLeft
  // if(!gameState.length) {
  //   console.log("empty")
  //   return {
  //     topRight: [0,0],
  //     bottomLeft: [0,0]
  //   }
  // } else {
  //     return {
  //       topRight: tRight,
  //       bottomLeft: bLeft
  //   }
  // }


  if (state.length === 0) {
    return {
      topRight: [0, 0],
      bottomLeft: [0, 0]
    };
  }

  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);
  return {
    topRight: [Math.max(...xs), Math.max(...ys)],
    bottomLeft: [Math.min(...xs), Math.min(...ys)]
  };
}

const printCells = (state) => {
  // use corners function to retrieve topRight and bottomLeft
  const { topRight, bottomLeft } = corners(state);
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    accumulator += row.join(" ") + "\n";
  }
  return accumulator;
  
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x-1, y+1],[x, y+1],[x+1, y+1],
    [x-1,   y],         [x+1,   y], 
    [x-1, y-1],[x, y-1],[x+1, y-1]
  ]
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(c => contains.bind(state)(c));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state)
  return (
    livingNeighbors.length === 3 ||
    (contains.call(state, cell) && livingNeighbors.length === 2)
  );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let result = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      result = result.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  const states = [state];
  for(let i = 0; i < iterations; i++) {
      states.push(calculateNext(states[states.length-1]));
  }
  return states;
};

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;