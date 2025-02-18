interface ILocalTierlists {
    published: string[];
    unPublished: string[];
}

export function storageGetTierlists(): ILocalTierlists {
    const store = localStorage.getItem("tierlists");
    function reset() {
        const emptyLocalTierlists = { published: [], unPublished: [] };
        localStorage.setItem("tierlists", JSON.stringify(emptyLocalTierlists));
        return emptyLocalTierlists;
    }
    if (!store) {
        return reset();
    }
    try {
        const localTierlists: ILocalTierlists = JSON.parse(store);
        if (!Array.isArray(localTierlists.published)) return reset();
        if (
            !localTierlists.published.every((s) => {
                s === s.toString();
            })
        ) {
            return reset();
        }
        if (!Array.isArray(localTierlists.unPublished)) return reset();
        if (
            !localTierlists.published.every((s) => {
                s === s.toString();
            })
        ) {
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
    if (tierlists.unPublished.includes(id)) return;
    tierlists.unPublished.push(id);
    setLocalTierlists(tierlists);
}
export function storagePublishTierlist(id: string) {
    const tierlists = storageGetTierlists();
    if (tierlists.published.includes(id)) return;
    tierlists.unPublished = tierlists.unPublished.filter((v) => v !== id);
    tierlists.published.push(id);
    setLocalTierlists(tierlists);
}
export function storageDeleteTierlist(id: string) {
    const tierlists = { ...storageGetTierlists() };
    tierlists.unPublished = tierlists.unPublished.filter((v) => v !== id);
    tierlists.published = tierlists.published.filter((v) => v !== id);
    setLocalTierlists(tierlists);
}
