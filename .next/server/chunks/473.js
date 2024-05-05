"use strict";
exports.id = 473;
exports.ids = [473];
exports.modules = {

/***/ 2720:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ withAuth)
/* harmony export */ });
let warningCount = 0;
function withAuth(originalFunction) {
    return async function(...args) {
        if (process.env.USE_DB_AUTHENTICATION === "false") {
            if (warningCount < 5) {
                console.warn("WARNING - You're bypassing authentication");
                warningCount++;
            }
            return {
                success: true
            };
        } else {
            try {
                return await originalFunction(...args);
            } catch (error) {
                console.error("Error in withAuth function: ", error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    };
}


/***/ }),

/***/ 6473:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  authenticateUser: () => (/* binding */ authenticateUser),
  supaAuthenticateUser: () => (/* binding */ supaAuthenticateUser)
});

;// CONCATENATED MODULE: ./src/lib/parseApi.ts
function parseApi(api) {
    // Handle older versions of the API that don't have the fc- prefix
    if (!api.startsWith("fc-")) {
        return api;
    }
    // remove the fc- prefix
    // re add all the dashes based on the uuidv4 format
    // 3d478a29-6e59-403e-85c7-94aba81ffd2a
    const uuid = api.replace(/^fc-/, "").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
    return uuid;
}
function uuidToFcUuid(uuid) {
    const uuidWithoutDashes = uuid.replace(/-/g, "");
    return `fc-${uuidWithoutDashes}`;
}

// EXTERNAL MODULE: external "rate-limiter-flexible"
var external_rate_limiter_flexible_ = __webpack_require__(298);
// EXTERNAL MODULE: external "redis"
var external_redis_ = __webpack_require__(7773);
// EXTERNAL MODULE: ./src/types.ts
var types = __webpack_require__(6327);
;// CONCATENATED MODULE: ./src/services/rate-limiter.ts



const MAX_REQUESTS_PER_MINUTE_PREVIEW = 5;
const MAX_CRAWLS_PER_MINUTE_STARTER = 2;
const MAX_CRAWLS_PER_MINUTE_STANDARD = 4;
const MAX_CRAWLS_PER_MINUTE_SCALE = 20;
const MAX_REQUESTS_PER_MINUTE_ACCOUNT = 20;
const MAX_REQUESTS_PER_MINUTE_CRAWL_STATUS = 120;
const redisClient = external_redis_.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
});
const previewRateLimiter = new external_rate_limiter_flexible_.RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: MAX_REQUESTS_PER_MINUTE_PREVIEW,
    duration: 60
});
const serverRateLimiter = new external_rate_limiter_flexible_.RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: MAX_REQUESTS_PER_MINUTE_ACCOUNT,
    duration: 60
});
const crawlStatusRateLimiter = new external_rate_limiter_flexible_.RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: MAX_REQUESTS_PER_MINUTE_CRAWL_STATUS,
    duration: 60
});
function crawlRateLimit(plan) {
    if (plan === "standard") {
        return new RateLimiterRedis({
            storeClient: redisClient,
            keyPrefix: "middleware",
            points: MAX_CRAWLS_PER_MINUTE_STANDARD,
            duration: 60
        });
    } else if (plan === "scale") {
        return new RateLimiterRedis({
            storeClient: redisClient,
            keyPrefix: "middleware",
            points: MAX_CRAWLS_PER_MINUTE_SCALE,
            duration: 60
        });
    }
    return new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "middleware",
        points: MAX_CRAWLS_PER_MINUTE_STARTER,
        duration: 60
    });
}
function getRateLimiter(mode) {
    switch(mode){
        case types/* RateLimiterMode */.G.Preview:
            return previewRateLimiter;
        case types/* RateLimiterMode */.G.CrawlStatus:
            return crawlStatusRateLimiter;
        default:
            return serverRateLimiter;
    }
}

// EXTERNAL MODULE: ./src/services/supabase.ts
var supabase = __webpack_require__(2560);
// EXTERNAL MODULE: ./src/lib/withAuth.ts
var withAuth = __webpack_require__(2720);
;// CONCATENATED MODULE: ./src/pages/api/auth.ts





async function authenticateUser(req, res, mode) {
    return (0,withAuth/* withAuth */.Q)(supaAuthenticateUser)(req, res, mode);
}
async function supaAuthenticateUser(req, res, mode) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401
        };
    }
    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
    if (!token) {
        return {
            success: false,
            error: "Unauthorized: Token missing",
            status: 401
        };
    }
    try {
        const incomingIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const iptoken = incomingIP + token;
        await getRateLimiter(token === "this_is_just_a_preview_token" ? types/* RateLimiterMode */.G.Preview : mode).consume(iptoken);
    } catch (rateLimiterRes) {
        console.error(rateLimiterRes);
        return {
            success: false,
            error: "Rate limit exceeded. Too many requests, try again in 1 minute.",
            status: 429
        };
    }
    if (token === "this_is_just_a_preview_token" && (mode === types/* RateLimiterMode */.G.Scrape || mode === types/* RateLimiterMode */.G.Preview || mode === types/* RateLimiterMode */.G.Search)) {
        return {
            success: true,
            team_id: "preview"
        };
    // check the origin of the request and make sure its from firecrawl.dev
    // const origin = req.headers.origin;
    // if (origin && origin.includes("firecrawl.dev")){
    //   return { success: true, team_id: "preview" };
    // }
    // if(process.env.ENV !== "production") {
    //   return { success: true, team_id: "preview" };
    // }
    // return { success: false, error: "Unauthorized: Invalid token", status: 401 };
    }
    const normalizedApi = parseApi(token);
    // make sure api key is valid, based on the api_keys table in supabase
    const { data, error } = await supabase/* supabase_service */.i.from("api_keys").select("*").eq("key", normalizedApi);
    if (error || !data || data.length === 0) {
        return {
            success: false,
            error: "Unauthorized: Invalid token",
            status: 401
        };
    }
    return {
        success: true,
        team_id: data[0].team_id
    };
}


/***/ }),

/***/ 2560:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ supabase_service)
/* harmony export */ });
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2885);
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);

// SupabaseService class initializes the Supabase client conditionally based on environment variables.
class SupabaseService {
    constructor(){
        this.client = null;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceToken = process.env.SUPABASE_SERVICE_TOKEN;
        // Only initialize the Supabase client if both URL and Service Token are provided.
        if (process.env.USE_DB_AUTHENTICATION === "false") {
            // Warn the user that Authentication is disabled by setting the client to null
            console.warn("\x1b[33mAuthentication is disabled. Supabase client will not be initialized.\x1b[0m");
            this.client = null;
        } else if (!supabaseUrl || !supabaseServiceToken) {
            console.error("\x1b[31mSupabase environment variables aren't configured correctly. Supabase client will not be initialized. Fix ENV configuration or disable DB authentication with USE_DB_AUTHENTICATION env variable\x1b[0m");
        } else {
            this.client = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceToken);
        }
    }
    // Provides access to the initialized Supabase client, if available.
    getClient() {
        return this.client;
    }
}
// Using a Proxy to handle dynamic access to the Supabase client or service methods.
// This approach ensures that if Supabase is not configured, any attempt to use it will result in a clear error.
const supabase_service = new Proxy(new SupabaseService(), {
    get: function(target, prop, receiver) {
        const client = target.getClient();
        // If the Supabase client is not initialized, intercept property access to provide meaningful error feedback.
        if (client === null) {
            console.error("Attempted to access Supabase client when it's not configured.");
            return ()=>{
                throw new Error("Supabase client is not configured.");
            };
        }
        // Direct access to SupabaseService properties takes precedence.
        if (prop in target) {
            return Reflect.get(target, prop, receiver);
        }
        // Otherwise, delegate access to the Supabase client.
        return Reflect.get(client, prop, receiver);
    }
});


/***/ }),

/***/ 6327:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ RateLimiterMode)
/* harmony export */ });
var RateLimiterMode;
(function(RateLimiterMode) {
    RateLimiterMode["Crawl"] = "crawl";
    RateLimiterMode["CrawlStatus"] = "crawl-status";
    RateLimiterMode["Scrape"] = "scrape";
    RateLimiterMode["Preview"] = "preview";
    RateLimiterMode["Search"] = "search";
})(RateLimiterMode || (RateLimiterMode = {}));


/***/ })

};
;