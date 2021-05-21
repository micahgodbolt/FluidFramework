/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import frsClient from "@fluid-experimental/frs-client";
import { SharedMap } from "@fluid-experimental/fluid-framework";
import { InsecureTokenProvider } from "@fluidframework/test-runtime-utils";
import { DiceRollerController } from "./controller";
import { ConsoleLogger } from "./ConsoleLogger";
import { renderAudience, renderDiceRoller } from "./view";

const user = {
    id: "unique-id",
    name: "Unique Idee",
};

const config = {
    tenantId: "",
    key: "",
    orderer: "",
    storage: "",
    absoluteUrlBase: "",
    tokenProvider: new InsecureTokenProvider("", user),
};

// Define the server we will be using and initialize Fluid
frsClient.init(config);

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
    const fluidContainer = createNew
        ? await frsClient.createContainer({ id: containerId, logger: consoleLogger }, containerSchema)
        : await frsClient.getContainer({ id: containerId, logger: consoleLogger }, containerSchema);

    // We now get the DataObject from the container
    const sharedMap1 = fluidContainer.initialObjects.map1 as SharedMap;

    // Our controller manipulates the data object (model).
    const diceRollerController = new DiceRollerController(sharedMap1);
    await diceRollerController.initialize(createNew);

    // We render a view which uses the controller.
    const contentDiv = document.getElementById("content") as HTMLDivElement;
    const div1 = document.createElement("div");
    contentDiv.appendChild(div1);
    renderDiceRoller(diceRollerController, div1);

    // We now get the SharedMap from the container
    const sharedMap2 = fluidContainer.initialObjects.map2 as SharedMap;

    // Our controller manipulates the data object (model).
    const diceRollerController2 = new DiceRollerController(sharedMap2);
    await diceRollerController2.initialize(createNew);

    const div2 = document.createElement("div");
    contentDiv.appendChild(div2);
    // We render a view which uses the controller.
    renderDiceRoller(diceRollerController2, div2);

    // Render the user names for the members currently in the session
    renderAudience(fluidContainer.audience, contentDiv);
}

start().catch((error) => console.error(error));
