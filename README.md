# What's this? 🤔
You want to embed a simple preview for the contents of your RSS feed on your website? Like an overview of your latest blog articles? Then these few lines of JavaScript might help you out 😉.

## ✔ Features
* No dependecies on 3rd party APIs or libraries! This works completely standalone and without any third party calls.
* Therefore very privacy friendly :)
* easy to add to any website where you have the ability to add HTML snippets
* The preview is stripped down to simple text. The first few sentences will be included while cutoff sentence fragments are avoided.

## ❌ Missing features
This will only display the RSS feed for the domain where it is embedded. Fetching feeds for other websites isn't easily possible for security reasons (I think CORS is the keyword here, see [this documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)). Fetching feeds from other websites would probably have to be done server side or by using 3rd party APIs. If that is what you want, here is a solution involving a 3rd party API call: https://github.com/55sketch/simple-rss 

I was too lazy to implement support for Internet Explorer... I hope supporting that old hag isn't really neccessary anymore. Using `xmlDoc.evaluate` to traverse XML with XPath won't work with Internet Explorer according to w3schools. In case you need to IE support, see [this example](https://www.w3schools.com/xml/tryit.asp?filename=try_xpath_select_cdnodes).

# 💡 Simple How To
* copy the contents of `rss-feed-preview.js` into a `<script> ... </script>` element on your website
* modify the settings to your needs (at least `setting_FeedPath` needs to be altered to point your websites RSS feed)
* insert `<div id="rss-feed-container"></div>` to the place where you want the preview to appear

Have a look at `local-testpage.html` as a simple example website. It also allows for simple local testing and quick iterations if you want to edit the HTML template or anything else about the widget. You'll have to provide an XML file for your feed by clicking the button. You can get the XML for any feed by using the command line tool curl, e.g.: `curl "https://en.wikipedia.org/w/api.php?action=featuredfeed&feed=featured&feedformat=rss" > feed.xml`. You can also use the provided file `example-rss-feed.xml`.

## 📅 Date formatting
You might want to alter the way the publishing date of your feed items is formatted. Find the following line:

```JavaScript
let pubDateString =  (new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(pubDate).toString());
```

Replace `en-US` with your prefered locale (e.g. `de-DE`) and dateStyle can be set to: `full`, `long`, `medium` or `short`. See the [MDN documenation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) for more options.

## Settings

```JavaScript
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
```

# Disclaimer 😬
I'm not an experienced web developer, I only know some HTML basics and this was the first time I tried to do anything meaningful with JavaScript. This was hacked together over a few afternoons because I needed it for a personal project. With a lot of try and error and web searches. 
(Thanks got out to: w3schools.com, developer.mozilla.org, regex101.com and stackoverflow.com 😉)

Although everything seemed to work fine for me, the code might have horrible flaws I'm not aware about. If there's anything major that would need to be fixed, then I'm probably the wrong person to implement those fixes and maintain this project. For major fixes it might be best if this little project was forked by someone who actually knows what they're doing. In that case I'd happily link to the improved fork. Cheers! :)
