"use strict";
(() => {
var exports = {};
exports.id = 713;
exports.ids = [713,508];
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

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 8449:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  v: () => (/* binding */ numTokensFromString)
});

;// CONCATENATED MODULE: external "@dqbd/tiktoken"
const tiktoken_namespaceObject = require("@dqbd/tiktoken");
;// CONCATENATED MODULE: ./src/lib/LLM-extraction/helpers.ts

// This function calculates the number of tokens in a text string using GPT-3.5-turbo model
function numTokensFromString(message, model) {
    const encoder = (0,tiktoken_namespaceObject.encoding_for_model)(model);
    // Encode the message into tokens
    const tokens = encoder.encode(message);
    // Free the encoder resources after use
    encoder.free();
    // Return the number of tokens
    return tokens.length;
}


/***/ }),

/***/ 2872:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   scrapeHelper: () => (/* binding */ scrapeHelper)
/* harmony export */ });
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6473);
/* harmony import */ var _lib_LLM_extraction_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8449);
/* harmony import */ var _scraper_WebScraper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(616);
/* harmony import */ var _scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3599);
/* harmony import */ var _services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4977);
/* harmony import */ var _services_logging_log_job__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4393);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6327);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_2__]);
_scraper_WebScraper__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







async function scrapeHelper(req, team_id, crawlerOptions, pageOptions, extractorOptions) {
    const url = req.body.url;
    if (!url) {
        return {
            success: false,
            error: "Url is required",
            returnCode: 400
        };
    }
    if ((0,_scraper_WebScraper_utils_blocklist__WEBPACK_IMPORTED_MODULE_6__/* .isUrlBlocked */ .k)(url)) {
        return {
            success: false,
            error: "Firecrawl currently does not support social media scraping due to policy restrictions. We're actively working on building support for it.",
            returnCode: 403
        };
    }
    const a = new _scraper_WebScraper__WEBPACK_IMPORTED_MODULE_2__/* .WebScraperDataProvider */ .O();
    await a.setOptions({
        mode: "single_urls",
        urls: [
            url
        ],
        crawlerOptions: {
            ...crawlerOptions
        },
        pageOptions: pageOptions,
        extractorOptions: extractorOptions
    });
    const docs = await a.getDocuments(false);
    // make sure doc.content is not empty
    const filteredDocs = docs.filter((doc)=>doc.content && doc.content.trim().length > 0);
    if (filteredDocs.length === 0) {
        return {
            success: true,
            error: "No page found",
            returnCode: 200
        };
    }
    let creditsToBeBilled = filteredDocs.length;
    const creditsPerLLMExtract = 5;
    if (extractorOptions.mode === "llm-extraction") {
        creditsToBeBilled = creditsToBeBilled + creditsPerLLMExtract * filteredDocs.length;
    }
    const billingResult = await (0,_services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_3__/* .billTeam */ .Nh)(team_id, creditsToBeBilled);
    if (!billingResult.success) {
        return {
            success: false,
            error: "Failed to bill team. Insufficient credits or subscription not found.",
            returnCode: 402
        };
    }
    return {
        success: true,
        data: filteredDocs[0],
        returnCode: 200
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{
    try {
        // make sure to authenticate user first, Bearer <token>
        const { success, team_id, error, status } = await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.authenticateUser)(req, res, _types__WEBPACK_IMPORTED_MODULE_5__/* .RateLimiterMode */ .G.Scrape);
        if (!success) {
            return res.status(status).json({
                error
            });
        }
        const crawlerOptions = req.body.crawlerOptions ?? {};
        const pageOptions = req.body.pageOptions ?? {
            onlyMainContent: false
        };
        const extractorOptions = req.body.extractorOptions ?? {
            mode: "markdown"
        };
        const origin = req.body.origin ?? "api";
        try {
            const { success: creditsCheckSuccess, message: creditsCheckMessage } = await (0,_services_billing_credit_billing__WEBPACK_IMPORTED_MODULE_3__/* .checkTeamCredits */ .AK)(team_id, 1);
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
        const result = await scrapeHelper(req, team_id, crawlerOptions, pageOptions, extractorOptions);
        const endTime = new Date().getTime();
        const timeTakenInSeconds = (endTime - startTime) / 1000;
        const numTokens = result.data && result.data.markdown ? (0,_lib_LLM_extraction_helpers__WEBPACK_IMPORTED_MODULE_1__/* .numTokensFromString */ .v)(result.data.markdown, "gpt-3.5-turbo") : 0;
        (0,_services_logging_log_job__WEBPACK_IMPORTED_MODULE_4__/* .logJob */ .m)({
            success: result.success,
            message: result.error,
            num_docs: 1,
            docs: [
                result.data
            ],
            time_taken: timeTakenInSeconds,
            team_id: team_id,
            mode: "scrape",
            url: req.body.url,
            crawlerOptions: crawlerOptions,
            pageOptions: pageOptions,
            origin: origin,
            extractor_options: extractorOptions,
            num_tokens: numTokens
        });
        return res.status(result.returnCode).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [473,488,393], () => (__webpack_exec__(2872)));
module.exports = __webpack_exports__;

})();