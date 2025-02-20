export interface ILocalTierlists {
    published: string[];
    unpublished: string[];
}

export function storageGetTierlists(): ILocalTierlists {
    try {
        localStorage.getItem("");
    } catch {
        return { published: [], unpublished: [] };
    }
    const store = localStorage.getItem("tierlists");
    function reset() {
        console.log("resseting tierlists");
        const emptyLocalTierlists = { published: [], unpublished: [] };
        localStorage.setItem("tierlists", JSON.stringify(emptyLocalTierlists));
        return emptyLocalTierlists;
    }
    if (!store) {
        return reset();
    }
    try {
        const localTierlists: ILocalTierlists = JSON.parse(store);
        if (!Array.isArray(localTierlists.published)) return reset();
        if (!localTierlists.published.every((s) => s === s.toString())) {
            return reset();
        }
        if (!Array.isArray(localTierlists.unpublished)) return reset();
        if (!localTierlists.published.every((s) => s === s.toString())) {
            return reset();
        }
        return localTierlists;
    } catch {
        return reset();
    }
}

function setLocalTierlists(tierlists: ILocalTierlists) {
    localStorage.setItem("tierlists", JSON.stringify(tierlists));
}

export function storageCreateTierlist(id: string) {
    const tierlists = storageGetTierlists();
    if (tierlists.unpublished.includes(id)) return;
    tierlists.unpublished.push(id);
    setLocalTierlists(tierlists);
}
export function storagePublishTierlist(id: string) {
    const tierlists = storageGetTierlists();
    if (tierlists.published.includes(id)) return;
    tierlists.unpublished = tierlists.unpublished.filter((v) => v !== id);
    tierlists.published.push(id);
    setLocalTierlists(tierlists);
}
export function storageDeleteTierlist(id: string) {
    const tierlists = { ...storageGetTierlists() };
    tierlists.unpublished = tierlists.unpublished.filter((v) => v !== id);
    tierlists.published = tierlists.published.filter((v) => v !== id);
    setLocalTierlists(tierlists);
}
