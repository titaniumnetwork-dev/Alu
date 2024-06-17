const dbg = console.log.bind(console, "[WorkerWare]");

const defaultOpt = {
    debug: false,
}

class WorkerWare {
    constructor(opt) {
        this._opt = opt;
        this._middlewares = [];
    }
    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('[WorkerWare] Middleware must be a function!');
        if (this._opt.debug) dbg("Added middleware", fn.name || "<anonymous>");
        this._middlewares.push(fn);
    }
    run(ctx, event) {
        const middlewares = this._middlewares;
        const returnList = [];
        let fn = async () => {
            for (let i = 0; i < middlewares.length; i++) {
                returnList.push(await middlewares[i](ctx, event));
            }
            return returnList;
        };
        return fn;
    }
}