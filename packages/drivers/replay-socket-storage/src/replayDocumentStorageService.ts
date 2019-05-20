import * as api from "@prague/container-definitions";
import * as resources from "@prague/gitresources";

/**
 * Document storage service for the replay driver...just does a default implementation for
 * all the methods
 */
export class ReplayDocumentStorageService implements api.IDocumentStorageService  {
    public get repositoryUrl(): string {
        return "";
    }

    public async getSnapshotTree(version?: api.IVersion): Promise<api.ISnapshotTree | null> {
        return null;
    }

    public async getVersions(commitId: string, count: number): Promise<api.IVersion[]> {
       return [];
    }

    public async read(blobId: string): Promise<string> {
        return "";
    }

    public async getContent(version: api.IVersion, path: string): Promise<string> {
        return "";
    }

    public async write(tree: api.ITree, parents: string[], message: string): Promise<api.IVersion | null> {
        return null;
    }

    public async createBlob(file: Buffer): Promise<resources.ICreateBlobResponse> {
        return Promise.reject(new Error("ReplayDocumentStorageService.createBlob() not implemented"));
    }

    public getRawUrl(blobId: string): string | null {
        return null;
    }
}
