// ==UserScript==
// @name         anime/manga link to other sites
// @namespace    https://github.com/Robonau/anime-manga-userscript
// @version      1.5.2
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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://code.jquery.com/jquery-3.5.1.js
// @require      https://unpkg.com/gmxhr-fetch
// @require      https://raw.githubusercontent.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @history      1.3 add config to enable/disable
// @history      1.4 add more sites
// @history      1.4.1 refresh on save config
// @history      1.4.2 split nelo/kalot
// @history      1.4.3 add some sites
// @history      1.5 add configurable priorities for vertical and horizontal
// @history      1.5.1 dealt with negative priorities
// @history      1.5.2 add some stuff
// @connect      kitsu.io
// @connect      mangaupdates.com
// @connect      myanimelist.net
// @connect      anilist.co
// @connect      nyaa.si
// @connect      anime-planet.com
// @connect      livechart.me
// @connect      isekaiscan.com
// @connect      mangakomi.com
// @connect      animefreak.tv
// @connect      animefever.tv
// @connect      animehub.ac
// @connect      animevibe.wtf
// @connect      anidb.net
// @connect      manganelo.com
// @connect      mangakakalot.com
// @connect      animepahe.com
// @connect      mangatx.com
// @connect      zinmanga.com
// @connect      b-cdn.net
// @connect      wuxiaworld.site
// @connect      mangafast.net
// @connect      animedao.to
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, gmfetch, MonkeyConfig*/

let sites = [
    {name:'kitsu',Vdef:0,Hdef:0},
    {name:'myanimelist',Vdef:0,Hdef:0},
    {name:'anilist',Vdef:0,Hdef:0},
    {name:'animeplanet',Vdef:0,Hdef:0},
    {name:'mangaupdates',Vdef:0,Hdef:0},
    {name:'isekaiscan',Vdef:1,Hdef:0},
    {name:'mangakomi',Vdef:1,Hdef:0},
    {name:'mangatx',Vdef:1,Hdef:0},
    {name:'zinmanga',Vdef:1,Hdef:0},
    {name:'wuxiaworld',Vdef:1,Hdef:0},
    {name:'manganelo',Vdef:1,Hdef:0},
    {name:'mangakakalot',Vdef:1,Hdef:0},
    {name:'mangafast',Vdef:1,Hdef:0},
    {name:'nyaa',Vdef:1,Hdef:0},
    {name:'livechart',Vdef:2,Hdef:0},
    {name:'animefreak',Vdef:1,Hdef:0},
    {name:'animefever',Vdef:1,Hdef:0},
    {name:'animehub',Vdef:1,Hdef:0},
    {name:'animevibe',Vdef:1,Hdef:0},
    {name:'anidb',Vdef:0,Hdef:0},
    {name:'animepahe',Vdef:1,Hdef:0},
    {name:'animedao',Vdef:1,Hdef:0},
    {name:'gogoanime',Vdef:1,Hdef:0}
    ]
    let endis = {}
    let Vpriority= {}
    let Hpriority= {}
    sites.forEach(ele => {endis[ele.name] = JSON.parse('{"type": "checkbox", "default": true}')})
    sites.forEach(ele => {Vpriority[ele.name] = JSON.parse('{"type": "number", "default": '+ele.Vdef+'}')})
    sites.forEach(ele => {Hpriority[ele.name] = JSON.parse('{"type": "number", "default": '+ele.Hdef+'}')})
    
    
    let cfg = new MonkeyConfig({
        title: 'enable/disable',
        menuCommand: true,
        params: endis,
        onSave: setOptions
    });
    
    let vcfg = new MonkeyConfig({
        title: 'Vertical priority',
        menuCommand: true,
        params: Vpriority,
        onSave: setOptions
    });
    
    let hcfg = new MonkeyConfig({
        title: 'Horisontal priority',
        menuCommand: true,
        params: Hpriority,
        onSave: setOptions
    });
    
    let minV = sites.map(ele => vcfg.get(ele.name))
    
    let minH = sites.map(ele => hcfg.get(ele.name))
    
    function setOptions() {
        location.reload();
    }
    
    let num = 0;
    let inafter = '';
    let tittle = '';
    
    let madaralist = []
    cfg.get('isekaiscan') ? madaralist.push({url:'https://isekaiscan.com/', fav:'https://isekaiscan.com/wp-content/uploads/2019/01/50306s4.png', vdef:vcfg.get('isekaiscan'), Hdef:hcfg.get('isekaiscan')}) : null;
    cfg.get('mangakomi') ? madaralist.push({url:'https://mangakomi.com/', fav:'https://mangakomi.com/wp-content/uploads/2019/12/cropped-1ZzMnJA2_400x400.jpg', vdef:vcfg.get('mangakomi'), Hdef:hcfg.get('mangakomi')}) : null;
    cfg.get('mangatx') ? madaralist.push({url:'https://mangatx.com/', fav:'https://mangatx.com/wp-content/uploads/2019/10/MANGATX.png', vdef:vcfg.get('mangatx'), Hdef:hcfg.get('mangatx')}) : null;
    cfg.get('zinmanga') ? madaralist.push({url:'https://zinmanga.com/', fav:'https://zinmanga.com/wp-content/uploads/2020/02/cropped-IMG_20200222_225535-32x32.jpg', vdef:vcfg.get('zinmanga'), Hdef:hcfg.get('zinmanga')}) : null;
    cfg.get('wuxiaworld') ? madaralist.push({url:'https://wuxiaworld.site/', fav:'https://wuxiaworld.b-cdn.net/wp-content/uploads/2019/04/favicon-1.ico', vdef:vcfg.get('wuxiaworld'), Hdef:hcfg.get('wuxiaworld')}) : null;
    
    let nelo_Kakalott = []
    cfg.get('manganelo') ? nelo_Kakalott.push({url:'https://manganelo.com/getstorysearchjson',fav:'https://manganelo.com/favicon.png', vdef:vcfg.get('manganelo'), Hdef:hcfg.get('manganelo')}) : null;
    cfg.get('mangakakalot') ? nelo_Kakalott.push({url:'https://mangakakalot.com/home_json_search',fav:'https://mangakakalot.com/favicon.ico', vdef:vcfg.get('mangakakalot'), Hdef:hcfg.get('mangakakalot')}) : null;
    
    //decide if anime or manga page, also add style
    
    if (window.location.href.includes("https://www.anime-planet.com")){
        if($('#entry').length){
            inafter = $('#siteContainer > nav')[0].previousElementSibling
            tittle = $('#siteContainer > h1')[0].textContent.trim()
            if (window.location.href.includes("/manga/")){
                kitsu('manga');
                cfg.get('mangaupdates') ? mangaupdates() : null;
                cfg.get('anilist') ? anilist('manga') : null;
                cfg.get('myanimelist') ? myanimelist('manga') : null
                doAllManga();
            }else if(window.location.href.includes("/anime/")){
                doAllAnime();
                cfg.get('kitsu') ? kitsu('anime') : null;
                cfg.get('myanimelist') ? myanimelist('anime') : null
                cfg.get('anilist') ? anilist('anime') : null;
                cfg.get('anidb') ? anidb() : null;
            }
        }
    }
    else if (window.location.href.includes("https://kitsu.io")){
        waitForKeyElements ('section.media--title h3',(function (){
            inafter = $('section.media--title')[0]
            tittle = $('section.media--title h3')[0].textContent.trim()
            if (window.location.href.includes("/manga/")){
                cfg.get('mangaupdates') ? mangaupdates() : null;
                cfg.get('anilist') ? anilist('manga') : null;
                cfg.get('myanimelist') ? myanimelist('manga') : null
                cfg.get('animeplanet') ? animeplanet('manga') : null
                doAllManga();
            }else if(window.location.href.includes("/anime/")){
                doAllAnime();
                cfg.get('myanimelist') ? myanimelist('anime') : null
                cfg.get('anilist') ? anilist('anime') : null;
                cfg.get('animeplanet') ? animeplanet('anime') : null
                cfg.get('anidb') ? anidb() : null;
            }
        }))
    }
    else if (window.location.href.includes("https://www.mangaupdates.com/series.html")){
        inafter = $('#main_content div.col-12.p-2')[0]
        tittle = $('span.releasestitle')[0].textContent.trim()
        kitsu('manga');
        cfg.get('anilist') ? anilist('manga') : null;
        cfg.get('myanimelist') ? myanimelist('manga') : null
        cfg.get('animeplanet') ? animeplanet('manga') : null
        doAllManga();
    }
    else if (window.location.href.includes("https://myanimelist.net/")){
        inafter = $('[itemprop="name"]')[0]
        tittle = $('[itemprop="name"]')[0].childNodes[0].textContent
        if (window.location.href.includes("/manga/")){
            kitsu('manga');
            cfg.get('mangaupdates') ? mangaupdates() : null;
            cfg.get('anilist') ? anilist('manga') : null;
            cfg.get('animeplanet') ? animeplanet('manga') : null
            doAllManga();
        }else if(window.location.href.includes("/anime/")){
            doAllAnime();
            cfg.get('kitsu') ? kitsu('anime') : null;
            cfg.get('anilist') ? anilist('anime') : null;
            cfg.get('animeplanet') ? animeplanet('anime') : null
            cfg.get('anidb') ? anidb() : null;
        }
    }
    else if (window.location.href.includes("https://anilist.co")){
        waitForKeyElements ('h1',(function (){
            inafter = $('h1')[0]
            tittle = $('h1')[0].textContent.trim()
            if (window.location.href.includes("/manga/")){
                kitsu('manga');
                cfg.get('mangaupdates') ? mangaupdates() : null;
                cfg.get('myanimelist') ? myanimelist('manga') : null
                cfg.get('animeplanet') ? animeplanet('manga') : null
                doAllManga();
            }else if(window.location.href.includes("/anime/")){
                doAllAnime();
                cfg.get('kitsu') ? kitsu('anime') : null;
                cfg.get('myanimelist') ? myanimelist('anime') : null
                cfg.get('animeplanet') ? animeplanet('anime') : null
                cfg.get('anidb') ? anidb() : null;
            }
        }))
    }
    else if (window.location.href.includes("https://anidb.net/anime/")){
        inafter = $('#layout-main > h1')[0]
        tittle = $('#tab_1_pane > div > table > tbody > tr > td > span')[0].textContent.trim()
        doAllAnime();
        cfg.get('kitsu') ? kitsu('anime') : null;
        cfg.get('myanimelist') ? myanimelist('anime') : null
        cfg.get('animeplanet') ? animeplanet('anime') : null
        cfg.get('anilist') ? anilist('anime') : null;
    }
    function doAllAnime(){
        cfg.get('animefreak') ? animefreak() : null
        cfg.get('animefever') ? animefever() : null
        cfg.get('livechart') ? livechart() : null
        cfg.get('nyaa') ? nyaa() : null
        cfg.get('animehub') ? animehub() : null
        cfg.get('animevibe') ? animevibe() : null;
        cfg.get('animepahe') ? animepahe() : null
        cfg.get('animedao') ? animedao() : null
        cfg.get('gogoanime') ? gogoanime() : null
    }
    
    function doAllManga(){
        madaralist.forEach(element => madara(element))
        nelo_Kakalott.forEach(element => nelo_Kakalot(element))
        cfg.get('mangafast') ? mangafast() : null
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
        button (appvall('https://kitsu.io/favicon.ico', txt,hcfg.get('kitsu')),vcfg.get('kitsu'),hcfg.get('kitsu'))
    }
    
    async function myanimelist(am) {
        let data = await fetchJSON(new Request('https://myanimelist.net/search/prefix.json?type='+am+'&keyword='+tittle))
        let txt = data.categories[0].items.map(ele => setdata('https://myanimelist.net/'+am+'/'+ele.id, ele.image_url, ele.name))
        button (appvall('https://myanimelist.net/favicon.ico', txt,hcfg.get('myanimelist')),vcfg.get('myanimelist'),hcfg.get('myanimelist'));
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
        button (appvall('https://anilist.co/img/icons/favicon-16x16.png', txt,hcfg.get('anilist')),vcfg.get('anilist'),hcfg.get('anilist'))
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
        button (appvall('https://www.anime-planet.com/favicon-32x32.png?v=WGowMEAKpM', txt,hcfg.get('animeplanet')),vcfg.get('animeplanet'),hcfg.get('animeplanet'))
    }
    
    //manga only:
    
    async function mangaupdates() {
        let data = await fetchJSON(new Request('https://www.mangaupdates.com/series.html?output=json&search='+tittle))
        let txt = data.results.items.map(ele => '<a href="https://www.mangaupdates.com/series.html?id='+ele.id+'"><p>'+ele.title+'</p></a>')
        button (appvall('https://www.mangaupdates.com/favicon.ico', txt,hcfg.get('mangaupdates')),vcfg.get('mangaupdates'),hcfg.get('mangaupdates'))
    }
    
    async function madara(elem) {
        let req = {
            url:elem.fav,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-referer': new URL(elem.fav).origin,
            },
            responseType: 'blob',
        }
        let fav = URL.createObjectURL(await GM_xml(req))
        let data = await fetchDOM(new Request(new URL('/?post_type=wp-manga&s='+tittle, elem.url).href))
        let txt = await Promise.all([...data.querySelectorAll("div.c-tabs-item__content")].map(async (ele) =>{
            let element = ele.querySelector('source')
            req.url = new URL(element.dataset.src || element.src || element.srcset)
            let img = URL.createObjectURL(await GM_xml(req))
            return '<a href="'+ele.querySelector('a').href+'"><img src = "'+img+'"><p>'+ele.querySelector('.post-title').textContent.trim()+'</p></a>'
        }))
        button (appvall(fav, txt,elem.Hdef),elem.vdef,elem.Hdef)
    }
    
    async function nelo_Kakalot(elem) {
        let dattt = new FormData();
        dattt.append('searchword',tittle.replace(' ','_'));
        let req = {
            url: elem.url,
            method: 'POST',
            data: dattt,
            responseType: 'json',
        }
        let res = await GM_xml(req)
        let txt = res.map(ele => setdata(ele.story_link ? ele.story_link : 'https://manganelo.com/manga/'+ele.id_encode, ele.image, createDOM(ele.name).textContent))
        button (appvall(elem.fav, txt,elem.Hdef),elem.vdef,elem.Hdef)
    }
    
    async function mangafast() {
        let data = await fetchDOM(new Request('https://mangafast.net/?s='+tittle))
        let txt = [...data.querySelectorAll('.ls5 a:not(.lats)')].map(ele => `
                    <a href="${ele.href}">
                        <img src = "${ele.querySelector('source').dataset.src}">
                        <p>${ele.textContent.trim()}</p>
                    </a>`)
        button (appvall('https://mangafast.net/icon.ico', txt,hcfg.get('mangafast')),vcfg.get('mangafast'),hcfg.get('mangafast'))
    }
    
    //anime only:
    
    async function nyaa() {
        let data = await fetchDOM(new Request('https://nyaa.si/?f=0&c=0_0&s=seeders&o=desc&q='+tittle))
        let txt = [...data.querySelectorAll('tbody tr')].map(ele => `
            <a href="${new URL(ele.querySelector('[colspan] a').pathname, 'https://nyaa.si/').href}">
                <p>${ele.querySelector('[colspan] a:last-child').textContent.trim().replaceAll('_', ' ')}</p>
                <p>${ele.querySelector('td:nth-child(6)').textContent}seeds</p>
            </a>`)
        button (appvall('https://nyaa.si/static/favicon.png', txt,hcfg.get('nyaa')),vcfg.get('nyaa'),hcfg.get('nyaa'))
    }
    
    async function livechart() {
        let data = await fetchDOM(new Request('https://www.livechart.me/feeds/episodes'))
        let txt = [...data.querySelectorAll('item')].slice(0,10).map(ele => `
            <a href="${ele.querySelector('link').nextSibling.data.trim()}">
                <img src = "${ele.querySelector('enclosure').getAttribute('url')}">
                <p>${ele.querySelector('title').textContent.replace(/(#\d*$)/,'')}</p>
            </a>`)
        button (appvall('https://www.livechart.me/apple-touch-icon-precomposed.png', txt,hcfg.get('livechart')),vcfg.get('livechart'),hcfg.get('livechart'))
    }
    
    async function animefreak() {
        let data = await fetchJSON(new Request('https://www.animefreak.tv/search/topSearch?q='+tittle))
        let txt = data.data.slice(0,10).map(ele => `
                    <a href="https://www.animefreak.tv/watch/${ele.seo_name}">
                        <img src = "${ele.has_image ? 'https://www.animefreak.tv/meta/anime/' + ele.anime_id + '/' + ele.seo_name + '.jpg' : 'https://www.animefreak.tv/img/cover.jpg'}">
                        <p>${ele.name}</p>
                    </a>`)
        button (appvall('https://www.animefreak.tv/favicon.ico', txt,hcfg.get('animefreak')),vcfg.get('animefreak'),hcfg.get('animefreak'))
    }
    
    async function animefever() {
        let data = await fetchJSON(new Request('https://www.animefever.tv/api/anime/shows?search='+tittle.replaceAll(/’\S/g,'')))
        let txt = data.data.slice(0,10).map(ele => `
                    <a href="https://www.animefever.tv/series/${ele.id}">
                        <img src = "${ele.poster ? ele.poster.path : 'https://www.animefever.tv/themes/app/assets/dist/client/img/no-cover.3917711.png'}">
                        <p>${ele.name}</p>
                    </a>`)
        button (appvall('https://www.animefever.tv/favicon.ico', txt,hcfg.get('animefever')),vcfg.get('animefever'),hcfg.get('animefever'))
    }
    
    async function animehub() {
        let data = await fetchDOM(new Request('https://animehub.ac/search/'+(tittle.replaceAll(' ','+'))))
        let txt = [...data.querySelectorAll('#main-content ul.ulclear > li')].slice(0,10).map(ele => `
            <a href="${ele.querySelector('a').href}">
                <img src = "${ele.querySelector('source').src}">
                <p>${ele.querySelector('.item-detail').textContent.trim()}</p>
            </a>`)
        button (appvall('https://static.animecdn.xyz/assets/animehub/images/favicon.png', txt,hcfg.get('animehub')),vcfg.get('animehub'),hcfg.get('animehub'))
    }
    
    async function animevibe() {
        let data = await fetchDOM(new Request('https://animevibe.wtf/?s='+tittle))
        let txt = [...data.querySelectorAll('div.col-md-12')].slice(0,10).map(ele => `
            <a href="${ele.querySelector('a').href}">
                <img src = "${ele.querySelector('[style]').style.backgroundImage.match(/\bhttps?:\/\/\S+/gi)[0]}">
                <p>${ele.querySelector('a').textContent.trim()}</p>
            </a>`)
        button (appvall('https://animevibe.wtf/wp-content/themes/animevibe/assets/img/logo/192x192.png', txt,hcfg.get('animevibe')),vcfg.get('animevibe'),hcfg.get('animevibe'))
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
        button (appvall('https://cdn-eu.anidb.net/css/icons/touch/favicon-32x32.png?v=6APwgP3EOy', txt,hcfg.get('anidb')),vcfg.get('anidb'),hcfg.get('anidb'))
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
        button (appvall('https://animepahe.com/pikacon-32x32.png', txt,hcfg.get('animepahe')),vcfg.get('animepahe'),hcfg.get('animepahe'))
    }
    
    async function animedao() {
        let data = await fetchDOM(new Request('https://animedao.to/search/?key='+tittle))
        let txt = [...data.querySelectorAll('body > div.container.content > div:nth-child(2) > div > a')].map(ele => `
                    <a href="https://animedao.to${ele.pathname}">
                        <img src = "https://animedao.to/${ele.querySelector('source').dataset.src}">
                        <p>${ele.querySelector('h4').textContent}</p>
                    </a>`)
        button (appvall('https://animedao.to/favicon.ico', txt,hcfg.get('animedao')),vcfg.get('animedao'),hcfg.get('animedao'))
    }
    
    async function gogoanime() {
        let data = await fetchJSON(new Request('https://ajax.gogocdn.net/site/loadAjaxSearch?id=-1&link_web=https%3A%2F%2Fgogoanime.so%2F&keyword='+tittle))
        let dom = createDOM(data.content)
        let txt = [...dom.querySelectorAll('a')].map(ele => `
                    <a href="${ele.href}">
                        <img src = "${ele.querySelector('[style]').style.backgroundImage.match(/url\("([^"]*)"\)/)[1]}">
                        <p>${ele.textContent}</p>
                    </a>`)
        button (appvall('https://cdn.gogocdn.net/files/gogo/img/favicon.ico', txt,hcfg.get('gogoanime')),vcfg.get('gogoanime'),hcfg.get('gogoanime'))
    }
    
    // functions
    
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
    
    function appvall(fav,txt,hth){
        num++
        return `<div class="dropdown1 h${hth}"><img id="dropbtnn${num}" class="dropbtn1" src = "${fav}"></img><div id="myDropdown${num}" class="dropdown1-content">${txt.join(' ')}</div></div>`
    }
    
    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }
    
    function button (appval,vnth,hnth){
        if ($('div.aka.v'+vnth).length){
            let truu = true
            let ele = document.createElement("div")
            ele.innerHTML = appval
            for (let i = hnth; i >= Math.min(...minH); i--) {
                if($('div.aka.v'+vnth+' > .h'+i).length){
                    truu = false
                    insertAfter(ele.querySelector('div.dropdown1'),$('div.aka.v'+vnth+' > .h'+i)[0])
                    break
                }
            }
            if(truu){
                $('div.aka.v'+vnth+' div')[0].parentNode.insertBefore(ele.querySelector('div.dropdown1'), $('div.aka.v'+vnth+' div')[0]);
            }
        }
        else{
            let ele = document.createElement("div")
            ele.className = 'aka v'+vnth
            ele.innerHTML = appval
            let tru = true
            for (let i = vnth; i >= Math.min(...minV); i--) {
                if($('div.aka.v'+(i)).length){
                    tru = false
                    insertAfter(ele, $('div.aka.v'+(i))[0]);
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
    
    
    
    
    
    
    
    
    
    
    
    