/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { SharedMap } from "@fluid-experimental/fluid-framework";
import { FrsClient, FrsConnectionConfig } from "@fluid-experimental/frs-client";
import { TinyliciousClient } from "@fluid-experimental/tinylicious-client";
import { DiceRollerController } from "./controller";
import { ConsoleLogger } from "./ConsoleLogger";
import { renderAudience, renderDiceRoller } from "./view";

// Define the server we will be using and initialize Fluid
const useFrs = process.env.FLUID_CLIENT === "frs";

const connectionConfig: FrsConnectionConfig = {
    tenantId: "",
    type: "key",
    key: "",
    orderer: "",
    storage: "",
};
if (useFrs) {
    FrsClient.init(connectionConfig);
}

let createNew = false;
if (location.hash.length === 0) {
    createNew = true;
    location.hash = Date.now().toString();
}
const containerId = location.hash.substring(1);
document.title = containerId;

// Define the schema of our Container.
// This includes the DataObjects we support and any initial DataObjects we want created
// when the container is first created.
export const containerSchema = {
    name: "dice-roller-container",
    initialObjects: {
        /* [id]: DataObject */
        map1: SharedMap,
        map2: SharedMap,
    },
};

async function start(): Promise<void> {
    // Create a custom ITelemetryBaseLogger object to pass into the Tinylicious container
    // and hook to the Telemetry system
    const consoleLogger: ConsoleLogger = new ConsoleLogger();

    // Get or create the document depending if we are running through the create new flow

    const client = useFrs ? FrsClient :  new TinyliciousClient();
    const serviceConfig = { id: containerId, logger: consoleLogger };

    const preAttach = async (container) => console.log(container.initialObjects);

    const { fluidContainer, containerServices } = createNew
        ? await client.createContainer(serviceConfig, containerSchema, preAttach)
        : await client.getContainer(serviceConfig, containerSchema);

    // We now get the DataObject from the container
    const sharedMap1 = fluidContainer.initialObjects.map1 as SharedMap;

    // Our controller manipulates the data object (model).
    const diceRollerController = new DiceRollerController(sharedMap1);
    await diceRollerController.initialize(createNew);

    // We render a view which uses the controller.
    const contentDiv = document.getElementById("content") as HTMLDivElement;
    const div1 = document.createElement("div");
    contentDiv.appendChild(div1);

    // We now get the SharedMap from the container
    const sharedMap2 = fluidContainer.initialObjects.map2 as SharedMap;

    // Our controller manipulates the data object (model).
    const diceRollerController2 = new DiceRollerController(sharedMap2);
    await diceRollerController2.initialize(createNew);

    const div2 = document.createElement("div");
    contentDiv.appendChild(div2);

    // We render views which uses the controller.
    renderDiceRoller(diceRollerController, div1);
    renderDiceRoller(diceRollerController2, div2);

    // Render the audience information for the members currently in the session
    renderAudience(containerServices.audience, contentDiv);
}

start().catch((error) => console.error(error));
