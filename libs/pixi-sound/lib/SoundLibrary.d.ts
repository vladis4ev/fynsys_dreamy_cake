import Filterable from "./Filterable";
import * as filters from "./filters";
import Filter from "./filters/Filter";
import { Options, PlayOptions } from "./Sound";
import Sound from "./Sound";
import SoundContext from "./SoundContext";
import SoundInstance from "./SoundInstance";
import SoundSprite from "./SoundSprite";
import SoundUtils from "./SoundUtils";
export declare type SoundMap = {
    [id: string]: Options | string | ArrayBuffer;
};
export default class SoundLibrary {
    Sound: typeof Sound;
    SoundInstance: typeof SoundInstance;
    SoundLibrary: typeof SoundLibrary;
    SoundSprite: typeof SoundSprite;
    Filterable: typeof Filterable;
    filters: typeof filters;
    utils: typeof SoundUtils;
    private _context;
    private _sounds;
    constructor();
    readonly context: SoundContext;
    filtersAll: Filter[];
    readonly supported: boolean;
    add(alias: string, options: Options | string | ArrayBuffer | Sound): Sound;
    add(map: SoundMap, globalOptions?: Options): {
        [id: string]: Sound;
    };
    private _getOptions(source, overrides?);
    remove(alias: string): SoundLibrary;
    volumeAll: number;
    pauseAll(): SoundLibrary;
    resumeAll(): SoundLibrary;
    muteAll(): SoundLibrary;
    unmuteAll(): SoundLibrary;
    removeAll(): SoundLibrary;
    stopAll(): SoundLibrary;
    exists(alias: string, assert?: boolean): boolean;
    find(alias: string): Sound;
    play(alias: string, options?: PlayOptions | Object | string): SoundInstance | Promise<SoundInstance>;
    stop(alias: string): Sound;
    pause(alias: string): Sound;
    resume(alias: string): Sound;
    volume(alias: string, volume?: number): number;
    duration(alias: string): number;
    destroy(): void;
}
