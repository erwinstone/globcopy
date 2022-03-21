export declare function globcopy(params: globcopyParams): Promise<void>;
export declare function globcopyRaw(dataContent: string): Promise<void>;
interface globcopyParams {
    path: string;
    watch?: boolean;
}
export {};
