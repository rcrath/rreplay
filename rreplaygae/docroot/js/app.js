/*global jtminjsDecorateWithUtilities, document, setTimeout */
/*jslint browser, multivar, white, fudge, for */

var app = {},
    jt = {};

(function () {
    "use strict";

    ////////////////////////////////////////
    // local variables
    ////////////////////////////////////////

    var typing = { refidx: 0, charidx: 0 };


    ////////////////////////////////////////
    // local helper functions
    ////////////////////////////////////////

    function displayContactLink (disp) {
        var ref = typing.refs[typing.refidx];
        if(ref.href) {
            disp = ["a", {href: ref.href, onclick: ref.onclick},
                    disp]; }
        jt.out("dcrspan" + typing.refidx, jt.tac2html(disp));
    }


    function typeContactInfo () {
        var ref;
        if(typing.refidx < typing.refs.length) {
            ref = typing.refs[typing.refidx];
            if(ref.text) {
                if(typing.charidx < ref.text.length) {
                    displayContactLink(ref.text.slice(0, typing.charidx));
                    typing.charidx += 1; }
                else {
                    displayContactLink(ref.text);
                    typing.refidx += 1;
                    typing.charidx = 0; } }
            else if(ref.imgsrc) {
                displayContactLink(jt.tac2html(
                    ["img", {src: ref.imgsrc, cla: "refimg"}]));
                typing.refidx += 1;
                typing.charidx = 0; }
            setTimeout(typeContactInfo, 100); }
    }


    function displayContactInfo () {
        var emaddr = "rreplay",
            site = "way.net",
            refs, html = [];
        emaddr += "@" + site;
        refs = [{text: "contact:"},
                {text: " "},  //space breaker
                {text: emaddr,
                 href: "mailto:" + emaddr}];
        refs.forEach(function (ignore /*ref*/, index) {
            html.push(["span", {id: "dcrspan" + index, cla: "dcrspan"}]); });
        html.push(["span", {id: "dcorgspan"},
                   jt.byId("contactdiv").innerHTML]);
        jt.out("contactdiv", jt.tac2html(html));
        typing.refs = refs;
        setTimeout(typeContactInfo, 100);
    }


    function externalizeLinks () {
        var i, link, links, href;
        links = jt.byId("bodyid").getElementsByTagName("a");
        for(i = 0; i < links.length; i += 1) {
            link = links[i];
            if(link.href && link.href.indexOf("#") < 0) {
                link.href = "#" + link.href;
                jt.on(link, "click", app.openWindowLink); } }
    }


    //Sometimes there's a significant lag loading the fonts, and if
    //that is done in the index page then you are just sitting there
    //waiting for the site to display.  That's annoying and looks bad.
    //Need to avoid that problem, so load the fonts last.  This might
    //cause a blink in the display, but it's worth it to not have that
    //hideous lag occasionally.
    function addFontSupport () {
        var fontlink = document.createElement("link");
        fontlink.href = "http://fonts.googleapis.com/css?family=Oxygen";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
    }


    ////////////////////////////////////////
    // application level functions
    ////////////////////////////////////////

    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        addFontSupport();
        externalizeLinks();
        displayContactInfo();
    };


    app.toggledivdisp = function (divid) {
        var div = jt.byId(divid);
        if(div) {
            if(div.style.display === "block") {
                div.style.display = "none"; }
            else {
                div.style.display = "block"; } }
    };


    app.openWindowLink = function (event) {
        var href = this.href;
        href = href.slice(href.indexOf("#") + 1);
        window.open(href);
        jt.evtend(event);
    };


} () );

