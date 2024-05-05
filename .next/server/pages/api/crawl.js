"use strict";
(() => {
var exports = {};
exports.id = 617;
exports.ids = [617,508];
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

/***/ 6555:
/***/ ((module) => {

module.exports = import("uuid");;

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

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 5006:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   crawlController: () => (/* binding */ crawlController)
/* harmony export */ });
/* harmony import */ var _src_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(616);
/* harmony import */ var _src_scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3599);
/* harmony import */ var _src_services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4977);
/* harmony import */ var _src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2380);
/* harmony import */ var _src_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6327);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6473);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_src_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__, _src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_2__]);
([_src_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__, _src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






async function crawlController(req, res) {
    try {
        const { success, team_id, error, status } = await (0,_auth__WEBPACK_IMPORTED_MODULE_4__.authenticateUser)(req, res, _src_types__WEBPACK_IMPORTED_MODULE_3__/* .RateLimiterMode */ .G.Crawl);
        if (!success) {
            return res.status(status).json({
                error
            });
        }
        const { success: creditsCheckSuccess, message: creditsCheckMessage } = await (0,_src_services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_1__/* .checkTeamCredits */ .AK)(team_id, 1);
        if (!creditsCheckSuccess) {
            return res.status(402).json({
                error: "Insufficient credits"
            });
        }
        const url = req.body.url;
        if (!url) {
            return res.status(400).json({
                error: "Url is required"
            });
        }
        if ((0,_src_scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_5__/* .isUrlBlocked */ .k)(url)) {
            return res.status(403).json({
                error: "Firecrawl currently does not support social media scraping due to policy restrictions. We're actively working on building support for it."
            });
        }
        const mode = req.body.mode ?? "crawl";
        const crawlerOptions = req.body.crawlerOptions ?? {};
        const pageOptions = req.body.pageOptions ?? {
            onlyMainContent: false
        };
        if (mode === "single_urls" && !url.includes(",")) {
            try {
                const a = new _src_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_0__/* .WebScraperDataProvider */ .O();
                await a.setOptions({
                    mode: "single_urls",
                    urls: [
                        url
                    ],
                    crawlerOptions: {
                        returnOnlyUrls: true
                    },
                    pageOptions: pageOptions
                });
                const docs = await a.getDocuments(false, (progress)=>{
                    job.progress({
                        current: progress.current,
                        total: progress.total,
                        current_step: "SCRAPING",
                        current_url: progress.currentDocumentUrl
                    });
                });
                return res.json({
                    success: true,
                    documents: docs
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: error.message
                });
            }
        }
        const job = await (0,_src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_2__/* .addWebScraperJob */ .Y)({
            url: url,
            mode: mode ?? "crawl",
            crawlerOptions: {
                ...crawlerOptions
            },
            team_id: team_id,
            pageOptions: pageOptions,
            origin: req.body.origin ?? "api"
        });
        res.json({
            jobId: job.id
        });
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

/***/ 2380:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ addWebScraperJob)
/* harmony export */ });
/* harmony import */ var _queue_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9655);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6555);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([uuid__WEBPACK_IMPORTED_MODULE_1__]);
uuid__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


async function addWebScraperJob(webScraperOptions, options = {}) {
    return await (0,_queue_service__WEBPACK_IMPORTED_MODULE_0__/* .getWebScraperQueue */ ._)().add(webScraperOptions, {
        ...options,
        jobId: (0,uuid__WEBPACK_IMPORTED_MODULE_1__.v4)()
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9655:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  _: () => (/* binding */ getWebScraperQueue)
});

;// CONCATENATED MODULE: external "bull"
const external_bull_namespaceObject = require("bull");
var external_bull_default = /*#__PURE__*/__webpack_require__.n(external_bull_namespaceObject);
;// CONCATENATED MODULE: ./src/services/queue-service.ts

let webScraperQueue;
function getWebScraperQueue() {
    if (!webScraperQueue) {
        webScraperQueue = new (external_bull_default())("web-scraper", process.env.REDIS_URL, {
            settings: {
                lockDuration: 4 * 60 * 60 * 1000,
                lockRenewTime: 30 * 60 * 1000
            }
        });
        console.log("Web scraper queue created");
    }
    return webScraperQueue;
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [473,488], () => (__webpack_exec__(5006)));
module.exports = __webpack_exports__;

})();