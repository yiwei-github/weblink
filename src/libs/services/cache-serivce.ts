import {
  ChunkCache,
  FileMetaData,
  IDBChunkCache,
} from "../cache/chunk-cache";
import {
  EventHandler,
  MultiEventEmitter,
} from "../utils/event-emitter";
import {
  createStore,
  SetStoreFunction,
  StoreSetter,
} from "solid-js/store";
import { FileID } from "../core/type";
import {
  Accessor,
  batch,
  createSignal,
  Setter,
} from "solid-js";
import { appOptions } from "@/options";

type EventMap = {
  update: string;
  cleanup: string;
};

class FileCacheFactory {
  status: Accessor<"ready" | "loading">;
  private setStatus: Setter<"ready" | "loading">;
  private eventEmitter: MultiEventEmitter<EventMap> =
    new MultiEventEmitter();
  readonly cacheInfo: Record<FileID, FileMetaData>;
  private setCacheInfo: SetStoreFunction<
    Record<FileID, FileMetaData>
  >;
  readonly caches: Record<FileID, ChunkCache>;
  private setCaches: SetStoreFunction<
    Record<FileID, ChunkCache>
  >;
  constructor() {
    const [caches, setCaches] = createStore<
      Record<FileID, ChunkCache>
    >({});
    this.caches = caches;
    this.setCaches = setCaches;
    this.update();
    const [status, setStatus] = createSignal<
      "ready" | "loading"
    >("loading");
    this.status = status;
    this.setStatus = setStatus;
    const [cacheInfo, setCacheInfo] = createStore<
      Record<FileID, FileMetaData>
    >({});
    this.cacheInfo = cacheInfo;
    this.setCacheInfo = setCacheInfo;
  }

  addEventListener<K extends keyof EventMap>(
    eventName: K,
    handler: EventHandler<EventMap[K]>,
  ) {
    return this.eventEmitter.addEventListener(
      eventName,
      handler,
    );
  }

  removeEventListener<K extends keyof EventMap>(
    eventName: K,
    handler: EventHandler<EventMap[K]>,
  ) {
    return this.eventEmitter.removeEventListener(
      eventName,
      handler,
    );
  }

  private dispatchEvent<K extends keyof EventMap>(
    eventName: K,
    event: EventMap[K],
  ) {
    return this.eventEmitter.dispatchEvent(
      eventName,
      event,
    );
  }

  async update() {
    const databases = await indexedDB.databases();

    const fileDBs = databases
      .filter((db) =>
        db.name?.startsWith(IDBChunkCache.DBNAME_PREFIX),
      )
      .map((db) =>
        db.name!.substring(
          IDBChunkCache.DBNAME_PREFIX.length,
        ),
      );

    Promise.all(
      fileDBs.map((id) => this.createCache(id)),
    ).then(() => {
      this.setStatus("ready");
    });
  }

  getCache(id: FileID): ChunkCache | null {
    if (this.caches[id]) {
      return this.caches[id];
    }
    return null;
  }

  async remove(id: FileID) {
    const cache = this.caches[id];
    if (cache) {
      await cache.cleanup();
      this.setCaches(id, undefined!);
    }
    return;
  }

  async createCache(id: FileID): Promise<ChunkCache> {
    if (this.caches[id]) {
      console.warn(`cache ${id} has already created`);
      return this.caches[id];
    }

    const cache = new IDBChunkCache({
      id,
    });
    cache.addEventListener("update", (ev) => {
      this.setCacheInfo(id, ev.detail ?? undefined!);
    });
    cache.addEventListener("cleanup", () => {
      this.setCacheInfo(id, undefined!);
      this.setCaches(id, undefined!);
    });
    cache.addEventListener("merged", (ev) => {
      if (appOptions.automaticDownload) {
        const file = ev.detail;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
      }
    });
    await cache.initialize();
    // const info = (await cache.getInfo()) ?? undefined;
    this.setCaches(id, cache);
    return cache;
  }
}

export const cacheManager = new FileCacheFactory();
