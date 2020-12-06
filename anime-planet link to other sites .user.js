// ==UserScript==
// @name         anime/manga link to other sites
// @version      1.2
// @description  add kitsu/mangaupdates/myanimelist etc buttons to pages
// @author       robo
// @include      https://kitsu.io/*
// @include      https://www.anime-planet.com/*
// @include      https://www.mangaupdates.com/*
// @include      https://myanimelist.net/*
// @include      https://anilist.co/*
// @include      https://anidb.net/anime/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://code.jquery.com/jquery-3.5.1.js
// @require      https://unpkg.com/gmxhr-fetch
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, gmfetch */
let num = 0;
let inafter = '';
let tittle = '';
let madaralist = [
    {url:'https://isekaiscan.com/',fav:'https://isekaiscan.com/wp-content/uploads/2019/01/50306s4.png'},
    {url:'https://mangakomi.com/',fav:'https://mangakomi.com/wp-content/uploads/2019/12/cropped-1ZzMnJA2_400x400.jpg'}
];

let nelo_Kakalott = [
    {url:'https://manganelo.com/getstorysearchjson',fav:'https://manganelo.com/favicon.png'},
    {url:'https://mangakakalot.com/home_json_search',fav:'https://mangakakalot.com/favicon.ico'}
]

//decide if anime or manga page, also add style

if (window.location.href.includes("https://www.anime-planet.com")){
    if($('#entry').length){
        inafter = $('#siteContainer > nav')[0].previousElementSibling
        tittle = $('#siteContainer > h1')[0].textContent.trim()
        if (window.location.href.includes("/manga/")){
            kitsu('manga');
            mangaupdates();
            anilist('manga');
            myanimelist('manga')
            doAllManga();
        }else if(window.location.href.includes("/anime/")){
            doAllAnime();
            kitsu('anime');
            myanimelist('anime')
            anilist('anime');
            anidb();
        }
    }
}
else if (window.location.href.includes("https://kitsu.io")){
    waitForKeyElements ('section.media--title h3',(function (){
        inafter = $('section.media--title')[0]
        tittle = $('section.media--title h3')[0].textContent.trim()
        if (window.location.href.includes("/manga/")){
            mangaupdates();
            anilist('manga');
            myanimelist('manga')
            animeplanet('manga')
            doAllManga();
        }else if(window.location.href.includes("/anime/")){
            doAllAnime();
            myanimelist('anime')
            anilist('anime');
            animeplanet('anime')
            anidb();
        }
    }))
}
else if (window.location.href.includes("https://www.mangaupdates.com/series.html")){
    inafter = $('#main_content div.col-12.p-2')[0]
    tittle = $('span.releasestitle')[0].textContent.trim()
    kitsu('manga');
    anilist('manga');
    myanimelist('manga')
    animeplanet('manga')
    doAllManga();
}
else if (window.location.href.includes("https://myanimelist.net/")){
    inafter = $('[itemprop="name"]')[0]
    tittle = $('[itemprop="name"]')[0].childNodes[0].textContent
    if (window.location.href.includes("/manga/")){
        kitsu('manga');
        mangaupdates();
        anilist('manga');
        animeplanet('manga')
        doAllManga();
    }else if(window.location.href.includes("/anime/")){
        doAllAnime();
        kitsu('anime');
        anilist('anime');
        animeplanet('anime')
        anidb();
    }
}
else if (window.location.href.includes("https://anilist.co")){
    waitForKeyElements ('h1',(function (){
        inafter = $('h1')[0]
        tittle = $('h1')[0].textContent.trim()
        if (window.location.href.includes("/manga/")){
            kitsu('manga');
            mangaupdates();
            myanimelist('manga')
            animeplanet('manga')
            doAllManga();
        }else if(window.location.href.includes("/anime/")){
            doAllAnime();
            kitsu('anime');
            myanimelist('anime')
            animeplanet('anime')
            anidb();
        }
    }))
}
else if (window.location.href.includes("https://anidb.net/anime/")){
    inafter = $('#layout-main > h1')[0]
    tittle = $('#tab_1_pane > div > table > tbody > tr > td > span')[0].textContent.trim()
    doAllAnime();
    kitsu('anime');
    myanimelist('anime')
    animeplanet('anime')
    anilist('anime');
}
function doAllAnime(){
    animefreak();
    animefever();
    livechart();
    nyaa();
    animehub();
    animevibe();
    animepahe();
}

function doAllManga(){
    madaralist.forEach(element => madara(element.url,element.fav))
    nelo_Kakalott.forEach(element => nelo_Kakalot(element.url,element.fav))
}

//set css styles

if(true){GM_addStyle(`
.dropbtn1 {
color: white;
border: none;
cursor: pointer;
width: 16px;
}

.dropdown1 {
position: relative;
display: inline-block;
}

.dropdown1-content {
width: 350px;
display: none;
position: absolute;
background-color: #202324;
z-index: 1;
border: ridge;
}

.dropdown1-content a {
color: rgb(247, 91, 67);
max-height: 100px;
overflow: hidden;
text-decoration: none;
background: 0;
display: flex;
z-index: 1000;
}

.dropdown1 a:hover {
background-color: rgb(27, 29, 30);
}

.dropdown1 a img {
max-height: 100px;
}

.dropdown1 a p {
display: inline-block;
vertical-align: top;
text-decoration-line: underline;
padding-left: 10px;
margin: 0.25em;
font-size: 16px
}

.show1 {display: block;}

.aka > * {
padding-right: 5px;
}

.aka {
	font-weight: 400;
	margin-top: 5px;
    flex: 0 0 100%;
}

`)}

//manga & anime:

async function kitsu(am) {
    let data = await fetchJSON(new Request('https://kitsu.io/api/edge/'+am+'?filter[text]='+tittle))
    let txt = data.data.map(ele => setdata('https://kitsu.io/'+am+'/'+ele.attributes.slug, ele.attributes.posterImage.tiny, ele.attributes.canonicalTitle))
    button (appvall('https://kitsu.io/favicon.ico', txt),0)
}

async function myanimelist(am) {
    let data = await fetchJSON(new Request('https://myanimelist.net/search/prefix.json?type='+am+'&keyword='+tittle))
    let txt = data.categories[0].items.map(ele => setdata('https://myanimelist.net/'+am+'/'+ele.id, ele.image_url, ele.name))
    button (appvall('https://myanimelist.net/favicon.ico', txt),0);
}

async function anilist(am) {
    let query = `
        query($search:String,$isAdult:Boolean){
            anime:Page(perPage:8){
                results:media(type:${am.toUpperCase()},isAdult:$isAdult,search:$search){
                    id title{
                        userPreferred
                    }
                    coverImage{
                        medium
                    }
                }
            }
        }`
    let req = {
        url:'https://graphql.anilist.co',
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        data:JSON.stringify({
            query: query,
            variables: {search: tittle}
        }),
        responseType: 'json',
    }
    let res = await GM_xml(req)
    let txt = res.data.anime.results.map(ele => setdata('https://anilist.co/'+am+'/'+ele.id, ele.coverImage.medium, ele.title.userPreferred))
    button (appvall('https://anilist.co/img/icons/favicon-16x16.png', txt),0)
}

async function animeplanet(am) {
    let data = await fetchDOM(new Request('https://www.anime-planet.com/'+am+'/all?name='+tittle))
    let txt = []
    if(data.querySelectorAll('#entry').length){
        txt = [`<a href="${data.querySelector('meta[property="og:url"]').content}">
                    <img src = "${new URL(data.querySelector('#entry div.mainEntry > source').getAttribute('src'), 'https://www.anime-planet.com/').href}">
                    <p>${data.querySelector('#siteContainer > h1').textContent.trim()}</p>
                </a>`]
    }
    else{
        txt = [...data.querySelectorAll('.card a')].map(ele => `
                <a href="${new URL(ele.pathname, 'https://www.anime-planet.com/').href}">
                    <img src = "${new URL(ele.querySelector('source').dataset.src, 'https://www.anime-planet.com/').href}">
                    <p>${ele.querySelector('.cardName').textContent.trim()}</p>
                </a>`)
    }
    button (appvall('https://www.anime-planet.com/favicon-32x32.png?v=WGowMEAKpM', txt),0)
}

//manga only:

async function mangaupdates() {
    let data = await fetchJSON(new Request('https://www.mangaupdates.com/series.html?output=json&search='+tittle))
    let txt = data.results.items.map(ele => '<a href="https://www.mangaupdates.com/series.html?id='+ele.id+'"><p>'+ele.title+'</p></a>')
    button (appvall('https://www.mangaupdates.com/favicon.ico', txt),0)
}

async function madara(url,fav) {
    let req = {
        url:fav,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-referer': new URL(fav).origin,
        },
        responseType: 'blob',
    }
    fav = URL.createObjectURL(await GM_xml(req))
    let data = await fetchDOM(new Request(new URL('/?post_type=wp-manga&s='+tittle, url).href))
    let txt = await Promise.all([...data.querySelectorAll("div.c-tabs-item__content")].map(async (ele) =>{
        let element = ele.querySelector('source')
        req.url = new URL(element.dataset.src || element.srcset || element.src)
        let img = URL.createObjectURL(await GM_xml(req))
        return '<a href="'+ele.querySelector('a').href+'"><img src = "'+img+'"><p>'+ele.querySelector('.post-title').textContent.trim()+'</p></a>'
    }))
    button (appvall(fav, txt),1)
}

async function nelo_Kakalot(url,fav) {
    let dattt = new FormData();
    dattt.append('searchword',tittle.replace(' ','_'));
    let req = {
        url: url,
        method: 'POST',
        data: dattt,
        responseType: 'json',
    }
    let res = await GM_xml(req)
    let txt = res.map(ele => setdata(ele.story_link ? ele.story_link : 'https://manganelo.com/manga/'+ele.id_encode, ele.image, createDOM(ele.name).textContent))
    button (appvall(fav, txt),1)
}

//anime only:

async function nyaa() {
    let data = await fetchDOM(new Request('https://nyaa.si/?f=0&c=0_0&s=seeders&o=desc&q='+tittle))
    let txt = [...data.querySelectorAll('tbody tr')].map(ele => `
        <a href="${new URL(ele.querySelector('[colspan] a').pathname, 'https://nyaa.si/').href}">
            <p>${ele.querySelector('[colspan] a:last-child').textContent.trim().replaceAll('_', ' ')}</p>
            <p>${ele.querySelector('td:nth-child(6)').textContent}seeds</p>
        </a>`)
    button (appvall('https://nyaa.si/static/favicon.png', txt),1)
}

async function livechart() {
    let data = await fetchDOM(new Request('https://www.livechart.me/feeds/episodes'))
    let txt = [...data.querySelectorAll('item')].slice(0,10).map(ele => `
        <a href="${ele.querySelector('link').nextSibling.data.trim()}">
            <img src = "${ele.querySelector('enclosure').getAttribute('url')}">
            <p>${ele.querySelector('title').textContent.replace(/(#\d*$)/,'')}</p>
        </a>`)
    button (appvall('https://www.livechart.me/apple-touch-icon-precomposed.png', txt),200)
}

async function animefreak() {
    let data = await fetchJSON(new Request('https://www.animefreak.tv/search/topSearch?q='+tittle))
    let txt = data.data.slice(0,10).map(ele => `
                <a href="https://www.animefreak.tv/watch/${ele.seo_name}">
                    <img src = "${ele.has_image ? 'https://www.animefreak.tv/meta/anime/' + ele.anime_id + '/' + ele.seo_name + '.jpg' : 'https://www.animefreak.tv/img/cover.jpg'}">
                    <p>${ele.name}</p>
                </a>`)
    button (appvall('https://www.animefreak.tv/favicon.ico', txt),1)
}

async function animefever() {
    let data = await fetchJSON(new Request('https://www.animefever.tv/api/anime/shows?search='+tittle.replaceAll(/’\S/g,'')))
    let txt = data.data.slice(0,10).map(ele => `
                <a href="https://www.animefever.tv/series/${ele.id}">
                    <img src = "${ele.poster ? ele.poster.path : 'https://www.animefever.tv/themes/app/assets/dist/client/img/no-cover.3917711.png'}">
                    <p>${ele.name}</p>
                </a>`)
    button (appvall('https://www.animefever.tv/favicon.ico', txt),1)
}

async function animehub() {
    let data = await fetchDOM(new Request('https://animehub.ac/search/'+(tittle.replaceAll(' ','+'))))
    let txt = [...data.querySelectorAll('#main-content ul.ulclear > li')].slice(0,10).map(ele => `
        <a href="${ele.querySelector('a').href}">
            <img src = "${ele.querySelector('source').src}">
            <p>${ele.querySelector('.item-detail').textContent.trim()}</p>
        </a>`)
    button (appvall('https://static.animecdn.xyz/assets/animehub/images/favicon.png', txt),1)
}

async function animevibe() {
    let data = await fetchDOM(new Request('https://animevibe.wtf/?s='+tittle))
    let txt = [...data.querySelectorAll('div.col-md-12')].slice(0,10).map(ele => `
        <a href="${ele.querySelector('a').href}">
            <img src = "${ele.querySelector('[style]').style.backgroundImage.match(/\bhttps?:\/\/\S+/gi)[0]}">
            <p>${ele.querySelector('a').textContent.trim()}</p>
        </a>`)
    button (appvall('https://animevibe.wtf/wp-content/themes/animevibe/assets/img/logo/192x192.png', txt),1)
}

async function anidb() {
    let req = {
        url:'https://anidb.net/perl-bin/animedb.pl?show=json&action=search&type=anime&query='+tittle,
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'x-lcontrol':'x-no-cache'
        },
        responseType: 'json',
    }
    let res = await GM_xml(req)
    let txt = res.filter((thing, index, self) =>index === self.findIndex((t) => (Number(t.id) === Number(thing.id)))).map(ele => setdata(ele.link, ele.picurl.match(/src="([^"]*)"/)[1], ele.name))
    button (appvall('https://cdn-eu.anidb.net/css/icons/touch/favicon-32x32.png?v=6APwgP3EOy', txt),0)
}

async function animepahe() {
    let req = {
        url:'https://animepahe.com/api?m=search&l=8&q='+tittle,
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
        },
        responseType: 'json',
    }
    let res = await GM_xml(req)
    let txt = res.data.map(ele => setdata('https://animepahe.com/anime/'+ele.session, ele.poster, ele.title))
    button (appvall('https://animepahe.com/pikacon-32x32.png', txt),1)
}

//necessary functions

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn1')) {
        fff('');
    }
    for(let i=1; i <= $('.dropdown1').length; i++){
        if (event.target.matches('#dropbtnn'+i)) {
            fff('#myDropdown'+i);
            document.getElementById("myDropdown"+i).classList.toggle("show1")
        }
    }
}

//just some useful functions

function appvall(fav,txt){
    num++
    return `<div class="dropdown1"><img id="dropbtnn${num}" class="dropbtn1" src = "${fav}"></img><div id="myDropdown${num}" class="dropdown1-content">${txt.join(' ')}</div></div>`
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function button (appval,nth){
    if ($('div.aka.'+nth).length){
        $('div.aka.'+nth).append(appval)
    }else{
        let ele = document.createElement("div")
        ele.className = 'aka '+nth
        ele.innerHTML = appval
        let tru = true
        for (let i = nth; i >= 0; i--) {
            if($('div.aka.'+(i)).length){
                tru = false
                insertAfter(ele, $('div.aka.'+(i))[0]);
                break
            }
        }
        if(tru){insertAfter(ele, inafter);}
    }
}

function fff(idd) {
    var dropdowns = $(":not("+idd+").dropdown1-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show1")) {
            openDropdown.classList.remove("show1");
        }
    }
}

function createDOM( content, replaceImageTags, clearIframettributes ) {
    replaceImageTags = replaceImageTags !== undefined ? replaceImageTags : true;
    clearIframettributes = clearIframettributes !== undefined ? clearIframettributes : true;
    if( replaceImageTags ) {
        content = content.replace( /<img/g, '<source');
        content = content.replace( /<\/img/g, '</source');
        content = content.replace( /<use/g, '<source');
        content = content.replace( /<\/use/g, '</source');
    }
    if( clearIframettributes ) {
        content = content.replace( /<iframe[^<]*?>/g, '<iframe>');
    }
    let dom = document.createElement( 'html' );
    dom.innerHTML = content;
    return dom;
}

function fetchJSON( request ) {
    return gmfetch( request )
        .then( response => {
        if( response.status === 200 ) {
            return response.json();
        }
        throw new Error( `Failed to receive content from "${request.url}" (status: ${response.status}) - ${response.statusText}` );
    } );
}

function fetchDOM( request ) {
    return gmfetch( request )
        .then( response => {
        if( response.status === 200 ) {
            return response.text()
                .then( data => {
                let dom = createDOM(data);
                return Promise.resolve(dom);
            } );
        }
        throw new Error( `Failed to receive content from "${request.url}" (status: ${response.status}) - ${response.statusText}` );
    } );
}

async function GM_xml(req){
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            ...req,
            onload(res) {
                resolve(this.response)
            },
        })
    })
}

function setdata( href, img, txt ) {
    return (`<a href="${href}"><img src = "${img}"><p>${txt}</p></a>`)
}










