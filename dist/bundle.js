!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=4)}([function(e,t,o){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(5)),u=n(o(3)),s=o(6).verbose(),i=n(o(2)),c=r.default.join(process.cwd(),i.default.get("db.path"));let a;u.default.existsSync(c)?a=s.cached.Database(c):(u.default.mkdirSync(r.default.dirname(c),{recursive:!0}),a=new s.Database(c,e=>{if(e)throw new Error("Failed to create a database connection");console.log("Connected to the words count database."),a.run("CREATE TABLE IF NOT EXISTS words_statistics (\n            word VARCHAR(50) PRIMARY KEY,\n            counter INTEGER DEFAULT 0 NOT NULL\n        ) WITHOUT ROWID;")})),t.default=a},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("config")},function(e,t){e.exports=require("fs")},function(e,t,o){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(2)),u=n(o(0)),s=n(o(7)),i=parseInt(process.env.PORT,10)||r.default.get("server.port"),c=s.default.listen(i,e=>e?console.error(e):console.log(`server is listening on ${i}`));process.on("SIGTERM",()=>{console.info("Shutting down the server..."),c.close(()=>{u.default.close(e=>{e&&console.error(e.message),console.log("SQLite connection closed."),process.exit(0)})})})},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("sqlite3")},function(e,t,o){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(1)),u=n(o(8)),s=n(o(9)),i=n(o(10)),c=n(o(11)),a=n(o(16)),d=o(20),l=r.default();l.use(s.default()),l.use(u.default()),l.use(i.default.text({limit:"50gb"})),l.use("/word-counter",c.default),l.use("/word-statistics",a.default),l.use(d.errorHandler),t.default=l},function(e,t){e.exports=require("compression")},function(e,t){e.exports=require("helmet")},function(e,t){e.exports=require("body-parser")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=o(1),r=o(12),u=n.Router();u.post("/",r.postWordCount),t.default=u},function(e,t,o){"use strict";var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,u){function s(e){try{c(n.next(e))}catch(e){u(e)}}function i(e){try{c(n.throw(e))}catch(e){u(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,i)}c((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=o(13);t.postWordCount=(e,t,o)=>n(void 0,void 0,void 0,(function*(){const o=e.get("Content-Type");console.log(e.body,o,e.is("application/json"),e.body.filepath),e.is("text/plain")?(yield r.countWordsInText(e.body),t.sendStatus(200)):e.is("application/json")&&(e.body.filepath||e.body.url)?(yield r.countWordsInTextFile(e.body),t.send(200)):t.status(400).send("An unsupported Content-Type was provided")}))},function(e,t,o){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(3)),u=o(14),s=o(15);t.countWordsInText=e=>{const t=u.cleanUpText(e).split(";").reduce((e,t)=>(e[t]=(e[t]||0)+1,e),{});return s.insertWordStatistics(t)},t.countWordsInTextFile=e=>{const t=r.default.createReadStream(e);return new Promise((e,o)=>{t.on("data",e=>{console.log(e)}),t.on("error",o),t.on("end",()=>{e()})})}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.cleanUpText=e=>(e=(e=e.replace(/[&\/\\#,+()!$~%.'":*?<>{}]/g,"")).replace(/\s+/g,";"),console.log(e.toLowerCase()),e.toLowerCase())},function(e,t,o){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(0));t.insertWordStatistics=e=>new Promise((t,o)=>{const n=r.default.prepare("INSERT INTO words_statistics (word, counter) VALUES(:word, :counter)\n        ON CONFLICT(word)\n        DO UPDATE SET counter = counter + :counter;\n        ");Object.entries(e).forEach(e=>{n.run(e,e=>{e&&o(e)})}),n.finalize(e=>{e?o(e):t()})})},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=o(1),r=o(17),u=n.Router();u.get("/",r.getWordStatistics),t.default=u},function(e,t,o){"use strict";var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,u){function s(e){try{c(n.next(e))}catch(e){u(e)}}function i(e){try{c(n.throw(e))}catch(e){u(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,i)}c((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=o(18);t.getWordStatistics=(e,t,o)=>n(void 0,void 0,void 0,(function*(){const{word:n}=e.query;if(n)try{const e=yield r.queryWordCount(n);t.status(200).send(e.toString())}catch(e){o(e)}else t.sendStatus(400)}))},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=o(19);t.queryWordCount=e=>n.selectWordCount(e)},function(e,t,o){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(0));t.selectWordCount=e=>new Promise((t,o)=>{r.default.get("SELECT counter FROM words_statistics WHERE word = (?)",[e],(e,n)=>{var r;e?o(e):t(null!==(r=null==n?void 0:n.counter)&&void 0!==r?r:0)})})},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.errorHandler=(e,t,o,n)=>{o.status(500).json({message:e.message})}}]);