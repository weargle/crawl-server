"use strict";
(() => {
var exports = {};
exports.id = 198;
exports.ids = [198,508];
exports.modules = {

/***/ 2885:
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ 5888:
/***/ ((module) => {

module.exports = require("ajv");

/***/ }),

/***/ 5001:
/***/ ((module) => {

module.exports = require("async");

/***/ }),

/***/ 5142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 1081:
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ 8941:
/***/ ((module) => {

module.exports = require("form-data");

/***/ }),

/***/ 1495:
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),

/***/ 7569:
/***/ ((module) => {

module.exports = require("joplin-turndown-plugin-gfm");

/***/ }),

/***/ 3118:
/***/ ((module) => {

module.exports = require("openai");

/***/ }),

/***/ 4193:
/***/ ((module) => {

module.exports = require("pdf-parse");

/***/ }),

/***/ 298:
/***/ ((module) => {

module.exports = require("rate-limiter-flexible");

/***/ }),

/***/ 7773:
/***/ ((module) => {

module.exports = require("redis");

/***/ }),

/***/ 8249:
/***/ ((module) => {

module.exports = require("robots-parser");

/***/ }),

/***/ 6219:
/***/ ((module) => {

module.exports = require("scrapingbee");

/***/ }),

/***/ 2908:
/***/ ((module) => {

module.exports = require("turndown");

/***/ }),

/***/ 855:
/***/ ((module) => {

module.exports = require("xml2js");

/***/ }),

/***/ 7174:
/***/ ((module) => {

module.exports = import("@anthropic-ai/sdk");;

/***/ }),

/***/ 9648:
/***/ ((module) => {

module.exports = import("axios");;

/***/ }),

/***/ 295:
/***/ ((module) => {

module.exports = import("cheerio");;

/***/ }),

/***/ 2079:
/***/ ((module) => {

module.exports = import("openai");;

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 7561:
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 3477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 8120:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ SearchResult)
/* harmony export */ });
/* unused harmony export Document */
class Document {
    constructor(data){
        if (!data.content) {
            throw new Error("Missing required fields");
        }
        this.content = data.content;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.type = data.type || "unknown";
        this.metadata = data.metadata || {
            sourceURL: ""
        };
        this.markdown = data.markdown || "";
        this.childrenLinks = data.childrenLinks || undefined;
        this.provider = data.provider || undefined;
    }
}
class SearchResult {
    constructor(url, title, description){
        this.url = url;
        this.title = title;
        this.description = description;
    }
    toString() {
        return `SearchResult(url=${this.url}, title=${this.title}, description=${this.description})`;
    }
}


/***/ }),

/***/ 7584:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ searchController),
/* harmony export */   searchHelper: () => (/* binding */ searchHelper)
/* harmony export */ });
/* harmony import */ var _scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(616);
/* harmony import */ var _services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4977);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6473);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6327);
/* harmony import */ var _services_logging_log_job__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4393);
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1376);
/* harmony import */ var _scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3599);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__, _search__WEBPACK_IMPORTED_MODULE_5__]);
([_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__, _search__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







async function searchHelper(req, team_id, crawlerOptions, pageOptions, searchOptions) {
    const query = req.body.query;
    const advanced = false;
    if (!query) {
        return {
            success: false,
            error: "Query is required",
            returnCode: 400
        };
    }
    const tbs = searchOptions.tbs ?? null;
    const filter = searchOptions.filter ?? null;
    let res = await (0,_search__WEBPACK_IMPORTED_MODULE_5__/* .search */ .y)({
        query: query,
        advanced: advanced,
        num_results: searchOptions.limit ?? 7,
        tbs: tbs,
        filter: filter,
        lang: searchOptions.lang ?? "en",
        country: searchOptions.country ?? "us",
        location: searchOptions.location
    });
    let justSearch = pageOptions.fetchPageContent === false;
    if (justSearch) {
        return {
            success: true,
            data: res,
            returnCode: 200
        };
    }
    res = res.filter((r)=>!(0,_scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_6__/* .isUrlBlocked */ .k)(r.url));
    if (res.length === 0) {
        return {
            success: true,
            error: "No search results found",
            returnCode: 200
        };
    }
    // filter out social media links
    const a = new _scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__/* .WebScraperDataProvider */ .O();
    await a.setOptions({
        mode: "single_urls",
        urls: res.map((r)=>r.url),
        crawlerOptions: {
            ...crawlerOptions
        },
        pageOptions: {
            ...pageOptions,
            onlyMainContent: pageOptions?.onlyMainContent ?? true,
            fetchPageContent: pageOptions?.fetchPageContent ?? true,
            fallback: false
        }
    });
    const docs = await a.getDocuments(true);
    if (docs.length === 0) {
        return {
            success: true,
            error: "No search results found",
            returnCode: 200
        };
    }
    // make sure doc.content is not empty
    const filteredDocs = docs.filter((doc)=>doc.content && doc.content.trim().length > 0);
    if (filteredDocs.length === 0) {
        return {
            success: true,
            error: "No page found",
            returnCode: 200
        };
    }
    const billingResult = await (0,_services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_1__/* .billTeam */ .Nh)(team_id, filteredDocs.length);
    if (!billingResult.success) {
        return {
            success: false,
            error: "Failed to bill team. Insufficient credits or subscription not found.",
            returnCode: 402
        };
    }
    return {
        success: true,
        data: filteredDocs,
        returnCode: 200
    };
}
async function searchController(req, res) {
    try {
        // make sure to authenticate user first, Bearer <token>
        const { success, team_id, error, status } = await (0,_auth__WEBPACK_IMPORTED_MODULE_2__.authenticateUser)(req, res, _types__WEBPACK_IMPORTED_MODULE_3__/* .RateLimiterMode */ .G.Search);
        if (!success) {
            return res.status(status).json({
                error
            });
        }
        const crawlerOptions = req.body.crawlerOptions ?? {};
        const pageOptions = req.body.pageOptions ?? {
            onlyMainContent: true,
            fetchPageContent: true,
            fallback: false
        };
        const origin = req.body.origin ?? "api";
        const searchOptions = req.body.searchOptions ?? {
            limit: 7
        };
        try {
            const { success: creditsCheckSuccess, message: creditsCheckMessage } = await (0,_services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_1__/* .checkTeamCredits */ .AK)(team_id, 1);
            if (!creditsCheckSuccess) {
                return res.status(402).json({
                    error: "Insufficient credits"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
        const startTime = new Date().getTime();
        const result = await searchHelper(req, team_id, crawlerOptions, pageOptions, searchOptions);
        const endTime = new Date().getTime();
        const timeTakenInSeconds = (endTime - startTime) / 1000;
        (0,_services_logging_log_job__WEBPACK_IMPORTED_MODULE_4__/* .logJob */ .m)({
            success: result.success,
            message: result.error,
            num_docs: result.data.length,
            docs: result.data,
            time_taken: timeTakenInSeconds,
            team_id: team_id,
            mode: "search",
            url: req.body.query,
            crawlerOptions: crawlerOptions,
            pageOptions: pageOptions,
            origin: origin
        });
        return res.status(result.returnCode).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4557:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ google_search)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(295);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3477);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(querystring__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_lib_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8120);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, cheerio__WEBPACK_IMPORTED_MODULE_1__]);
([axios__WEBPACK_IMPORTED_MODULE_0__, cheerio__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




const _useragent_list = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0"
];
function get_useragent() {
    return _useragent_list[Math.floor(Math.random() * _useragent_list.length)];
}
async function _req(term, results, lang, country, start, proxies, timeout, tbs = null, filter = null) {
    const params = {
        "q": term,
        "num": results,
        "hl": lang,
        "gl": country,
        "start": start
    };
    if (tbs) {
        params["tbs"] = tbs;
    }
    if (filter) {
        params["filter"] = filter;
    }
    try {
        const resp = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get("https://www.google.com/search", {
            headers: {
                "User-Agent": get_useragent()
            },
            params: params,
            proxy: proxies,
            timeout: timeout
        });
        return resp;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            throw new Error("Google Search: Too many requests, try again later.");
        }
        throw error;
    }
}
async function google_search(term, advanced = false, num_results = 7, tbs = null, filter = null, lang = "en", country = "us", proxy = null, sleep_interval = 0, timeout = 5000) {
    const escaped_term = querystring__WEBPACK_IMPORTED_MODULE_2__.escape(term);
    let proxies = null;
    if (proxy) {
        if (proxy.startsWith("https")) {
            proxies = {
                "https": proxy
            };
        } else {
            proxies = {
                "http": proxy
            };
        }
    }
    // TODO: knowledge graph, answer box, etc.
    let start = 0;
    let results = [];
    let attempts = 0;
    const maxAttempts = 20; // Define a maximum number of attempts to prevent infinite loop
    while(start < num_results && attempts < maxAttempts){
        try {
            const resp = await _req(escaped_term, num_results - start, lang, country, start, proxies, timeout, tbs, filter);
            const $ = cheerio__WEBPACK_IMPORTED_MODULE_1__.load(resp.data);
            const result_block = $("div.g");
            if (result_block.length === 0) {
                start += 1;
                attempts += 1;
            } else {
                attempts = 0; // Reset attempts if we have results
            }
            result_block.each((index, element)=>{
                const linkElement = $(element).find("a");
                const link = linkElement && linkElement.attr("href") ? linkElement.attr("href") : null;
                const title = $(element).find("h3");
                const ogImage = $(element).find("img").eq(1).attr("src");
                const description_box = $(element).find("div[style='-webkit-line-clamp:2']");
                const answerBox = $(element).find(".mod").text();
                if (description_box) {
                    const description = description_box.text();
                    if (link && title && description) {
                        start += 1;
                        results.push(new _src_lib_entities__WEBPACK_IMPORTED_MODULE_3__/* .SearchResult */ .l(link, title.text(), description));
                    }
                }
            });
            await new Promise((resolve)=>setTimeout(resolve, sleep_interval * 1000));
        } catch (error) {
            if (error.message === "Too many requests") {
                console.warn("Too many requests, breaking the loop");
                break;
            }
            throw error;
        }
        if (start === 0) {
            return results;
        }
    }
    if (attempts >= maxAttempts) {
        console.warn("Max attempts reached, breaking the loop");
    }
    return results;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1376:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   y: () => (/* binding */ search)
/* harmony export */ });
/* harmony import */ var _googlesearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4557);
/* harmony import */ var _serper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7364);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_googlesearch__WEBPACK_IMPORTED_MODULE_0__, _serper__WEBPACK_IMPORTED_MODULE_1__]);
([_googlesearch__WEBPACK_IMPORTED_MODULE_0__, _serper__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


async function search({ query, advanced = false, num_results = 7, tbs = null, filter = null, lang = "en", country = "us", location = undefined, proxy = null, sleep_interval = 0, timeout = 5000 }) {
    try {
        if (process.env.SERPER_API_KEY) {
            return await (0,_serper__WEBPACK_IMPORTED_MODULE_1__/* .serper_search */ .a)(query, {
                num_results,
                tbs,
                filter,
                lang,
                country,
                location
            });
        }
        return await (0,_googlesearch__WEBPACK_IMPORTED_MODULE_0__/* .google_search */ .T)(query, advanced, num_results, tbs, filter, lang, country, proxy, sleep_interval, timeout);
    } catch (error) {
        console.error("Error in search function: ", error);
        return [];
    }
// if process.env.SERPER_API_KEY is set, use serper
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7364:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ serper_search)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5142);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


dotenv__WEBPACK_IMPORTED_MODULE_1___default().config();
async function serper_search(q, options) {
    let data = JSON.stringify({
        q: q,
        hl: options.lang,
        gl: options.country,
        location: options.location,
        tbs: options.tbs,
        num: options.num_results,
        page: options.page ?? 1
    });
    let config = {
        method: "POST",
        url: "https://google.serper.dev/search",
        headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json"
        },
        data: data
    };
    const response = await (0,axios__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    if (response && response.data && Array.isArray(response.data.organic)) {
        return response.data.organic.map((a)=>({
                url: a.link,
                title: a.title,
                description: a.snippet
            }));
    } else {
        return [];
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [473,488,393], () => (__webpack_exec__(7584)));
module.exports = __webpack_exports__;

})();