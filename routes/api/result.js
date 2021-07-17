const express = require("express");
const app = express();
const router = express.Router();
const Site = require("../../schemas/SiteSchema")
const Image = require("../../schemas/ImageSchema")

// Crawling Necessary needs
const fetch = require("node-fetch")
const cheerio = require("cheerio")
const urlParser = require("url")

var seenUrls = {};

// API Router Stuff
app.use(express.urlencoded({extended: true}));
app.use(express.json())

router.post("/", async (req, res, next) => {
    
    if(!req.body.url) {
        console.log("Invalid data passed to the request");
        return res.sendStatus(400);
    }

    if(!isUrl(req.body.url)) {
        console.log("Invalid url passed to the request");
        return res.sendStatus(400);
    }

    await crawl({
		url: req.body.url,
		ignore: "/search",
	});

    res.sendStatus(204);   
    
})


// Crawling Functions

const isUrl = (string) => {
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(string)
}

const getUrl = (link, host, protocol) => {
	if (link.includes("http")) {
		return link;
	} else if (link.startsWith("/")) {
		return `${protocol}//${host}${link}`;
	} else {
		return `${protocol}//${host}/${link}`;
	}
};

const crawl = async ({ url, ignore }) => {
	if (seenUrls[url]) return;
	seenUrls[url] = true;

	const { host, protocol } = urlParser.parse(url);

	const response = await fetch(url);
	const html = await response.text();
	const $ = cheerio.load(html);

	var title =
		$("title").text() !== undefined 
			? $("title").text() 
			: $("h1").text() !== undefined
                ? $("h1").text() 
                : url;

	var description =
		$('meta[name="description"]').attr("content") !== undefined
			? $('meta[name="description"]').attr("content")
			: $('meta[property="og:description"]').attr("content") !== undefined 
                ? $('meta[property="og:description"]').attr("content")
                : title;

	var keywords =
		$('meta[name="keywords"]').attr("content") !== undefined
			? $('meta[name="keywords"]').attr("content")
			: $('meta[property="og:keywords"]').attr("content") !== undefined 
                ? $('meta[property="og:keywords"]').attr("content") 
                : "";

    let siteObject = {
        url: url,
        title: title,
        description: description,
        keywords: keywords
    }

    await Site.create(siteObject)
    .catch(error => console.log(error))

	const links = $("a")
		.map((i, link) => link.attribs.href)
		.get();

	const imageUrls = $("img")
		.map((i, link) => link.attribs.src)
		.get();

	const imageAlt = $("img")
		.map((i, link) => link.attribs.alt)
		.get();

	if (imageUrls.length > 0) {
		console.log(imageUrls.length, " Images available in the page");
		for (let i = 0; i < imageUrls.length; i++) {
			let newImageUrl = getUrl(imageUrls[i], host, protocol);
			let newImageUrlAlt = imageAlt[i] !== undefined ? imageAlt[i] : description;

            let newImage = {
                url: newImageUrl,
                alt: newImageUrlAlt
            }

            await Image.create(newImage)
            .catch(error => console.log(error))
		}
	}

	links
		.filter((link) => link.includes(host) && !link.includes(ignore))
		.forEach((link) => {
			crawl({
				url: getUrl(link, host, protocol),
				ignore,
			});
		});
};
module.exports = router;