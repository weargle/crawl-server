"use strict";
(() => {
var exports = {};
exports.id = 702;
exports.ids = [702];
exports.modules = {

/***/ 222:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   crawlJobStatusPreviewController: () => (/* binding */ crawlJobStatusPreviewController)
/* harmony export */ });
/* harmony import */ var _src_services_queue_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9655);

async function crawlJobStatusPreviewController(req, res) {
    try {
        const job = await (0,_src_services_queue_service__WEBPACK_IMPORTED_MODULE_0__/* .getWebScraperQueue */ ._)().getJob(req.query.jobId);
        if (!job) {
            return res.status(404).json({
                error: "Job not found"
            });
        }
        const { current, current_url, total, current_step } = await job.progress();
        res.json({
            status: await job.getState(),
            // progress: job.progress(),
            current: current,
            current_url: current_url,
            current_step: current_step,
            total: total,
            data: job.returnvalue
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
}


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
var __webpack_exports__ = (__webpack_exec__(222));
module.exports = __webpack_exports__;

})();