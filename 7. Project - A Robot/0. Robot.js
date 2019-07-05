// Meadowfield village

// 14 roads between 11 places
const roads = ["Alice's House-Bob's House", "Alice's House-Cabin", "Alice's House-Post Office", "Bob's House-Town Hall",
   "Daria's House-Ernie's House", "Daria's House-Town Hall", "Ernie's House-Grete's House", "Grete's House-Farm",
   "Grete's House-Shop", "Marketplace-Farm", "Marketplace-Post Office", "Marketplace-Shop", "Marketplace-Town Hall",
   "Shop-Town Hall"];

// Network of roads in the village -> graph
/*
 * graph -> collection of points (places in the village) with lines between them (roads)
 * convert the list of roads to a data structure that, for each place, tells us what can be reached from there
 * Given an array of edges, buildGraph() creates an object that, for each node, stores an array of connected nodes
 */
function buildGraph(edges) {
   let graph = Object.create(null);
   //console.log(graph);

   function addEdge(from, to) {
      // if the edge does not exist as a key @ {graph}, create it and give it a value that is an array with a connected edge
      if (graph[from] == null) {
         //console.log(from);
         //console.log(graph[from]);
         //console.log([to]);
         graph[from] = [to];
         //console.log(graph[from]);
      } else { // if the edge already exists as a key @ {graph}, push the connected edge to its value array
         graph[from].push(to);
      }
   }

   /*
    * edges = roads -> one array: ['from-to', 'from-to', ...]
    * [from, to] = one element from the edges array -> after split -> several arrays: ['from', 'to], ['from', 'to], ...
    * for each element from the edges array, call the addEdge() function
    * since roads are not repeated in the roads array, we need both addEdge(from, to) and addEdge(to, from) so all connections are @ {graph} - for example:
    * Alice's House: ["Bob's House"] and Bob's House: ["Alice's House"]
    */
   for (let [from, to] of edges.map(r => r.split("-"))) {
      //console.log([from, to]);
      //console.log(from);
      //console.log(to);
      addEdge(from, to);
      addEdge(to, from);
   }
   return graph;
}

const roadGraph = buildGraph(roads);
//console.log(roadGraph);

// The task

/*
 * There are parcels in edges addressed to other edges
 * The automaton must decide, at each edge, where to go next
 * Task finishes when all parcels have been delivered
 * Define a virtual world: where the robot is, where the parcels are; when the robot moves -> update the model to reflect the new situation
 * 
 * place -> the robot’s current location
 * parcels -> undelivered parcels - each has a current location and a destination; example: [{place: "Post Office", address: "Alice's House"} , {...}, ...]
 * The robot moves -> compute a new state for the situation after the move
 */

class VillageState {
   constructor(place, parcels) {
      this.place = place;
      this.parcels = parcels;
   }

   move(destination) { // Alice's House
      // if the current edge (this.place) is not connected to the destination -> not a valid move -> return the old state (this object)
      if (!roadGraph[this.place].includes(destination)) {
         /*console.log(roadGraph['Marketplace']);
         console.log(roadGraph['Marketplace'].includes('Cabin'));
         console.log(!roadGraph['Marketplace'].includes('Cabin'));*/
         return this;
      } else { // if the current edge is connected to the destination
         // create a new set of parcels that will be carried by the robot to the next place
         let parcels = this.parcels.map(p => {
            // if the robot current location is not the location of the parcel, the parcel stays undelivered (goes into the new parcel array without changes)
            /*console.log(this.place);
            console.log(p.place);*/
            if (p.place != this.place) {
               //console.log(p);
               return p;
            }
            /* 
             * if the robot current location is the location of the parcel, the parcel is picked up for delivery -> 
             *  goes into the new parcel array but the parcel place changes to its destination (since we will reach it when the move finishes)
             */
            //console.log({ place: destination, address: p.address });
            return { place: destination, address: p.address };
         }).filter(p => {
            // parcels addressed to the new place are delivered -> removed from new parcels array (filter returns the elements that pass the test -> different adresses)
            /*console.log(p);
            console.log(p.place);
            console.log(p.address);*/
            return p.place != p.address
         });

         //console.log(parcels);
         return new VillageState(destination, parcels);
      }
   }
}

// create a new Village object
let first = new VillageState("Post Office", [{ place: "Post Office", address: "Alice's House" }]);
//console.log(first);

// Create a new Village object from the previous one after one move
let next = first.move("Alice's House");
//console.log(next);

/*
 * The move method gives us a new village state but leaves the old one entirely intact
 * Parcel objects aren’t changed when they are moved but re-created
 */
//console.log(next.place);
// → Alice's House
//console.log(next.parcels);
// → []
//console.log(first.place);
// → Post Office

// Simulation

/*
 * state -> VillageState
 * robot -> function
 * memory -> a memory value that will be given back to it the next time it is called
 */
function runRobot(state, robot, memory) {
   for (let turn = 0; ; turn++) {
      if (state.parcels.length == 0) {
         //console.log(`Done in ${turn} turns`);
         break;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
      //console.log(`Moved to ${action.direction}`);
   }
}

// The robot could just walk in a random direction every turn
function randomPick(array) {
   let choice = Math.floor(Math.random() * array.length);
   return array[choice];
}

/*
 * function robot(state, memory) { ... }
 * Since this robot does not need to remember anything, it ignores its second argument (memory)
 */
function randomRobot(state) {
   return { direction: randomPick(roadGraph[state.place]) };
}

/*
 * Create a new state with some parcels -> VillageState.random adds a property to the constructor (static method)
 * The do loop picks new places when it's equal to the address (we don’t want parcels that are sent from the same place that they are addressed to)
 */

VillageState.random = function (parcelCount = 5) {
   let parcels = [];

   for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;

      do {
         place = randomPick(Object.keys(roadGraph));
      } while (place == address);

      parcels.push({ place, address });
   }

   //console.log(parcels);
   return new VillageState("Post Office", parcels);
};

//runRobot(VillageState.random(), randomRobot);
// → Moved to Marketplace
// → Moved to Town Hall
// → …
// → Done in 63 turns

// The mail truck’s route

/* a route that passes all places in the village (starting from the post office)
 * if the robot runs that route twice, it is guaranteed to be done
 */

const mailRoute = ["Alice's House", "Cabin", "Alice's House", "Bob's House", "Town Hall", "Daria's House", "Ernie's House", "Grete's House", "Shop", "Grete's House", "Farm", "Marketplace", "Post Office"];

function routeRobot(state, memory) {
   if (memory.length == 0) {
      memory = mailRoute;
   }
   // .slice(1) removes the first array item
   return { direction: memory[0], memory: memory.slice(1) };
}

// runRobot(VillageState.random(), routeRobot, []);

// Pathfinding

/*
 * graph -> the locations you can reach from each place
 * graph[at] -> the places that can be reached from "at" ("place")
 * from -> place where the robot is located
 * to -> place where the parcel is located
 * work -> array of places that should be explored next, along with the route that got us there
 * 
 * “grow” routes from the starting point, exploring every reachable place that hasn’t been visited yet, until a route reaches the goal
 * i.e., we’ll only explore routes that are potentially interesting, and we’ll find the shortest route to the goal
 */
function findRoute(graph, from, to) {
   let work = [{ at: from, route: [] }];

   // takes the next item in the work list and explores that (all roads going from that place are looked at)
   for (let i = 0; i < work.length; i++) {
      let { at, route } = work[i]; // destructuring (easier to access properties): get the places from the work list

      for (let place of graph[at]) {
         // if the robot can reach the destination from the current place
         if (place == to) return route.concat(place); // add that place to the route and return that route

         // if we haven’t looked at this place before, a new item is added to the list
         if (!work.some(w => w.at == place)) { // w.at == place always false -> ! -> true
            work.push({ at: place, route: route.concat(place) });
         }
      }
      console.log(route);
   }
}

// function robot(state, memory)
function goalOrientedRobot({ place, parcels }, route) {
   if (route.length == 0) { // if the memory is empty
      let parcel = parcels[0]; // get the first parcel

      if (parcel.place != place) { // if the place where the parcel is, is different form the place where the robot is
         route = findRoute(roadGraph, place, parcel.place); // find the route to get the parcel
      } else { // if the place where the parcel is, is the same where the robot is
         route = findRoute(roadGraph, place, parcel.address); // find the route to deliver the parcel
      }
   }
   //console.log(route);
   return { direction: route[0], memory: route.slice(1) };
}

runRobot(VillageState.random(), goalOrientedRobot, []);