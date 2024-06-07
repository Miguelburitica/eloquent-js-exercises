type Parcel = { currentPlace: string, destinationAddress: string };

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall"
];

const roadGraph = createGraph(roads);

function createGraph (edges: string[]) {
  const graph = new Map();

  function addEdge(from: string, to: string ) {
    if (graph.has(from)) {
      graph.get(from)?.push(to);
    } else {
      graph.set(from, [to]);
    }
  }

  // each edge is a road between two houses
  edges.forEach(edge => {
    const [from, to] = edge.split("-");
    addEdge(from, to);
    addEdge(to, from);
  });

  return graph;
}

class VillageState {
  robotPlace: string;
  parcels: Parcel[];

  constructor ({ initialPlace, parcels }: { initialPlace: string, parcels: Parcel[] }) {
    this.robotPlace = initialPlace;
    this.parcels = parcels;
  }

  move ({ destination, roadGraph }: { destination: string, roadGraph: Map<string, string[]>}) {
    if (!roadGraph.get(this.robotPlace)?.includes(destination)) {
      return this;
    } else {
      const parcels = this.parcels
        // the map will make the change of currentPlace for each parcel if the parcel is actually in the robot's place (robot takes it),
        // moving it to the robot's destination
        .map(p => {
          if (p.currentPlace !== this.robotPlace) return p;
          return { currentPlace: destination, destinationAddress: p.destinationAddress };
        })
        // filter will "deliver" the parcel if the parcel'currentPlace (after moving it with the map) is in the parcel's destinationAddress
        .filter(p => p.currentPlace !== p.destinationAddress);

      return new VillageState({ initialPlace: destination, parcels });
    }
  }

  static random (parcelCount = 5) {
    let parcels: Parcel[] = [];

    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Array.from(roadGraph.keys()));
      let place;
      do {
        place = randomPick(Array.from(roadGraph.keys()));
      } while (place == address);
      parcels.push({ currentPlace: place, destinationAddress: address });
    }
    return new VillageState({ initialPlace: "Post Office", parcels });
  }
}

function runRobot (state: VillageState, robot: (state: VillageState, memory?: string[]) => { direction: string, memory?: string[] }, memory?: string[]) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length === 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    const action = robot(state, memory);
    state = state.move({ destination: action.direction, roadGraph });
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

function randomPick(array: string[]) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state: VillageState) {
  return { direction: randomPick(roadGraph.get(state.robotPlace)) };
}

const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
]

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}

// start "game" loop

// let first = new VillageState({
//   initialPlace: "Post Office",
//   parcels: [{ currentPlace: "Post Office", destinationAddress: "Alice's House" }]
// });

// let next = first.move({
//   destination: "Alice's House",
//   roadGraph
// });
// console.log(next.robotPlace);
// // → Alice's House
// console.log(next.parcels);
// // → []
// console.log(first.robotPlace);
// // → Post Office

// RANDOM ROBOT
console.log(' -------------> RANDOM ROBOT <-------------');
runRobot(VillageState.random(), randomRobot);

// mailRoute ROBOT
console.log(' -------------> MAIL ROUTE ROBOT <-------------');
runRobot(VillageState.random(), routeRobot, mailRoute);
