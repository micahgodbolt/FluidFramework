/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { getObjectWithIdFromContainer } from "@fluidframework/aqueduct";
import { Container } from "@fluidframework/container-loader";
import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";
import { getRuntimeFactory } from "./containerCode";

export class FluidDocument {
    constructor(private readonly container: Container, public readonly createNew: boolean) {}

    public async createDataObject<T = any>(type: string, id: string) {
        await this.container.request({ url: `/create/${type}/${id}` });
        const dataObject = await this.getDataObject<T>(id);
        return dataObject;
    }

    public async getDataObject<T = any>(id: string) {
        const dataObject = await getObjectWithIdFromContainer<T>(id, this.container);
        return dataObject;
    }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Fluid {
    public static async createContainer(docId: string, factories: any[]): Promise<FluidDocument> {
        const container = await getTinyliciousContainer(
            docId,
            getRuntimeFactory(factories),
            true, /* createNew */
        );
        const document = new FluidDocument(container, true /* createNew */);
        return document;
    }
    public static async getContainer(docId: string, factories: any[]): Promise<FluidDocument> {
        const container = await getTinyliciousContainer(
            docId,
            getRuntimeFactory(factories),
            false, /* createNew */
        );
        const document = new FluidDocument(container, false /* createNew */);
        return document;
    }
}
