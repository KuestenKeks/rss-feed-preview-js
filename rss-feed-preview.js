// (this is for creating sth. like a namespace called "simpleRssFeedPreview", see https://js-tutorials.info/namespace-in-javascript/)
var simpleRssFeedPreview = {};
(function() {

	// == SETTINGS ================================================================================================================================================================================

	// This needs to point to your website's RSS feed. If your feed's full URL is "https://example.org/rss/blog" then "/rss/blog" is what you need to provide here.
	const setting_FeedPath = "/rss/blog";

	// The description of your RSS feed's items will be truncated to this length.
	// (And then some more is truncated to make sure there are no sentence fragments remaining at the end of the description preview)
	const setting_MaxPreviewLength = 300;

	// how many items of your RSS feed should be displayed?
	// (if you provide a number that's larger than the amount of items in your feed, then only the available feed items will be displayed)
	const setting_MaxEntries = 3;

	// Try setting this to 'true' if your oldest RSS entries are displayed instead of the most current ones.
	// (By default the first entries contained in the RSS XML are displayed. These are usually the newest ones, but with some feeds the last entries are.)
	const setting_ReverseOrder = false;

	// The HTML template into which each RSS item's content will be inserted into. You might want to customize this template to fit your needs.
	const setting_HtmlTemplate = template`<h3><a href="${"link"}">${"title"} (${"pubDate"})</a></h3> <p>${"description"} ⚬ <strong><a href="${"link"}">Continue reading...</a></p></strong>`;

	// ============================================================================================================================================================================================

	const rssFeedContainer = document.getElementById("rss-feed-container");


	this.getRssByRequest = function() {
		// 1. Create a new XMLHttpRequest object
		let xhr = new XMLHttpRequest();

		// 2. GET-request for the URL path where your RSS Feed is located
		xhr.open('GET', setting_FeedPath);

		// 3. Send the request over the network
		xhr.send();

		// 4. This will be called after the response is received
		xhr.onload = function() {
			// analyze HTTP status of the response
			if (xhr.status = 200) {
				createHtmlPreviewForRssFeed(xhr.response);
			} else {
				console.error(`Error getting RSS-Feed: ${xhr.status} ${xhr.statusText}`); // e.g. 404: Not Found
			}
		};

		xhr.onerror = function() {
			console.error(`Error getting RSS-Feed, Request failed`);console.error
		};
	}

	function createHtmlPreviewForRssFeed(rssXmlText) {
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(rssXmlText,"text/xml");

		let docFrag = document.createDocumentFragment();

		if (!setting_ReverseOrder) {
			let xPathResult = xmlDoc.evaluate("/rss/channel/item", xmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			let node = xPathResult.iterateNext();
			for (let i = 0; (i < setting_MaxEntries) && node; i++) {
				docFrag.appendChild(createHtmlFragmentForRssItem(node));
				node = xPathResult.iterateNext();
			}
		} else {
			let xPathResult = xmlDoc.evaluate("/rss/channel/item", xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (let i = (xPathResult.snapshotLength - 1); (i >= 0) && (i >= (xPathResult.snapshotLength - setting_MaxEntries)); i--) {
				docFrag.appendChild(createHtmlFragmentForRssItem(xPathResult.snapshotItem(i)));
			}
		}
		rssFeedContainer.appendChild(docFrag);
	}

	function createHtmlFragmentForRssItem(itemNode) {
		let htmlFragment = document.createElement('div');

		let title = itemNode.getElementsByTagName("title")[0].textContent;
		let link = itemNode.getElementsByTagName("link")[0].textContent;

		// Strips the description of any HTML markup and cleans it up a bit by removing unwanted whitespace.
		let description = stripHtml(itemNode.getElementsByTagName("description")[0].textContent).trim().replace(/\s+/g,' ');

		// to generate a shorter preview we only take the first few sentences
		// (which have to end with at least one dot, question mark or exclamation mark. But "... St." is not an accepted sentence ending because it can be part of location names, like "St. Petersburg".)
		let descriptionPreview = description.slice(0,setting_MaxPreviewLength);
		let firstSentences = descriptionPreview.match(/.*(?<!\bSt)[\.\?!]/s);
		descriptionPreview = firstSentences ?? descriptionPreview + '...'; // "firstSentences" might be null, then we'll have to live with a cut off sentence fragment

		let pubDate = new Date(itemNode.getElementsByTagName("pubDate")[0].textContent);
		let pubDateString =  (new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(pubDate).toString());

		// this embeds the content of the RSS feed item into the template's HTML structure.
		htmlFragment.innerHTML = setting_HtmlTemplate({ link: link, title: title, pubDate: pubDateString, description: descriptionPreview});

		return htmlFragment;
	}

	// built upon https://www.w3docs.com/snippets/javascript/how-to-strip-html-from-a-string-in-javascript.html
	function stripHtml(html) {
		// Create a new div element
		let temporalDivEl = document.createElement("div");
		// insert HTML content
		temporalDivEl.innerHTML = html;

		// <script> elements can sometimes have comments. We don't want those in our text that's stripped from HTML. Hence we're removing them all.
		[temporalDivEl.getElementsByTagName("script")].forEach(element => {
			// if no tags are found we still get an HTMLCollection with length zero back, so we need to check if the first elemenent in the collection is defined
			if (element[0]) {
				element[0].remove();
			}
		});

		// <figure> elements can have a <figcaption> providing a caption text. We don't need those here either.
		[temporalDivEl.getElementsByTagName("figure")].forEach(element => {
			if (element[0]) {
				element[0].remove();
			}
		});

		// Get the text property of the element (browser support)
		return temporalDivEl.innerText || "";
	}

	// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
	function template(strings, ...keys) {
		return (...values) => {
			const dict = values[values.length - 1] || {};
			const result = [strings[0]];
			keys.forEach((key, i) => {
				const value = Number.isInteger(key) ? values[key] : dict[key];
				result.push(value, strings[i + 1]);
			});
			return result.join("");
		};
	}

}).apply(simpleRssFeedPreview);

// run the code!
simpleRssFeedPreview.getRssByRequest();