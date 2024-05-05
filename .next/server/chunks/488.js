"use strict";
exports.id = 488;
exports.ids = [488];
exports.modules = {

/***/ 9112:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ generateCompletions)
/* harmony export */ });
/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2079);
/* harmony import */ var ajv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5888);
/* harmony import */ var ajv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ajv__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3978);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([openai__WEBPACK_IMPORTED_MODULE_0__]);
openai__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const ajv = new (ajv__WEBPACK_IMPORTED_MODULE_1___default())(); // Initialize AJV for JSON schema validation

// Generate completion using OpenAI
async function generateCompletions(documents, extractionOptions) {
    // const schema = zodToJsonSchema(options.schema)
    const schema = extractionOptions.extractionSchema;
    const prompt = extractionOptions.extractionPrompt;
    const switchVariable = "openAI"; // Placholder, want to think more about how we abstract the model provider
    const completions = await Promise.all(documents.map(async (document)=>{
        switch(switchVariable){
            case "openAI":
                const llm = new openai__WEBPACK_IMPORTED_MODULE_0__["default"]();
                try {
                    const completionResult = await (0,_models__WEBPACK_IMPORTED_MODULE_2__/* .generateOpenAICompletions */ .R)({
                        client: llm,
                        document: document,
                        schema: schema,
                        prompt: prompt
                    });
                    // Validate the JSON output against the schema using AJV
                    const validate = ajv.compile(schema);
                    if (!validate(completionResult.llm_extraction)) {
                        //TODO: add Custom Error handling middleware that bubbles this up with proper Error code, etc.
                        throw new Error(`JSON parsing error(s): ${validate.errors?.map((err)=>err.message).join(", ")}\n\nLLM extraction did not match the extraction schema you provided. This could be because of a model hallucination, or an Error on our side. Try adjusting your prompt, and if it doesn't work reach out to support.`);
                    }
                    return completionResult;
                } catch (error) {
                    console.error(`Error generating completions: ${error}`);
                    throw new Error(`Error generating completions: ${error.message}`);
                }
            default:
                throw new Error("Invalid client");
        }
    }));
    return completions;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3978:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ generateOpenAICompletions)
/* harmony export */ });
const defaultPrompt = "You are a professional web scraper. Extract the contents of the webpage";
function prepareOpenAIDoc(document) {
    // Check if the markdown content exists in the document
    if (!document.markdown) {
        throw new Error("Markdown content is missing in the document. This is likely due to an error in the scraping process. Please try again or reach out to help@mendable.ai");
    }
    return [
        {
            type: "text",
            text: document.markdown
        }
    ];
}
async function generateOpenAICompletions({ client, model = "gpt-4-turbo", document, schema, prompt = defaultPrompt, temperature }) {
    const openai = client;
    const content = prepareOpenAIDoc(document);
    const completion = await openai.chat.completions.create({
        model,
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content
            }
        ],
        tools: [
            {
                type: "function",
                function: {
                    name: "extract_content",
                    description: "Extracts the content from the given webpage(s)",
                    parameters: schema
                }
            }
        ],
        tool_choice: {
            "type": "function",
            "function": {
                "name": "extract_content"
            }
        },
        temperature
    });
    const c = completion.choices[0].message.tool_calls[0].function.arguments;
    // Extract the LLM extraction content from the completion response
    const llmExtraction = JSON.parse(c);
    // Return the document with the LLM extraction content added
    return {
        ...document,
        llm_extraction: llmExtraction
    };
}


/***/ }),

/***/ 2444:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ parseMarkdown)
/* harmony export */ });
function parseMarkdown(html) {
    var TurndownService = __webpack_require__(2908);
    var turndownPluginGfm = __webpack_require__(7569);
    const turndownService = new TurndownService();
    turndownService.addRule("inlineLink", {
        filter: function(node, options) {
            return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
        },
        replacement: function(content, node) {
            var href = node.getAttribute("href").trim();
            var title = node.title ? ' "' + node.title + '"' : "";
            return "[" + content.trim() + "](" + href + title + ")\n";
        }
    });
    var gfm = turndownPluginGfm.gfm;
    turndownService.use(gfm);
    let markdownContent = turndownService.turndown(html);
    // multiple line links
    let insideLinkContent = false;
    let newMarkdownContent = "";
    let linkOpenCount = 0;
    for(let i = 0; i < markdownContent.length; i++){
        const char = markdownContent[i];
        if (char == "[") {
            linkOpenCount++;
        } else if (char == "]") {
            linkOpenCount = Math.max(0, linkOpenCount - 1);
        }
        insideLinkContent = linkOpenCount > 0;
        if (insideLinkContent && char == "\n") {
            newMarkdownContent += "\\" + "\n";
        } else {
            newMarkdownContent += char;
        }
    }
    markdownContent = newMarkdownContent;
    // Remove [Skip to Content](#page) and [Skip to content](#skip)
    markdownContent = markdownContent.replace(/\[Skip to Content\]\(#[^\)]*\)/gi, "");
    return markdownContent;
}


/***/ }),

/***/ 9485:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ WebCrawler)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(295);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7310);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _sitemap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6589);
/* harmony import */ var async__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5001);
/* harmony import */ var async__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(async__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _single_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(803);
/* harmony import */ var robots_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8249);
/* harmony import */ var robots_parser__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(robots_parser__WEBPACK_IMPORTED_MODULE_6__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, cheerio__WEBPACK_IMPORTED_MODULE_1__, _sitemap__WEBPACK_IMPORTED_MODULE_3__, _single_url__WEBPACK_IMPORTED_MODULE_5__]);
([axios__WEBPACK_IMPORTED_MODULE_0__, cheerio__WEBPACK_IMPORTED_MODULE_1__, _sitemap__WEBPACK_IMPORTED_MODULE_3__, _single_url__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







class WebCrawler {
    constructor({ initialUrl, includes, excludes, maxCrawledLinks, limit = 10000, generateImgAltText = false }){
        this.visited = new Set();
        this.crawledUrls = new Set();
        this.initialUrl = initialUrl;
        this.baseUrl = new url__WEBPACK_IMPORTED_MODULE_2__.URL(initialUrl).origin;
        this.includes = includes ?? [];
        this.excludes = excludes ?? [];
        this.limit = limit;
        this.robotsTxtUrl = `${this.baseUrl}/robots.txt`;
        this.robots = robots_parser__WEBPACK_IMPORTED_MODULE_6___default()(this.robotsTxtUrl, "");
        // Deprecated, use limit instead
        this.maxCrawledLinks = maxCrawledLinks ?? limit;
        this.generateImgAltText = generateImgAltText ?? false;
    }
    filterLinks(sitemapLinks, limit) {
        return sitemapLinks.filter((link)=>{
            const url = new url__WEBPACK_IMPORTED_MODULE_2__.URL(link);
            const path = url.pathname;
            // Check if the link should be excluded
            if (this.excludes.length > 0 && this.excludes[0] !== "") {
                if (this.excludes.some((excludePattern)=>new RegExp(excludePattern).test(path))) {
                    return false;
                }
            }
            // Check if the link matches the include patterns, if any are specified
            if (this.includes.length > 0 && this.includes[0] !== "") {
                return this.includes.some((includePattern)=>new RegExp(includePattern).test(path));
            }
            const isAllowed = this.robots.isAllowed(link, "FireCrawlAgent") ?? true;
            // Check if the link is disallowed by robots.txt
            if (!isAllowed) {
                console.log(`Link disallowed by robots.txt: ${link}`);
                return false;
            }
            return true;
        }).slice(0, limit);
    }
    async start(inProgress, concurrencyLimit = 5, limit = 10000) {
        // Fetch and parse robots.txt
        try {
            const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(this.robotsTxtUrl);
            this.robots = robots_parser__WEBPACK_IMPORTED_MODULE_6___default()(this.robotsTxtUrl, response.data);
        } catch (error) {
            console.error(`Failed to fetch robots.txt from ${this.robotsTxtUrl}`);
        }
        const sitemapLinks = await this.tryFetchSitemapLinks(this.initialUrl);
        if (sitemapLinks.length > 0) {
            const filteredLinks = this.filterLinks(sitemapLinks, limit);
            return filteredLinks;
        }
        const urls = await this.crawlUrls([
            this.initialUrl
        ], concurrencyLimit, inProgress);
        if (urls.length === 0 && this.filterLinks([
            this.initialUrl
        ], limit).length > 0) {
            return [
                this.initialUrl
            ];
        }
        // make sure to run include exclude here again
        return this.filterLinks(urls, limit);
    }
    async crawlUrls(urls, concurrencyLimit, inProgress) {
        const queue = async__WEBPACK_IMPORTED_MODULE_4___default().queue(async (task, callback)=>{
            if (this.crawledUrls.size >= this.maxCrawledLinks) {
                if (callback && typeof callback === "function") {
                    callback();
                }
                return;
            }
            const newUrls = await this.crawl(task);
            newUrls.forEach((url)=>this.crawledUrls.add(url));
            if (inProgress && newUrls.length > 0) {
                inProgress({
                    current: this.crawledUrls.size,
                    total: this.maxCrawledLinks,
                    status: "SCRAPING",
                    currentDocumentUrl: newUrls[newUrls.length - 1]
                });
            } else if (inProgress) {
                inProgress({
                    current: this.crawledUrls.size,
                    total: this.maxCrawledLinks,
                    status: "SCRAPING",
                    currentDocumentUrl: task
                });
            }
            await this.crawlUrls(newUrls, concurrencyLimit, inProgress);
            if (callback && typeof callback === "function") {
                callback();
            }
        }, concurrencyLimit);
        queue.push(urls.filter((url)=>!this.visited.has(url) && this.robots.isAllowed(url, "FireCrawlAgent")), (err)=>{
            if (err) console.error(err);
        });
        await queue.drain();
        return Array.from(this.crawledUrls);
    }
    async crawl(url) {
        if (this.visited.has(url) || !this.robots.isAllowed(url, "FireCrawlAgent")) return [];
        this.visited.add(url);
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }
        if (this.isFile(url) || this.isSocialMediaOrEmail(url)) {
            return [];
        }
        try {
            let content;
            // If it is the first link, fetch with scrapingbee
            if (this.visited.size === 1) {
                content = await (0,_single_url__WEBPACK_IMPORTED_MODULE_5__/* .scrapWithScrapingBee */ .g_)(url, "load");
            } else {
                const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(url);
                content = response.data;
            }
            const $ = (0,cheerio__WEBPACK_IMPORTED_MODULE_1__.load)(content);
            let links = [];
            $("a").each((_, element)=>{
                const href = $(element).attr("href");
                if (href) {
                    let fullUrl = href;
                    if (!href.startsWith("http")) {
                        fullUrl = new url__WEBPACK_IMPORTED_MODULE_2__.URL(href, this.baseUrl).toString();
                    }
                    const url = new url__WEBPACK_IMPORTED_MODULE_2__.URL(fullUrl);
                    const path = url.pathname;
                    if (// fullUrl.startsWith(this.initialUrl) && // this condition makes it stop crawling back the url
                    this.isInternalLink(fullUrl) && this.matchesPattern(fullUrl) && this.noSections(fullUrl) && this.matchesIncludes(path) && !this.matchesExcludes(path) && this.robots.isAllowed(fullUrl, "FireCrawlAgent")) {
                        links.push(fullUrl);
                    }
                }
            });
            return links.filter((link)=>!this.visited.has(link));
        } catch (error) {
            return [];
        }
    }
    matchesIncludes(url) {
        if (this.includes.length === 0 || this.includes[0] == "") return true;
        return this.includes.some((pattern)=>new RegExp(pattern).test(url));
    }
    matchesExcludes(url) {
        if (this.excludes.length === 0 || this.excludes[0] == "") return false;
        return this.excludes.some((pattern)=>new RegExp(pattern).test(url));
    }
    noSections(link) {
        return !link.includes("#");
    }
    isInternalLink(link) {
        const urlObj = new url__WEBPACK_IMPORTED_MODULE_2__.URL(link, this.baseUrl);
        const domainWithoutProtocol = this.baseUrl.replace(/^https?:\/\//, "");
        return urlObj.hostname === domainWithoutProtocol;
    }
    matchesPattern(link) {
        return true; // Placeholder for future pattern matching implementation
    }
    isFile(url) {
        const fileExtensions = [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".css",
            ".js",
            ".ico",
            ".svg",
            // ".pdf", 
            ".zip",
            ".exe",
            ".dmg",
            ".mp4",
            ".mp3",
            ".pptx",
            ".docx",
            ".xlsx",
            ".xml"
        ];
        return fileExtensions.some((ext)=>url.endsWith(ext));
    }
    isSocialMediaOrEmail(url) {
        const socialMediaOrEmail = [
            "facebook.com",
            "twitter.com",
            "linkedin.com",
            "instagram.com",
            "pinterest.com",
            "mailto:"
        ];
        return socialMediaOrEmail.some((ext)=>url.includes(ext));
    }
    async tryFetchSitemapLinks(url) {
        const sitemapUrl = url.endsWith("/sitemap.xml") ? url : `${url}/sitemap.xml`;
        try {
            const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(sitemapUrl);
            if (response.status === 200) {
                return await (0,_sitemap__WEBPACK_IMPORTED_MODULE_3__/* .getLinksFromSitemap */ ._)(sitemapUrl);
            }
        } catch (error) {
        // Error handling for failed sitemap fetch
        }
        return [];
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 616:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ WebScraperDataProvider)
/* harmony export */ });
/* harmony import */ var _single_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(803);
/* harmony import */ var _sitemap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6589);
/* harmony import */ var _crawler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9485);
/* harmony import */ var _services_redis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2025);
/* harmony import */ var _utils_imageDescription__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4325);
/* harmony import */ var _utils_pdfProcessor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8405);
/* harmony import */ var _utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1207);
/* harmony import */ var _lib_LLM_extraction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9112);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_single_url__WEBPACK_IMPORTED_MODULE_0__, _sitemap__WEBPACK_IMPORTED_MODULE_1__, _crawler__WEBPACK_IMPORTED_MODULE_2__, _utils_imageDescription__WEBPACK_IMPORTED_MODULE_4__, _utils_pdfProcessor__WEBPACK_IMPORTED_MODULE_5__, _lib_LLM_extraction__WEBPACK_IMPORTED_MODULE_6__]);
([_single_url__WEBPACK_IMPORTED_MODULE_0__, _sitemap__WEBPACK_IMPORTED_MODULE_1__, _crawler__WEBPACK_IMPORTED_MODULE_2__, _utils_imageDescription__WEBPACK_IMPORTED_MODULE_4__, _utils_pdfProcessor__WEBPACK_IMPORTED_MODULE_5__, _lib_LLM_extraction__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);








class WebScraperDataProvider {
    authorize() {
        throw new Error("Method not implemented.");
    }
    authorizeNango() {
        throw new Error("Method not implemented.");
    }
    async convertUrlsToDocuments(urls, inProgress) {
        const totalUrls = urls.length;
        let processedUrls = 0;
        const results = new Array(urls.length).fill(null);
        for(let i = 0; i < urls.length; i += this.concurrentRequests){
            const batchUrls = urls.slice(i, i + this.concurrentRequests);
            await Promise.all(batchUrls.map(async (url, index)=>{
                const result = await (0,_single_url__WEBPACK_IMPORTED_MODULE_0__/* .scrapSingleUrl */ .Gd)(url, true, this.pageOptions);
                processedUrls++;
                if (inProgress) {
                    inProgress({
                        current: processedUrls,
                        total: totalUrls,
                        status: "SCRAPING",
                        currentDocumentUrl: url
                    });
                }
                results[i + index] = result;
            }));
        }
        return results.filter((result)=>result !== null);
    }
    async getDocuments(useCaching = false, inProgress) {
        if (this.urls[0].trim() === "") {
            throw new Error("Url is required");
        }
        if (!useCaching) {
            if (this.mode === "crawl") {
                const crawler = new _crawler__WEBPACK_IMPORTED_MODULE_2__/* .WebCrawler */ .K({
                    initialUrl: this.urls[0],
                    includes: this.includes,
                    excludes: this.excludes,
                    maxCrawledLinks: this.maxCrawledLinks,
                    limit: this.limit,
                    generateImgAltText: this.generateImgAltText
                });
                let links = await crawler.start(inProgress, 5, this.limit);
                if (this.returnOnlyUrls) {
                    inProgress({
                        current: links.length,
                        total: links.length,
                        status: "COMPLETED",
                        currentDocumentUrl: this.urls[0]
                    });
                    return links.map((url)=>({
                            content: "",
                            markdown: "",
                            metadata: {
                                sourceURL: url
                            }
                        }));
                }
                let pdfLinks = links.filter((link)=>link.endsWith(".pdf"));
                let pdfDocuments = [];
                for (let pdfLink of pdfLinks){
                    const pdfContent = await (0,_utils_pdfProcessor__WEBPACK_IMPORTED_MODULE_5__/* .fetchAndProcessPdf */ .J)(pdfLink);
                    pdfDocuments.push({
                        content: pdfContent,
                        metadata: {
                            sourceURL: pdfLink
                        },
                        provider: "web-scraper"
                    });
                }
                links = links.filter((link)=>!link.endsWith(".pdf"));
                let documents = await this.convertUrlsToDocuments(links, inProgress);
                documents = await this.getSitemapData(this.urls[0], documents);
                if (this.replaceAllPathsWithAbsolutePaths) {
                    documents = (0,_utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__/* .replacePathsWithAbsolutePaths */ .E)(documents);
                } else {
                    documents = (0,_utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__/* .replaceImgPathsWithAbsolutePaths */ .f)(documents);
                }
                if (this.generateImgAltText) {
                    documents = await this.generatesImgAltText(documents);
                }
                documents = documents.concat(pdfDocuments);
                // CACHING DOCUMENTS
                // - parent document
                const cachedParentDocumentString = await (0,_services_redis__WEBPACK_IMPORTED_MODULE_3__/* .getValue */ .NA)("web-scraper-cache:" + this.normalizeUrl(this.urls[0]));
                if (cachedParentDocumentString != null) {
                    let cachedParentDocument = JSON.parse(cachedParentDocumentString);
                    if (!cachedParentDocument.childrenLinks || cachedParentDocument.childrenLinks.length < links.length - 1) {
                        cachedParentDocument.childrenLinks = links.filter((link)=>link !== this.urls[0]);
                        await (0,_services_redis__WEBPACK_IMPORTED_MODULE_3__/* .setValue */ .sO)("web-scraper-cache:" + this.normalizeUrl(this.urls[0]), JSON.stringify(cachedParentDocument), 60 * 60 * 24 * 10); // 10 days
                    }
                } else {
                    let parentDocument = documents.filter((document)=>this.normalizeUrl(document.metadata.sourceURL) === this.normalizeUrl(this.urls[0]));
                    await this.setCachedDocuments(parentDocument, links);
                }
                await this.setCachedDocuments(documents.filter((document)=>this.normalizeUrl(document.metadata.sourceURL) !== this.normalizeUrl(this.urls[0])), []);
                documents = this.removeChildLinks(documents);
                documents = documents.splice(0, this.limit);
                return documents;
            }
            if (this.mode === "single_urls") {
                let pdfLinks = this.urls.filter((link)=>link.endsWith(".pdf"));
                let pdfDocuments = [];
                for (let pdfLink of pdfLinks){
                    const pdfContent = await (0,_utils_pdfProcessor__WEBPACK_IMPORTED_MODULE_5__/* .fetchAndProcessPdf */ .J)(pdfLink);
                    pdfDocuments.push({
                        content: pdfContent,
                        metadata: {
                            sourceURL: pdfLink
                        },
                        provider: "web-scraper"
                    });
                }
                let documents = await this.convertUrlsToDocuments(this.urls.filter((link)=>!link.endsWith(".pdf")), inProgress);
                if (this.replaceAllPathsWithAbsolutePaths) {
                    documents = (0,_utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__/* .replacePathsWithAbsolutePaths */ .E)(documents);
                } else {
                    documents = (0,_utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__/* .replaceImgPathsWithAbsolutePaths */ .f)(documents);
                }
                if (this.generateImgAltText) {
                    documents = await this.generatesImgAltText(documents);
                }
                const baseUrl = new URL(this.urls[0]).origin;
                documents = await this.getSitemapData(baseUrl, documents);
                documents = documents.concat(pdfDocuments);
                if (this.extractorOptions.mode === "llm-extraction") {
                    documents = await (0,_lib_LLM_extraction__WEBPACK_IMPORTED_MODULE_6__/* .generateCompletions */ .M)(documents, this.extractorOptions);
                }
                await this.setCachedDocuments(documents);
                documents = this.removeChildLinks(documents);
                documents = documents.splice(0, this.limit);
                return documents;
            }
            if (this.mode === "sitemap") {
                let links = await (0,_sitemap__WEBPACK_IMPORTED_MODULE_1__/* .getLinksFromSitemap */ ._)(this.urls[0]);
                let pdfLinks = links.filter((link)=>link.endsWith(".pdf"));
                let pdfDocuments = [];
                for (let pdfLink of pdfLinks){
                    const pdfContent = await (0,_utils_pdfProcessor__WEBPACK_IMPORTED_MODULE_5__/* .fetchAndProcessPdf */ .J)(pdfLink);
                    pdfDocuments.push({
                        content: pdfContent,
                        metadata: {
                            sourceURL: pdfLink
                        },
                        provider: "web-scraper"
                    });
                }
                links = links.filter((link)=>!link.endsWith(".pdf"));
                let documents = await this.convertUrlsToDocuments(links.slice(0, this.limit), inProgress);
                documents = await this.getSitemapData(this.urls[0], documents);
                if (this.replaceAllPathsWithAbsolutePaths) {
                    documents = (0,_utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__/* .replacePathsWithAbsolutePaths */ .E)(documents);
                } else {
                    documents = (0,_utils_replacePaths__WEBPACK_IMPORTED_MODULE_7__/* .replaceImgPathsWithAbsolutePaths */ .f)(documents);
                }
                if (this.generateImgAltText) {
                    documents = await this.generatesImgAltText(documents);
                }
                documents = documents.concat(pdfDocuments);
                await this.setCachedDocuments(documents);
                documents = this.removeChildLinks(documents);
                documents = documents.splice(0, this.limit);
                return documents;
            }
            return [];
        }
        let documents = await this.getCachedDocuments(this.urls.slice(0, this.limit));
        if (documents.length < this.limit) {
            const newDocuments = await this.getDocuments(false, inProgress);
            newDocuments.forEach((doc)=>{
                if (!documents.some((d)=>this.normalizeUrl(d.metadata.sourceURL) === this.normalizeUrl(doc.metadata?.sourceURL))) {
                    documents.push(doc);
                }
            });
        }
        documents = this.filterDocsExcludeInclude(documents);
        documents = this.removeChildLinks(documents);
        documents = documents.splice(0, this.limit);
        return documents;
    }
    filterDocsExcludeInclude(documents) {
        return documents.filter((document)=>{
            const url = new URL(document.metadata.sourceURL);
            const path = url.pathname;
            if (this.excludes.length > 0 && this.excludes[0] !== "") {
                // Check if the link should be excluded
                if (this.excludes.some((excludePattern)=>new RegExp(excludePattern).test(path))) {
                    return false;
                }
            }
            if (this.includes.length > 0 && this.includes[0] !== "") {
                // Check if the link matches the include patterns, if any are specified
                if (this.includes.length > 0) {
                    return this.includes.some((includePattern)=>new RegExp(includePattern).test(path));
                }
            }
            return true;
        });
    }
    normalizeUrl(url) {
        if (url.includes("//www.")) {
            return url.replace("//www.", "//");
        }
        return url;
    }
    removeChildLinks(documents) {
        for (let document of documents){
            if (document?.childrenLinks) delete document.childrenLinks;
        }
        return documents;
    }
    async setCachedDocuments(documents, childrenLinks) {
        for (const document of documents){
            if (document.content.trim().length === 0) {
                continue;
            }
            const normalizedUrl = this.normalizeUrl(document.metadata.sourceURL);
            await (0,_services_redis__WEBPACK_IMPORTED_MODULE_3__/* .setValue */ .sO)("web-scraper-cache:" + normalizedUrl, JSON.stringify({
                ...document,
                childrenLinks: childrenLinks || []
            }), 60 * 60 * 24 * 10); // 10 days
        }
    }
    async getCachedDocuments(urls) {
        let documents = [];
        for (const url of urls){
            const normalizedUrl = this.normalizeUrl(url);
            console.log("Getting cached document for web-scraper-cache:" + normalizedUrl);
            const cachedDocumentString = await (0,_services_redis__WEBPACK_IMPORTED_MODULE_3__/* .getValue */ .NA)("web-scraper-cache:" + normalizedUrl);
            if (cachedDocumentString) {
                const cachedDocument = JSON.parse(cachedDocumentString);
                documents.push(cachedDocument);
                // get children documents
                for (const childUrl of cachedDocument.childrenLinks){
                    const normalizedChildUrl = this.normalizeUrl(childUrl);
                    const childCachedDocumentString = await (0,_services_redis__WEBPACK_IMPORTED_MODULE_3__/* .getValue */ .NA)("web-scraper-cache:" + normalizedChildUrl);
                    if (childCachedDocumentString) {
                        const childCachedDocument = JSON.parse(childCachedDocumentString);
                        if (!documents.find((doc)=>doc.metadata.sourceURL === childCachedDocument.metadata.sourceURL)) {
                            documents.push(childCachedDocument);
                        }
                    }
                }
            }
        }
        return documents;
    }
    setOptions(options) {
        if (!options.urls) {
            throw new Error("Urls are required");
        }
        this.urls = options.urls;
        this.mode = options.mode;
        this.concurrentRequests = options.concurrentRequests ?? 20;
        this.includes = options.crawlerOptions?.includes ?? [];
        this.excludes = options.crawlerOptions?.excludes ?? [];
        this.maxCrawledLinks = options.crawlerOptions?.maxCrawledLinks ?? 1000;
        this.returnOnlyUrls = options.crawlerOptions?.returnOnlyUrls ?? false;
        this.limit = options.crawlerOptions?.limit ?? 10000;
        this.generateImgAltText = options.crawlerOptions?.generateImgAltText ?? false;
        this.pageOptions = options.pageOptions ?? {
            onlyMainContent: false
        };
        this.extractorOptions = options.extractorOptions ?? {
            mode: "markdown"
        };
        this.replaceAllPathsWithAbsolutePaths = options.crawlerOptions?.replaceAllPathsWithAbsolutePaths ?? false;
        //! @nicolas, for some reason this was being injected and breakign everything. Don't have time to find source of the issue so adding this check
        this.excludes = this.excludes.filter((item)=>item !== "");
        // make sure all urls start with https://
        this.urls = this.urls.map((url)=>{
            if (!url.trim().startsWith("http")) {
                return `https://${url}`;
            }
            return url;
        });
    }
    async getSitemapData(baseUrl, documents) {
        const sitemapData = await (0,_sitemap__WEBPACK_IMPORTED_MODULE_1__/* .fetchSitemapData */ .r)(baseUrl);
        if (sitemapData) {
            for(let i = 0; i < documents.length; i++){
                const docInSitemapData = sitemapData.find((data)=>this.normalizeUrl(data.loc) === this.normalizeUrl(documents[i].metadata.sourceURL));
                if (docInSitemapData) {
                    let sitemapDocData = {};
                    if (docInSitemapData.changefreq) {
                        sitemapDocData.changefreq = docInSitemapData.changefreq;
                    }
                    if (docInSitemapData.priority) {
                        sitemapDocData.priority = Number(docInSitemapData.priority);
                    }
                    if (docInSitemapData.lastmod) {
                        sitemapDocData.lastmod = docInSitemapData.lastmod;
                    }
                    if (Object.keys(sitemapDocData).length !== 0) {
                        documents[i].metadata.sitemap = sitemapDocData;
                    }
                }
            }
        }
        return documents;
    }
    constructor(){
        this.urls = [
            ""
        ];
        this.mode = "single_urls";
        this.limit = 10000;
        this.concurrentRequests = 20;
        this.generateImgAltText = false;
        this.replaceAllPathsWithAbsolutePaths = false;
        this.generateImgAltTextModel = "gpt-4-turbo";
        this.generatesImgAltText = async (documents)=>{
            await Promise.all(documents.map(async (document)=>{
                const images = document.content.match(/!\[.*?\]\((.*?)\)/g) || [];
                await Promise.all(images.map(async (image)=>{
                    let imageUrl = image.match(/\(([^)]+)\)/)[1];
                    let altText = image.match(/\[(.*?)\]/)[1];
                    if (!altText && !imageUrl.startsWith("data:image") && /\.(png|jpeg|gif|webp)$/.test(imageUrl)) {
                        const imageIndex = document.content.indexOf(image);
                        const contentLength = document.content.length;
                        let backText = document.content.substring(imageIndex + image.length, Math.min(imageIndex + image.length + 1000, contentLength));
                        let frontTextStartIndex = Math.max(imageIndex - 1000, 0);
                        let frontText = document.content.substring(frontTextStartIndex, imageIndex);
                        altText = await (0,_utils_imageDescription__WEBPACK_IMPORTED_MODULE_4__/* .getImageDescription */ .a)(imageUrl, backText, frontText, this.generateImgAltTextModel);
                    }
                    document.content = document.content.replace(image, `![${altText}](${imageUrl})`);
                }));
            }));
            return documents;
        };
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 803:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gd: () => (/* binding */ scrapSingleUrl),
/* harmony export */   g_: () => (/* binding */ scrapWithScrapingBee)
/* harmony export */ });
/* unused harmony exports generateRequestParams, scrapWithCustomFirecrawl, scrapWithPlaywright */
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(295);
/* harmony import */ var scrapingbee__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6219);
/* harmony import */ var scrapingbee__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scrapingbee__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_metadata__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(695);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5142);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_html_to_markdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2444);
/* harmony import */ var _utils_excludeTags__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6663);
/* harmony import */ var _utils_custom_website_params__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1577);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([cheerio__WEBPACK_IMPORTED_MODULE_0__]);
cheerio__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







dotenv__WEBPACK_IMPORTED_MODULE_2___default().config();
async function generateRequestParams(url, wait_browser = "domcontentloaded", timeout = 15000) {
    const defaultParams = {
        url: url,
        params: {
            timeout: timeout,
            wait_browser: wait_browser
        },
        headers: {
            "ScrapingService-Request": "TRUE"
        }
    };
    try {
        const urlKey = new URL(url).hostname;
        if (_utils_custom_website_params__WEBPACK_IMPORTED_MODULE_4__/* .urlSpecificParams */ .Y.hasOwnProperty(urlKey)) {
            return {
                ...defaultParams,
                ..._utils_custom_website_params__WEBPACK_IMPORTED_MODULE_4__/* .urlSpecificParams */ .Y[urlKey]
            };
        } else {
            return defaultParams;
        }
    } catch (error) {
        console.error(`Error generating URL key: ${error}`);
        return defaultParams;
    }
}
async function scrapWithCustomFirecrawl(url, options) {
    try {
        // TODO: merge the custom firecrawl scraper into mono-repo when ready
        return null;
    } catch (error) {
        console.error(`Error scraping with custom firecrawl-scraper: ${error}`);
        return "";
    }
}
async function scrapWithScrapingBee(url, wait_browser = "domcontentloaded", timeout = 15000) {
    try {
        const client = new scrapingbee__WEBPACK_IMPORTED_MODULE_1__.ScrapingBeeClient(process.env.SCRAPING_BEE_API_KEY);
        const clientParams = await generateRequestParams(url, wait_browser, timeout);
        const response = await client.get(clientParams);
        if (response.status !== 200 && response.status !== 404) {
            console.error(`Scraping bee error in ${url} with status code ${response.status}`);
            return "";
        }
        const decoder = new TextDecoder();
        const text = decoder.decode(response.data);
        return text;
    } catch (error) {
        console.error(`Error scraping with Scraping Bee: ${error}`);
        return "";
    }
}
async function scrapWithPlaywright(url) {
    try {
        const response = await fetch(process.env.PLAYWRIGHT_MICROSERVICE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url
            })
        });
        if (!response.ok) {
            console.error(`Error fetching w/ playwright server -> URL: ${url} with status: ${response.status}`);
            return "";
        }
        const data = await response.json();
        const html = data.content;
        return html ?? "";
    } catch (error) {
        console.error(`Error scraping with Puppeteer: ${error}`);
        return "";
    }
}
async function scrapSingleUrl(urlToScrap, toMarkdown = true, pageOptions = {
    onlyMainContent: true
}) {
    urlToScrap = urlToScrap.trim();
    const removeUnwantedElements = (html, pageOptions)=>{
        const soup = cheerio__WEBPACK_IMPORTED_MODULE_0__.load(html);
        soup("script, style, iframe, noscript, meta, head").remove();
        if (pageOptions.onlyMainContent) {
            // remove any other tags that are not in the main content
            _utils_excludeTags__WEBPACK_IMPORTED_MODULE_5__/* .excludeNonMainTags */ .A.forEach((tag)=>{
                soup(tag).remove();
            });
        }
        return soup.html();
    };
    const attemptScraping = async (url, method)=>{
        let text = "";
        switch(method){
            case "firecrawl-scraper":
                text = await scrapWithCustomFirecrawl(url);
                break;
            case "scrapingBee":
                if (process.env.SCRAPING_BEE_API_KEY) {
                    text = await scrapWithScrapingBee(url, "domcontentloaded", pageOptions.fallback === false ? 7000 : 15000);
                }
                break;
            case "playwright":
                if (process.env.PLAYWRIGHT_MICROSERVICE_URL) {
                    text = await scrapWithPlaywright(url);
                }
                break;
            case "scrapingBeeLoad":
                if (process.env.SCRAPING_BEE_API_KEY) {
                    text = await scrapWithScrapingBee(url, "networkidle2");
                }
                break;
            case "fetch":
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.error(`Error fetching URL: ${url} with status: ${response.status}`);
                        return "";
                    }
                    text = await response.text();
                } catch (error) {
                    console.error(`Error scraping URL: ${error}`);
                    return "";
                }
                break;
        }
        //* TODO: add an optional to return markdown or structured/extracted content 
        let cleanedHtml = removeUnwantedElements(text, pageOptions);
        return [
            await (0,_lib_html_to_markdown__WEBPACK_IMPORTED_MODULE_3__/* .parseMarkdown */ .e)(cleanedHtml),
            text
        ];
    };
    try {
        // TODO: comment this out once we're ready to merge firecrawl-scraper into the mono-repo
        // let [text, html] = await attemptScraping(urlToScrap, 'firecrawl-scraper');
        // if (!text || text.length < 100) {
        //   console.log("Falling back to scraping bee load");
        //   [text, html] = await attemptScraping(urlToScrap, 'scrapingBeeLoad');
        // }
        let [text, html] = await attemptScraping(urlToScrap, "scrapingBee");
        // Basically means that it is using /search endpoint
        if (pageOptions.fallback === false) {
            const soup = cheerio__WEBPACK_IMPORTED_MODULE_0__.load(html);
            const metadata = (0,_utils_metadata__WEBPACK_IMPORTED_MODULE_6__/* .extractMetadata */ .m)(soup, urlToScrap);
            return {
                url: urlToScrap,
                content: text,
                markdown: text,
                metadata: {
                    ...metadata,
                    sourceURL: urlToScrap
                }
            };
        }
        if (!text || text.length < 100) {
            console.log("Falling back to playwright");
            [text, html] = await attemptScraping(urlToScrap, "playwright");
        }
        if (!text || text.length < 100) {
            console.log("Falling back to scraping bee load");
            [text, html] = await attemptScraping(urlToScrap, "scrapingBeeLoad");
        }
        if (!text || text.length < 100) {
            console.log("Falling back to fetch");
            [text, html] = await attemptScraping(urlToScrap, "fetch");
        }
        const soup = cheerio__WEBPACK_IMPORTED_MODULE_0__.load(html);
        const metadata = (0,_utils_metadata__WEBPACK_IMPORTED_MODULE_6__/* .extractMetadata */ .m)(soup, urlToScrap);
        return {
            content: text,
            markdown: text,
            metadata: {
                ...metadata,
                sourceURL: urlToScrap
            }
        };
    } catch (error) {
        console.error(`Error: ${error} - Failed to fetch URL: ${urlToScrap}`);
        return {
            content: "",
            markdown: "",
            metadata: {
                sourceURL: urlToScrap
            }
        };
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6589:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ getLinksFromSitemap),
/* harmony export */   r: () => (/* binding */ fetchSitemapData)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var xml2js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(855);
/* harmony import */ var xml2js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xml2js__WEBPACK_IMPORTED_MODULE_1__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


async function getLinksFromSitemap(sitemapUrl, allUrls = []) {
    try {
        let content;
        try {
            const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(sitemapUrl);
            content = response.data;
        } catch (error) {
            console.error(`Request failed for ${sitemapUrl}: ${error}`);
            return allUrls;
        }
        const parsed = await (0,xml2js__WEBPACK_IMPORTED_MODULE_1__.parseStringPromise)(content);
        const root = parsed.urlset || parsed.sitemapindex;
        if (root && root.sitemap) {
            for (const sitemap of root.sitemap){
                if (sitemap.loc && sitemap.loc.length > 0) {
                    await getLinksFromSitemap(sitemap.loc[0], allUrls);
                }
            }
        } else if (root && root.url) {
            for (const url of root.url){
                if (url.loc && url.loc.length > 0) {
                    allUrls.push(url.loc[0]);
                }
            }
        }
    } catch (error) {
        console.error(`Error processing ${sitemapUrl}: ${error}`);
    }
    return allUrls;
}
const fetchSitemapData = async (url)=>{
    const sitemapUrl = url.endsWith("/sitemap.xml") ? url : `${url}/sitemap.xml`;
    try {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(sitemapUrl);
        if (response.status === 200) {
            const xml = response.data;
            const parsedXml = await (0,xml2js__WEBPACK_IMPORTED_MODULE_1__.parseStringPromise)(xml);
            const sitemapData = [];
            if (parsedXml.urlset && parsedXml.urlset.url) {
                for (const urlElement of parsedXml.urlset.url){
                    const sitemapEntry = {
                        loc: urlElement.loc[0]
                    };
                    if (urlElement.lastmod) sitemapEntry.lastmod = urlElement.lastmod[0];
                    if (urlElement.changefreq) sitemapEntry.changefreq = urlElement.changefreq[0];
                    if (urlElement.priority) sitemapEntry.priority = Number(urlElement.priority[0]);
                    sitemapData.push(sitemapEntry);
                }
            }
            return sitemapData;
        }
        return null;
    } catch (error) {
    // Error handling for failed sitemap fetch
    }
    return [];
};

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

/***/ 1577:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ urlSpecificParams)
/* harmony export */ });
const urlSpecificParams = {
    "platform.openai.com": {
        params: {
            wait_browser: "networkidle2",
            block_resources: false
        },
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            referer: "https://www.google.com/",
            "accept-language": "en-US,en;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        },
        cookies: {
            __cf_bm: "mC1On8P2GWT3A5UeSYH6z_MP94xcTAdZ5jfNi9IT2U0-1714327136-1.0.1.1-ILAP5pSX_Oo9PPo2iHEYCYX.p9a0yRBNLr58GHyrzYNDJ537xYpG50MXxUYVdfrD.h3FV5O7oMlRKGA0scbxaQ"
        }
    },
    "support.greenpay.me": {
        params: {
            wait_browser: "networkidle2",
            block_resources: false
        },
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            referer: "https://www.google.com/",
            "accept-language": "en-US,en;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
    }
};


/***/ }),

/***/ 6663:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ excludeNonMainTags)
/* harmony export */ });
const excludeNonMainTags = [
    "header",
    "footer",
    "nav",
    "aside",
    ".header",
    ".top",
    ".navbar",
    "#header",
    ".footer",
    ".bottom",
    "#footer",
    ".sidebar",
    ".side",
    ".aside",
    "#sidebar",
    ".modal",
    ".popup",
    "#modal",
    ".overlay",
    ".ad",
    ".ads",
    ".advert",
    "#ad",
    ".lang-selector",
    ".language",
    "#language-selector",
    ".social",
    ".social-media",
    ".social-links",
    "#social",
    ".menu",
    ".navigation",
    "#nav",
    ".breadcrumbs",
    "#breadcrumbs",
    ".form",
    "form",
    "#search-form",
    ".search",
    "#search",
    ".share",
    "#share",
    ".pagination",
    "#pagination",
    ".widget",
    "#widget",
    ".related",
    "#related",
    ".tag",
    "#tag",
    ".category",
    "#category",
    ".comment",
    "#comment",
    ".reply",
    "#reply",
    ".author",
    "#author"
];


/***/ }),

/***/ 4325:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ getImageDescription)
/* harmony export */ });
/* harmony import */ var _anthropic_ai_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7174);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anthropic_ai_sdk__WEBPACK_IMPORTED_MODULE_0__, axios__WEBPACK_IMPORTED_MODULE_1__]);
([_anthropic_ai_sdk__WEBPACK_IMPORTED_MODULE_0__, axios__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


async function getImageDescription(imageUrl, backText, frontText, model = "gpt-4-turbo") {
    try {
        const prompt = "What's in the image? You need to answer with the content for the alt tag of the image. To help you with the context, the image is in the following text: " + backText + " and the following text: " + frontText + ". Be super concise.";
        switch(model){
            case "claude-3-opus":
                {
                    if (!process.env.ANTHROPIC_API_KEY) {
                        throw new Error("No Anthropic API key provided");
                    }
                    const imageRequest = await axios__WEBPACK_IMPORTED_MODULE_1__["default"].get(imageUrl, {
                        responseType: "arraybuffer"
                    });
                    const imageMediaType = "image/png";
                    const imageData = Buffer.from(imageRequest.data, "binary").toString("base64");
                    const anthropic = new _anthropic_ai_sdk__WEBPACK_IMPORTED_MODULE_0__["default"]();
                    const response = await anthropic.messages.create({
                        model: "claude-3-opus-20240229",
                        max_tokens: 1024,
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "image",
                                        source: {
                                            type: "base64",
                                            media_type: imageMediaType,
                                            data: imageData
                                        }
                                    },
                                    {
                                        type: "text",
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    });
                    return response.content[0].text;
                }
            default:
                {
                    if (!process.env.OPENAI_API_KEY) {
                        throw new Error("No OpenAI API key provided");
                    }
                    const { OpenAI } = __webpack_require__(3118);
                    const openai = new OpenAI();
                    const response = await openai.chat.completions.create({
                        model: "gpt-4-turbo",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: prompt
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: imageUrl
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                    return response.choices[0].message.content;
                }
        }
    } catch (error) {
        console.error("Error generating image alt text:", error?.message);
        return "";
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 695:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ extractMetadata)
/* harmony export */ });
function extractMetadata(soup, url) {
    let title = null;
    let description = null;
    let language = null;
    let keywords = null;
    let robots = null;
    let ogTitle = null;
    let ogDescription = null;
    let ogUrl = null;
    let ogImage = null;
    let ogAudio = null;
    let ogDeterminer = null;
    let ogLocale = null;
    let ogLocaleAlternate = null;
    let ogSiteName = null;
    let ogVideo = null;
    let dctermsCreated = null;
    let dcDateCreated = null;
    let dcDate = null;
    let dctermsType = null;
    let dcType = null;
    let dctermsAudience = null;
    let dctermsSubject = null;
    let dcSubject = null;
    let dcDescription = null;
    let dctermsKeywords = null;
    let modifiedTime = null;
    let publishedTime = null;
    let articleTag = null;
    let articleSection = null;
    try {
        title = soup("title").text() || null;
        description = soup('meta[name="description"]').attr("content") || null;
        // Assuming the language is part of the URL as per the regex pattern
        const pattern = /([a-zA-Z]+-[A-Z]{2})/;
        const match = pattern.exec(url);
        language = match ? match[1] : null;
        keywords = soup('meta[name="keywords"]').attr("content") || null;
        robots = soup('meta[name="robots"]').attr("content") || null;
        ogTitle = soup('meta[property="og:title"]').attr("content") || null;
        ogDescription = soup('meta[property="og:description"]').attr("content") || null;
        ogUrl = soup('meta[property="og:url"]').attr("content") || null;
        ogImage = soup('meta[property="og:image"]').attr("content") || null;
        ogAudio = soup('meta[property="og:audio"]').attr("content") || null;
        ogDeterminer = soup('meta[property="og:determiner"]').attr("content") || null;
        ogLocale = soup('meta[property="og:locale"]').attr("content") || null;
        ogLocaleAlternate = soup('meta[property="og:locale:alternate"]').map((i, el)=>soup(el).attr("content")).get() || null;
        ogSiteName = soup('meta[property="og:site_name"]').attr("content") || null;
        ogVideo = soup('meta[property="og:video"]').attr("content") || null;
        articleSection = soup('meta[name="article:section"]').attr("content") || null;
        articleTag = soup('meta[name="article:tag"]').attr("content") || null;
        publishedTime = soup('meta[property="article:published_time"]').attr("content") || null;
        modifiedTime = soup('meta[property="article:modified_time"]').attr("content") || null;
        dctermsKeywords = soup('meta[name="dcterms.keywords"]').attr("content") || null;
        dcDescription = soup('meta[name="dc.description"]').attr("content") || null;
        dcSubject = soup('meta[name="dc.subject"]').attr("content") || null;
        dctermsSubject = soup('meta[name="dcterms.subject"]').attr("content") || null;
        dctermsAudience = soup('meta[name="dcterms.audience"]').attr("content") || null;
        dcType = soup('meta[name="dc.type"]').attr("content") || null;
        dctermsType = soup('meta[name="dcterms.type"]').attr("content") || null;
        dcDate = soup('meta[name="dc.date"]').attr("content") || null;
        dcDateCreated = soup('meta[name="dc.date.created"]').attr("content") || null;
        dctermsCreated = soup('meta[name="dcterms.created"]').attr("content") || null;
    } catch (error) {
        console.error("Error extracting metadata:", error);
    }
    return {
        ...title ? {
            title
        } : {},
        ...description ? {
            description
        } : {},
        ...language ? {
            language
        } : {},
        ...keywords ? {
            keywords
        } : {},
        ...robots ? {
            robots
        } : {},
        ...ogTitle ? {
            ogTitle
        } : {},
        ...ogDescription ? {
            ogDescription
        } : {},
        ...ogUrl ? {
            ogUrl
        } : {},
        ...ogImage ? {
            ogImage
        } : {},
        ...ogAudio ? {
            ogAudio
        } : {},
        ...ogDeterminer ? {
            ogDeterminer
        } : {},
        ...ogLocale ? {
            ogLocale
        } : {},
        ...ogLocaleAlternate ? {
            ogLocaleAlternate
        } : {},
        ...ogSiteName ? {
            ogSiteName
        } : {},
        ...ogVideo ? {
            ogVideo
        } : {},
        ...dctermsCreated ? {
            dctermsCreated
        } : {},
        ...dcDateCreated ? {
            dcDateCreated
        } : {},
        ...dcDate ? {
            dcDate
        } : {},
        ...dctermsType ? {
            dctermsType
        } : {},
        ...dcType ? {
            dcType
        } : {},
        ...dctermsAudience ? {
            dctermsAudience
        } : {},
        ...dctermsSubject ? {
            dctermsSubject
        } : {},
        ...dcSubject ? {
            dcSubject
        } : {},
        ...dcDescription ? {
            dcDescription
        } : {},
        ...dctermsKeywords ? {
            dctermsKeywords
        } : {},
        ...modifiedTime ? {
            modifiedTime
        } : {},
        ...publishedTime ? {
            publishedTime
        } : {},
        ...articleTag ? {
            articleTag
        } : {},
        ...articleSection ? {
            articleSection
        } : {}
    };
}


/***/ }),

/***/ 8405:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ fetchAndProcessPdf)
/* harmony export */ });
/* unused harmony export processPdfToText */
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7561);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8941);
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(form_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5142);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var pdf_parse__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4193);
/* harmony import */ var pdf_parse__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(pdf_parse__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2037);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_7__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];








dotenv__WEBPACK_IMPORTED_MODULE_4___default().config();
async function fetchAndProcessPdf(url) {
    const tempFilePath = await downloadPdf(url);
    const content = await processPdfToText(tempFilePath);
    fs__WEBPACK_IMPORTED_MODULE_1___default().unlinkSync(tempFilePath); // Clean up the temporary file
    return content;
}
async function downloadPdf(url) {
    const response = await (0,axios__WEBPACK_IMPORTED_MODULE_0__["default"])({
        url,
        method: "GET",
        responseType: "stream"
    });
    const tempFilePath = path__WEBPACK_IMPORTED_MODULE_6___default().join(os__WEBPACK_IMPORTED_MODULE_7___default().tmpdir(), `tempPdf-${Date.now()}.pdf`);
    const writer = (0,node_fs__WEBPACK_IMPORTED_MODULE_2__.createWriteStream)(tempFilePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject)=>{
        writer.on("finish", ()=>resolve(tempFilePath));
        writer.on("error", reject);
    });
}
async function processPdfToText(filePath) {
    let content = "";
    if (process.env.LLAMAPARSE_API_KEY) {
        const apiKey = process.env.LLAMAPARSE_API_KEY;
        const headers = {
            Authorization: `Bearer ${apiKey}`
        };
        const base_url = "https://api.cloud.llamaindex.ai/api/parsing";
        const fileType2 = "application/pdf";
        try {
            const formData = new (form_data__WEBPACK_IMPORTED_MODULE_3___default())();
            formData.append("file", (0,node_fs__WEBPACK_IMPORTED_MODULE_2__.createReadStream)(filePath), {
                filename: filePath,
                contentType: fileType2
            });
            const uploadUrl = `${base_url}/upload`;
            const uploadResponse = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(uploadUrl, formData, {
                headers: {
                    ...headers,
                    ...formData.getHeaders()
                }
            });
            const jobId = uploadResponse.data.id;
            const resultType = "text";
            const resultUrl = `${base_url}/job/${jobId}/result/${resultType}`;
            let resultResponse;
            let attempt = 0;
            const maxAttempts = 10; // Maximum number of attempts
            let resultAvailable = false;
            while(attempt < maxAttempts && !resultAvailable){
                try {
                    resultResponse = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(resultUrl, {
                        headers
                    });
                    if (resultResponse.status === 200) {
                        resultAvailable = true; // Exit condition met
                    } else {
                        // If the status code is not 200, increment the attempt counter and wait
                        attempt++;
                        await new Promise((resolve)=>setTimeout(resolve, 250)); // Wait for 2 seconds
                    }
                } catch (error) {
                    console.error("Error fetching result:", error);
                    attempt++;
                    await new Promise((resolve)=>setTimeout(resolve, 250)); // Wait for 2 seconds before retrying
                // You may want to handle specific errors differently
                }
            }
            if (!resultAvailable) {
                content = await processPdf(filePath);
            }
            content = resultResponse.data[resultType];
        } catch (error) {
            console.error("Error processing document:", filePath, error);
            content = await processPdf(filePath);
        }
    } else {
        content = await processPdf(filePath);
    }
    return content;
}
async function processPdf(file) {
    const fileContent = fs__WEBPACK_IMPORTED_MODULE_1___default().readFileSync(file);
    const data = await pdf_parse__WEBPACK_IMPORTED_MODULE_5___default()(fileContent);
    return data.text;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1207:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: () => (/* binding */ replacePathsWithAbsolutePaths),
/* harmony export */   f: () => (/* binding */ replaceImgPathsWithAbsolutePaths)
/* harmony export */ });
const replacePathsWithAbsolutePaths = (documents)=>{
    try {
        documents.forEach((document)=>{
            const baseUrl = new URL(document.metadata.sourceURL).origin;
            const paths = document.content.match(/(!?\[.*?\])\(((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*)\)|href="([^"]+)"/g) || [];
            paths.forEach((path)=>{
                const isImage = path.startsWith("!");
                let matchedUrl = path.match(/\(([^)]+)\)/) || path.match(/href="([^"]+)"/);
                let url = matchedUrl[1];
                if (!url.startsWith("data:") && !url.startsWith("http")) {
                    if (url.startsWith("/")) {
                        url = url.substring(1);
                    }
                    url = new URL(url, baseUrl).toString();
                }
                const markdownLinkOrImageText = path.match(/(!?\[.*?\])/)[0];
                if (isImage) {
                    document.content = document.content.replace(path, `${markdownLinkOrImageText}(${url})`);
                } else {
                    document.content = document.content.replace(path, `${markdownLinkOrImageText}(${url})`);
                }
            });
        });
        return documents;
    } catch (error) {
        console.error("Error replacing paths with absolute paths", error);
        return documents;
    }
};
const replaceImgPathsWithAbsolutePaths = (documents)=>{
    try {
        documents.forEach((document)=>{
            const baseUrl = new URL(document.metadata.sourceURL).origin;
            const images = document.content.match(/!\[.*?\]\(((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*)\)/g) || [];
            images.forEach((image)=>{
                let imageUrl = image.match(/\(([^)]+)\)/)[1];
                let altText = image.match(/\[(.*?)\]/)[1];
                if (!imageUrl.startsWith("data:image")) {
                    if (!imageUrl.startsWith("http")) {
                        if (imageUrl.startsWith("/")) {
                            imageUrl = imageUrl.substring(1);
                        }
                        imageUrl = new URL(imageUrl, baseUrl).toString();
                    }
                }
                document.content = document.content.replace(image, `![${altText}](${imageUrl})`);
            });
        });
        return documents;
    } catch (error) {
        console.error("Error replacing img paths with absolute paths", error);
        return documents;
    }
};


/***/ }),

/***/ 4977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AK: () => (/* binding */ checkTeamCredits),
/* harmony export */   Nh: () => (/* binding */ billTeam)
/* harmony export */ });
/* unused harmony exports supaBillTeam, supaCheckTeamCredits, countCreditsAndRemainingForCurrentBillingPeriod */
/* harmony import */ var _lib_withAuth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2720);
/* harmony import */ var _supabase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2560);


const FREE_CREDITS = 300;
async function billTeam(team_id, credits) {
    return (0,_lib_withAuth__WEBPACK_IMPORTED_MODULE_1__/* .withAuth */ .Q)(supaBillTeam)(team_id, credits);
}
async function supaBillTeam(team_id, credits) {
    if (team_id === "preview") {
        return {
            success: true,
            message: "Preview team, no credits used"
        };
    }
    console.log(`Billing team ${team_id} for ${credits} credits`);
    //   When the API is used, you can log the credit usage in the credit_usage table:
    // team_id: The ID of the team using the API.
    // subscription_id: The ID of the team's active subscription.
    // credits_used: The number of credits consumed by the API call.
    // created_at: The timestamp of the API usage.
    // 1. get the subscription
    const { data: subscription } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("subscriptions").select("*").eq("team_id", team_id).eq("status", "active").single();
    // 2. Check for available coupons
    const { data: coupons } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").select("id, credits").eq("team_id", team_id).eq("status", "active");
    let couponCredits = 0;
    if (coupons && coupons.length > 0) {
        couponCredits = coupons.reduce((total, coupon)=>total + coupon.credits, 0);
    }
    let sortedCoupons = coupons.sort((a, b)=>b.credits - a.credits);
    // using coupon credits:
    if (couponCredits > 0) {
        // if there is no subscription and they have enough coupon credits
        if (!subscription) {
            // using only coupon credits:
            // if there are enough coupon credits
            if (couponCredits >= credits) {
                // remove credits from coupon credits
                let usedCredits = credits;
                while(usedCredits > 0){
                    // update coupons
                    if (sortedCoupons[0].credits < usedCredits) {
                        usedCredits = usedCredits - sortedCoupons[0].credits;
                        // update coupon credits
                        await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").update({
                            credits: 0
                        }).eq("id", sortedCoupons[0].id);
                        sortedCoupons.shift();
                    } else {
                        // update coupon credits
                        await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").update({
                            credits: sortedCoupons[0].credits - usedCredits
                        }).eq("id", sortedCoupons[0].id);
                        usedCredits = 0;
                    }
                }
                return await createCreditUsage({
                    team_id,
                    credits: 0
                });
            // not enough coupon credits and no subscription
            } else {
                // update coupon credits
                const usedCredits = credits - couponCredits;
                for(let i = 0; i < sortedCoupons.length; i++){
                    await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").update({
                        credits: 0
                    }).eq("id", sortedCoupons[i].id);
                }
                return await createCreditUsage({
                    team_id,
                    credits: usedCredits
                });
            }
        }
        // with subscription
        // using coupon + subscription credits:
        if (credits > couponCredits) {
            // update coupon credits
            for(let i = 0; i < sortedCoupons.length; i++){
                await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").update({
                    credits: 0
                }).eq("id", sortedCoupons[i].id);
            }
            const usedCredits = credits - couponCredits;
            return await createCreditUsage({
                team_id,
                subscription_id: subscription.id,
                credits: usedCredits
            });
        } else {
            let usedCredits = credits;
            while(usedCredits > 0){
                // update coupons
                if (sortedCoupons[0].credits < usedCredits) {
                    usedCredits = usedCredits - sortedCoupons[0].credits;
                    // update coupon credits
                    await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").update({
                        credits: 0
                    }).eq("id", sortedCoupons[0].id);
                    sortedCoupons.shift();
                } else {
                    // update coupon credits
                    await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").update({
                        credits: sortedCoupons[0].credits - usedCredits
                    }).eq("id", sortedCoupons[0].id);
                    usedCredits = 0;
                }
            }
            return await createCreditUsage({
                team_id,
                subscription_id: subscription.id,
                credits: 0
            });
        }
    }
    // not using coupon credits
    if (!subscription) {
        return await createCreditUsage({
            team_id,
            credits
        });
    }
    return await createCreditUsage({
        team_id,
        subscription_id: subscription.id,
        credits
    });
}
async function checkTeamCredits(team_id, credits) {
    return (0,_lib_withAuth__WEBPACK_IMPORTED_MODULE_1__/* .withAuth */ .Q)(supaCheckTeamCredits)(team_id, credits);
}
// if team has enough credits for the operation, return true, else return false
async function supaCheckTeamCredits(team_id, credits) {
    if (team_id === "preview") {
        return {
            success: true,
            message: "Preview team, no credits used"
        };
    }
    // Retrieve the team's active subscription
    const { data: subscription, error: subscriptionError } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("subscriptions").select("id, price_id, current_period_start, current_period_end").eq("team_id", team_id).eq("status", "active").single();
    // Check for available coupons
    const { data: coupons } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("coupons").select("credits").eq("team_id", team_id).eq("status", "active");
    let couponCredits = 0;
    if (coupons && coupons.length > 0) {
        couponCredits = coupons.reduce((total, coupon)=>total + coupon.credits, 0);
    }
    // Free credits, no coupons
    if (subscriptionError || !subscription) {
        // If there is no active subscription but there are available coupons
        if (couponCredits >= credits) {
            return {
                success: true,
                message: "Sufficient credits available"
            };
        }
        const { data: creditUsages, error: creditUsageError } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("credit_usage").select("credits_used").is("subscription_id", null).eq("team_id", team_id);
        // .gte("created_at", subscription.current_period_start)
        // .lte("created_at", subscription.current_period_end);
        if (creditUsageError) {
            throw new Error(`Failed to retrieve credit usage for subscription_id: ${subscription.id}`);
        }
        const totalCreditsUsed = creditUsages.reduce((acc, usage)=>acc + usage.credits_used, 0);
        console.log("totalCreditsUsed", totalCreditsUsed);
        // 5. Compare the total credits used with the credits allowed by the plan.
        if (totalCreditsUsed + credits > FREE_CREDITS) {
            return {
                success: false,
                message: "Insufficient credits, please upgrade!"
            };
        }
        return {
            success: true,
            message: "Sufficient credits available"
        };
    }
    // Calculate the total credits used by the team within the current billing period
    const { data: creditUsages, error: creditUsageError } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("credit_usage").select("credits_used").eq("subscription_id", subscription.id).gte("created_at", subscription.current_period_start).lte("created_at", subscription.current_period_end);
    if (creditUsageError) {
        throw new Error(`Failed to retrieve credit usage for subscription_id: ${subscription.id}`);
    }
    const totalCreditsUsed = creditUsages.reduce((acc, usage)=>acc + usage.credits_used, 0);
    // Adjust total credits used by subtracting coupon value
    const adjustedCreditsUsed = Math.max(0, totalCreditsUsed - couponCredits);
    // Get the price details
    const { data: price, error: priceError } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("prices").select("credits").eq("id", subscription.price_id).single();
    if (priceError) {
        throw new Error(`Failed to retrieve price for price_id: ${subscription.price_id}`);
    }
    // Compare the adjusted total credits used with the credits allowed by the plan
    if (adjustedCreditsUsed + credits > price.credits) {
        return {
            success: false,
            message: "Insufficient credits, please upgrade!"
        };
    }
    return {
        success: true,
        message: "Sufficient credits available"
    };
}
// Count the total credits used by a team within the current billing period and return the remaining credits.
async function countCreditsAndRemainingForCurrentBillingPeriod(team_id) {
    // 1. Retrieve the team's active subscription based on the team_id.
    const { data: subscription, error: subscriptionError } = await supabase_service.from("subscriptions").select("id, price_id, current_period_start, current_period_end").eq("team_id", team_id).single();
    const { data: coupons } = await supabase_service.from("coupons").select("credits").eq("team_id", team_id).eq("status", "active");
    let couponCredits = 0;
    if (coupons && coupons.length > 0) {
        couponCredits = coupons.reduce((total, coupon)=>total + coupon.credits, 0);
    }
    if (subscriptionError || !subscription) {
        // Free
        const { data: creditUsages, error: creditUsageError } = await supabase_service.from("credit_usage").select("credits_used").is("subscription_id", null).eq("team_id", team_id);
        if (creditUsageError || !creditUsages) {
            throw new Error(`Failed to retrieve credit usage for team_id: ${team_id}`);
        }
        const totalCreditsUsed = creditUsages.reduce((acc, usage)=>acc + usage.credits_used, 0);
        const remainingCredits = FREE_CREDITS + couponCredits - totalCreditsUsed;
        return {
            totalCreditsUsed: totalCreditsUsed,
            remainingCredits,
            totalCredits: FREE_CREDITS + couponCredits
        };
    }
    const { data: creditUsages, error: creditUsageError } = await supabase_service.from("credit_usage").select("credits_used").eq("subscription_id", subscription.id).gte("created_at", subscription.current_period_start).lte("created_at", subscription.current_period_end);
    if (creditUsageError || !creditUsages) {
        throw new Error(`Failed to retrieve credit usage for subscription_id: ${subscription.id}`);
    }
    const totalCreditsUsed = creditUsages.reduce((acc, usage)=>acc + usage.credits_used, 0);
    const { data: price, error: priceError } = await supabase_service.from("prices").select("credits").eq("id", subscription.price_id).single();
    if (priceError || !price) {
        throw new Error(`Failed to retrieve price for price_id: ${subscription.price_id}`);
    }
    const remainingCredits = price.credits + couponCredits - totalCreditsUsed;
    return {
        totalCreditsUsed,
        remainingCredits,
        totalCredits: price.credits
    };
}
async function createCreditUsage({ team_id, subscription_id, credits }) {
    const { data: credit_usage } = await _supabase__WEBPACK_IMPORTED_MODULE_0__/* .supabase_service */ .i.from("credit_usage").insert([
        {
            team_id,
            credits_used: credits,
            subscription_id: subscription_id || null,
            created_at: new Date()
        }
    ]).select();
    return {
        success: true,
        credit_usage
    };
}


/***/ }),

/***/ 2025:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NA: () => (/* binding */ getValue),
/* harmony export */   sO: () => (/* binding */ setValue)
/* harmony export */ });
/* unused harmony export deleteKey */
/* harmony import */ var ioredis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1495);
/* harmony import */ var ioredis__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ioredis__WEBPACK_IMPORTED_MODULE_0__);

// Initialize Redis client
const redis = new (ioredis__WEBPACK_IMPORTED_MODULE_0___default())(process.env.REDIS_URL);
/**
 * Set a value in Redis with an optional expiration time.
 * @param {string} key The key under which to store the value.
 * @param {string} value The value to store.
 * @param {number} [expire] Optional expiration time in seconds.
 */ const setValue = async (key, value, expire)=>{
    if (expire) {
        await redis.set(key, value, "EX", expire);
    } else {
        await redis.set(key, value);
    }
};
/**
 * Get a value from Redis.
 * @param {string} key The key of the value to retrieve.
 * @returns {Promise<string|null>} The value, if found, otherwise null.
 */ const getValue = async (key)=>{
    const value = await redis.get(key);
    return value;
};
/**
 * Delete a key from Redis.
 * @param {string} key The key to delete.
 */ const deleteKey = async (key)=>{
    await redis.del(key);
};



/***/ })

};
;