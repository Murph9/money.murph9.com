export class ObjCache {
    cache: Map<string, any> = new Map()

    put(str: string, obj: any) {
        this.cache.set(str, obj);
    }

    get(str: string): any {
        if (this.cache.has(str)) {
            return this.cache.get(str);
        }

        return null;
    }

    del(str: string) {
        this.cache.delete(str);
    }
}

// singleton, yay
const cache: ObjCache = new ObjCache();

const Cache = () => cache;
export default Cache;