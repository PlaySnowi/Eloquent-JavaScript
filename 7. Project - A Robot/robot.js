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
console.log(first);

// Create a new Village object from the previous one after one move
let next = first.move("Alice's House");
console.log(next);

/*
 * The move method gives us a new village state but leaves the old one entirely intact
 * Parcel objects aren’t changed when they are moved but re-created
 */
console.log(next.place);
// → Alice's House
console.log(next.parcels);
// → []
console.log(first.place);
// → Post Office
