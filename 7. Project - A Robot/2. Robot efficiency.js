const roads = ["Alice's House-Bob's House", "Alice's House-Cabin", "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall", "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm", "Marketplace-Post Office", "Marketplace-Shop", "Marketplace-Town Hall",
    "Shop-Town Hall"];

function buildGraph(edges) {
    let graph = Object.create(null);

    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }

    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }

    return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) {
                    return p;
                }
                return { place: destination, address: p.address };
            }).filter(p => {
                return p.place != p.address
            });

            return new VillageState(destination, parcels);
        }
    }
}

function countSteps(state, robot, memory) {
    for (let steps = 0; ; steps++) {
        if (state.parcels.length == 0) return steps;

        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
    }
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

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

    return new VillageState("Post Office", parcels);
};

function findRoute(graph, from, to) {
    let work = [{ at: from, route: [] }];

    for (let i = 0; i < work.length; i++) {

        let { at, route } = work[i];

        for (let place of graph[at]) {
            if (place == to) {
                return route.concat(place);
            }

            if (!work.some(w => w.at == place)) {
                work.push({ at: place, route: route.concat(place) });

            }
        }
    }
}

function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let parcel = parcels[0];

        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }

    return { direction: route[0], memory: route.slice(1) };
}

function compareRobots(robot1, memory1, robot2, memory2) {
    let total1 = 0, total2 = 0;

    for (let i = 0; i < 100; i++) {
        let state = VillageState.random();
        total1 += countSteps(state, robot1, memory1);
        total2 += countSteps(state, robot2, memory2);
    }

    console.log(`Robot 1 needed ${total1 / 100} steps per task`)
    console.log(`Robot 2 needed ${total2 / 100}`)
}

compareRobots(goalOrientedRobot, [], yourRobot, []);

/* Can you write a robot that finishes the delivery task faster than goalOrientedRobot? If you observe that robot’s behavior, what obviously stupid things does it do? How could those be improved?

If you solved the previous exercise, you might want to use your compareRobots function to verify whether you improved the robot.

Hints:

The main limitation of goalOrientedRobot is that it considers only one parcel at a time.
It will often walk back and forth across the village because the parcel it happens to be looking at happens to be at the other side of the map, even if there are others much closer.

One possible solution would be to compute routes for all packages and then take the shortest one.
Even better results can be obtained, if there are multiple shortest routes, by preferring the ones that go to pick up a package instead of delivering a package. */

// My solution

function yourRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let searchRoute;
        let shortRoute = new Array(20);

        for (let i = 0; i < parcels.length; i++) {
            let parcel = parcels[i];

            if (parcel.place != place) {
                searchRoute = findRoute(roadGraph, place, parcel.place);
                if (searchRoute.length <= shortRoute.length) shortRoute = searchRoute;
            } else {
                searchRoute = findRoute(roadGraph, place, parcel.address);
                if (searchRoute.length < shortRoute.length) shortRoute = searchRoute;
            }
        }
        route = shortRoute;
    }
    return { direction: route[0], memory: route.slice(1) };
}

countSteps(VillageState.random(), yourRobot, []);

// Book solution

function lazyRobot({ place, parcels }, route) {
    if (route.length == 0) {
        // Describe a route for every parcel
        let routes = parcels.map(parcel => {
            if (parcel.place != place) {
                return {
                    route: findRoute(roadGraph, place, parcel.place),
                    pickUp: true
                };
            } else {
                return {
                    route: findRoute(roadGraph, place, parcel.address),
                    pickUp: false
                };
            }
        });

        // This determines the precedence a route gets when choosing.
        // Route length counts negatively, routes that pick up a package
        // get a small bonus.
        function score({ route, pickUp }) {
            return (pickUp ? 0.5 : 0) - route.length;
        }
        route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
        debugger
    }

    return { direction: route[0], memory: route.slice(1) };
}

countSteps(VillageState.random(), lazyRobot, []);