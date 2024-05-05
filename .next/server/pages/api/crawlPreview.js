"use strict";
(() => {
var exports = {};
exports.id = 860;
exports.ids = [860,508];
exports.modules = {

/***/ 2885:
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ 298:
/***/ ((module) => {

module.exports = require("rate-limiter-flexible");

/***/ }),

/***/ 7773:
/***/ ((module) => {

module.exports = require("redis");

/***/ }),

/***/ 6555:
/***/ ((module) => {

module.exports = import("uuid");;

/***/ }),

/***/ 9601:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   crawlPreviewController: () => (/* binding */ crawlPreviewController)
/* harmony export */ });
/* harmony import */ var _src_scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3599);
/* harmony import */ var _src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2380);
/* harmony import */ var _src_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6327);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6473);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_0__]);
_src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




async function crawlPreviewController(req, res) {
    try {
        const { success, team_id, error, status } = await (0,_auth__WEBPACK_IMPORTED_MODULE_2__.authenticateUser)(req, res, _src_types__WEBPACK_IMPORTED_MODULE_1__/* .RateLimiterMode */ .G.Preview);
        if (!success) {
            return res.status(status).json({
                error
            });
        }
        // authenticate on supabase
        const url = req.body.url;
        if (!url) {
            return res.status(400).json({
                error: "Url is required"
            });
        }
        if ((0,_src_scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_3__/* .isUrlBlocked */ .k)(url)) {
            return res.status(403).json({
                error: "Firecrawl currently does not support social media scraping due to policy restrictions. We're actively working on building support for it."
            });
        }
        const mode = req.body.mode ?? "crawl";
        const crawlerOptions = req.body.crawlerOptions ?? {};
        const pageOptions = req.body.pageOptions ?? {
            onlyMainContent: false
        };
        const job = await (0,_src_services_queue_jobs__WEBPACK_IMPORTED_MODULE_0__/* .addWebScraperJob */ .Y)({
            url: url,
            mode: mode ?? "crawl",
            crawlerOptions: {
                ...crawlerOptions,
                limit: 5,
                maxCrawledLinks: 5
            },
            team_id: "preview",
            pageOptions: pageOptions,
            origin: "website-preview"
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

/***/ 3599:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ isUrlBlocked)
/* harmony export */ });
const socialMediaBlocklist = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "linkedin.com",
    "pinterest.com",
    "snapchat.com",
    "tiktok.com",
    "reddit.com",
    "tumblr.com",
    "flickr.com",
    "whatsapp.com",
    "wechat.com",
    "telegram.org"
];
const allowedUrls = [
    "linkedin.com/pulse"
];
function isUrlBlocked(url) {
    if (allowedUrls.some((allowedUrl)=>url.includes(allowedUrl))) {
        return false;
    }
    return socialMediaBlocklist.some((domain)=>url.includes(domain));
}


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
var __webpack_exports__ = __webpack_require__.X(0, [473], () => (__webpack_exec__(9601)));
module.exports = __webpack_exports__;

})();