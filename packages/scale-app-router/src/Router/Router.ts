import { History, createBrowserHistory, createHashHistory, Action, Location } from "history"
import { ScaleApp } from "@dadoudidou/scale-app"

type RouteParams<T extends string> = { [P in T]: string | number }
type RouteQuery = string
export type RouteHandlerNotFound = (query: RouteQuery) => void
type RouteHandler<T extends string = any> = (params?: RouteParams<T>, query?:RouteQuery, url?: string) => any
type Route<T extends string = any> = { name?: string, handler: RouteHandler<T>, hooks?: Hooks, score: number }
type Routes = Map<string, Route>
export type RouteOrHandler<T extends string = any> = Omit<Route<T>, "score"> | RouteHandler<T>
export type RouteMapped<T extends string = any> = { 
    path: string, 
    route: Route<T>
    params?: RouteParams<T>
    query?: RouteQuery
    result?: any
}

type HookDatas = { url?: string, params?: RouteParams<any>, query?: RouteQuery, pathRoute?: string }
type HookBefore = (datas: HookDatas) => void
type HookAfter = (datas: HookDatas) => void
type HookLeave = (datas: HookDatas) => void
type HookAlready = (datas: HookDatas) => void
type Hooks = { before?: HookBefore, after?: HookAfter, leave?: HookLeave, already?:HookAlready }

/**
 * Path ranking Score :
 * - Each segment gets 4 points
 * - Static segments get 3 more points
 * - Dynamic segments 2 more
 * - Root segments 1
 * - segments get a 1 point penalty
 * 
 * Score    Path
 * 5        /
 * 7        /groups
 * 13       /groups/:groupId
 * 14       /groups/mine
 * 19       /groups/:groupId/users/*
 * 20       /groups/:groupId/users
 * 21       /groups/mine/users
 * 24       /:one/:two/:three/:four
 * 26       /groups/:groupId/users/:userId
 * 27       /groups/:groupId/users/me
 * 28       /groups/mine/users/me
 * 30       /:one/:two/:three/:four/:five
 * 
 * An url like /groups/mine matches both "/groups/mine" and "/groups/:groupdId" but "groups/mine" has 14 point while the other has 13.
 * So "/groups/mine" wins
 */


export class Router {
    private _root?: string = null;
    private _useHash: boolean = false;
    private _hash: string = "#";
    private _routes: Routes = new Map<string, Route>();
    public _lastRoute: RouteMapped = null;
    private _notFoundHandler: RouteHandlerNotFound = null;
    private _app: ScaleApp
    private _history: History = null;
    private _unlistenHistory = null;

    

    constructor(app:ScaleApp, history?: History){
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this._app = app;
        // root
        this._root = "";
        if(window && window.location){
            this._root = `${window.location.protocol}//${window.location.host}`
        }

        // history
        this._history = history;
        if(!this._history){
            if(window && window.history && window.history.pushState){
                this._history = createBrowserHistory();
            } else {
                this._history = createHashHistory();
            }
        }
        this._unlistenHistory = this._history.listen(this.onChangeLocation);

    }

    private onChangeLocation(location: Location, action: Action){
        console.log("onChangeLocation", location, action);
        this.resolve();
    }

    private pushState(url: string, absolute?: boolean){
        if(absolute){
            document.location.href = url;
        } else {
            this._history.push(url);
        }
    }

    private replaceState(url: string){
        this._history.replace(url);
    }

    private cleanPath(path: string){
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    private getUrlDepth(url: string){
        return url.replace(/\/$/, "").split("/").length;
    }

    private sortUrlDepth(urlA, urlB){
        return this.getUrlDepth(urlA) - this.getUrlDepth(urlB);
    }

    private getHref(){
        if(!window) return "";
        if(!window.location) return "";
        if(!window.location.href) return "";
        return this.cleanPath(window.location.href);
    }

    private getRootPath(){
        return this._root || "";
    }

    private isRootSegment(segment: string){ return segment === "" }
    private isDynamicSegment(segment: string){ return /^:(.+)/.test(segment) }
    private getDynamicSegmentVariable(segment: string){ return /^:(.+)/.exec(segment)[1]; }
    private isSplatSegment(segment: string){ return segment && segment[0] === "*" }
    private segmentize(url: string){ return this.cleanPath(url).split("/") }

    private findMatchedRoutes(url: string, routes: Routes): RouteMapped[] {
        let _routes: RouteMapped[] = [];
        let _urlSegments = this.segmentize(url);
        routes.forEach((route, path) => {
            let _missed = false;
            let _routeSegments = this.segmentize(path);
            let _max = Math.max(_urlSegments.length, _routeSegments.length); 
            let params: RouteParams<any> = {}
            for(let index=0; index < _max; index++){
                let routeSegment = _routeSegments[index];
                let urlSegment = _urlSegments[index];

                if(urlSegment === routeSegment){  continue; }

                // uri:     /users
                // route:   /users/:userid
                if(urlSegment === undefined){ _missed = true; break; }

                // uri:     /users/123/profile
                // route:   /users/*
                if(this.isSplatSegment(routeSegment)){ break; }

                if(this.isDynamicSegment(routeSegment)){ 
                    params[this.getDynamicSegmentVariable(routeSegment)] = urlSegment;
                    continue; 
                }

                _missed = true;
                break;

            }
            if(!_missed){
                _routes.push({
                    path, route, params
                })
            }
        })

        return _routes;
    }

    private getHightScoredRoute(routes: RouteMapped[]): RouteMapped {
        if(routes == null) return null;
        if(routes.length == 0) return null;
        return routes.sort((a,b) => a.route.score - b.route.score)[routes.length - 1]
    }

    private calculateScore(url: string){
        let _segments = this.cleanPath(url).split("/");
        let _score = 0;
        _segments.forEach((x,index) => {
            if(x == "*"){
                _score -= 1;
            } else {
                _score += 4;
                if(x == "" && index == 0) {
                    _score += 1;
                } else if(x.search(/^:/) > -1){
                    _score += 2
                } else {
                    _score += 3
                }
            }
        });
        return _score;
    }

    private _addRoute(path: string, handler: RouteOrHandler){
        if(typeof(handler) == "function"){

        }
        if(typeof(handler) == "object"){
            this._routes.set(path, {
                handler: handler.handler,
                hooks: handler.hooks,
                name: handler.name,
                score: this.calculateScore(path)
            });
        }
    }

    private getUrl(path: string, params: RouteParams<any>){
        let _url = path;
        if(params){
            for(let key in params){
                _url = _url.replace(new RegExp(":"+key), params[key].toString());
            }
        }
        return _url;
    }

    
    /** Ajoute une ou plusieurs routes */
    on(path: string, handler: RouteOrHandler): Router
    on(path: string, handler: RouteHandler, hooks?: Hooks): Router
    on(handler: RouteOrHandler): Router
    on(handler: RouteHandler, hooks?: Hooks): Router
    on(routes: { [path: string]: RouteOrHandler }): Router
    on(...args: any[]): Router{

        // on(handler: RouteHandler, hooks?: Hooks): Router
        if(typeof(args[0]) == "function"){
            this._addRoute("/", { handler: args[0], hooks: args[1] })
            return this;
        } 
        if(typeof(args[0]) == "object"){
            // on(handler: RouteOrHandler): Router
            if(args[0]["handler"]){
                this._addRoute("/", { handler: args[0].handler, name: args[0].name, hooks: args[0].hooks });
                return this;
            }
            // on(routes: { [path: string]: RouteOrHandler }): Router
            for(let path in args[0]){
                this.on(path, args[0][path])
            }
            return this;
        }
        if(typeof(args[0]) == "string") {
            let path = args[0];
            let func = args[1];
            let hook = args[2];

            // on(path: string, handler: RouteOrHandler): Router
            if(typeof(func) == "object"){
                this._addRoute(path, func);
            }

            // on(path: string, handler: RouteHandler, hooks?: Hooks): Router
            if(typeof(func) == "function"){
                this._addRoute(path, { handler: func, hooks: hook });
            }
        }
        return this;
    }

    /** Supprime les routes associées à la fonction */
    off(handler: RouteHandler): Router {
        let _keys: string[] = [];
        this._routes.forEach((value, key) => {
            if(value.handler == handler){
                _keys.push(key)
            }
        })
        _keys.forEach(x => this._routes.delete(x))
        return this;
    }

    /** Supprime toutes les routes */
    destroy(){
        if(this._unlistenHistory) this._unlistenHistory();
        this._routes.clear();
        this._lastRoute = null;
    }

    /** Resolve router */
    resolve(current?: string){
        let _url = (current || this.getHref()).replace(this.getRootPath(), "");
        if(this._useHash){
            _url = _url.replace(new RegExp('^\/' + this._hash), "/");
        }
        let _matchedRoutes = this.findMatchedRoutes(_url, this._routes);
        let _route = this.getHightScoredRoute(_matchedRoutes);

        // call last route leaved
        if(this._lastRoute && this._lastRoute.route.hooks && this._lastRoute.route.hooks.leave){
            this._lastRoute.route.hooks.leave({
                params: this._lastRoute.params,
                pathRoute: this._lastRoute.path,
                query: this._lastRoute.query,
                url: this.getUrl(this._lastRoute.path, this._lastRoute.params)
            });
        }

        if(!_route){
            if(this._notFoundHandler) this._notFoundHandler(_url)
            return;
        }

        // save the next last route
        this._lastRoute = {
            path: _route.path,
            route: _route.route,
            params: _route.params
        };

        let hookData: HookDatas = {
            params: _route.params,
            pathRoute: _route.path,
            query: _route.query,
            url: this.getUrl(_route.path, _route.params)
        }

        // call before
        if(_route.route.hooks && _route.route.hooks.before){
            _route.route.hooks.before(hookData);
        }

        // call main
        if(_route.route.handler){
            this._lastRoute.result = _route.route.handler(_route.params, _route.query, hookData.url);
        }
        this._app.mediator.publish("router:updateroute", this._lastRoute);

        // call after
        if(_route.route.hooks && _route.route.hooks.after){
            _route.route.hooks.after(hookData);
        }
    }

    /** Not found handler */
    notFound(handler: RouteHandlerNotFound){
        this._notFoundHandler = handler;
    }

    /** Navigue vers une route */
    navigate(path: string, replace: boolean = false){
        let _path = path.replace(/^\/+/, "/");
        let to=_path;
        if(replace){
            this.replaceState(to)
        } else {
            this.pushState(to);
        }
    }

    /** Navigue en arrière */
    back(){
        this._history.goBack();
    }

    getResolvedRoute(){
        return this._lastRoute;
    }

}

