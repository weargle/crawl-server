"use strict";
exports.id = 393;
exports.ids = [393];
exports.modules = {

/***/ 4393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ logJob)
/* harmony export */ });
/* harmony import */ var _supabase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2560);
/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1081);
/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv_config__WEBPACK_IMPORTED_MODULE_1__);


async function logJob(job) {
    try {
        // Only log jobs in production
        if (process.env.ENV !== "production") {
            return;
        }
        const { data, error } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("firecrawl_jobs").insert([
            {
                success: job.success,
                message: job.message,
                num_docs: job.num_docs,
                docs: job.docs,
                time_taken: job.time_taken,
                team_id: job.team_id === "preview" ? null : job.team_id,
                mode: job.mode,
                url: job.url,
                crawler_options: job.crawlerOptions,
                page_options: job.pageOptions,
                origin: job.origin,
                extractor_options: job.extractor_options,
                num_tokens: job.num_tokens
            }
        ]);
        if (error) {
            console.error("Error logging job:\n", error);
        }
    } catch (error) {
        console.error("Error logging job:\n", error);
    }
}


/***/ })

};
;