word-counter-service
====================

The word-counter-service can take in your textual input and break it apart into single words. Then you may query it for the amount of times a certain word has appeared in your texts and receive a precise result.


## Installation
Please clone/download the project and run the following commands to get the server up and running:

```bash
npm install
npm start
```

## Testing

```bash
npm test
```

## Prerequisites


## API

### word-counter endpoint

An endpoint, which receives textual data, breaks it into words and keeps a count of the number of times it has already encountered said words. There are 3 approaches to submitting textual content to the endpoint:
 
1. Through a body of a post request to **/word-counter**

Details:

```http
POST /word-counter
Content-Type text/plain

[Your input text goes here]
```

Example:

```http
POST /word-counter
Content-Type text/plain

Hi! My name is (what?), my name is (who?), my name is Slim Shady
```

Resulting in

| word | count|
|------|------|
| hi | 1 |
| my | 3 |
| name | 3 |
| is | 3 |
| what | 1 |
| who | 1 |
| slim | 1 |
| shady | 1 |

2. A file submission. It is done by sending the filepath in the body of a post request in the follwing way:

```http
POST /word-counter
Content-Type application/json

{
    "filepath": [your filepath goes here]
}
```

Example:

```http
POST /word-counter
Content-Type application/json

{
    "filepath": "D:\\Documents\\large_file.txt"
}
```

3. A url submission. It is done by sending the url in the body of a post request in the follwing way:

```http
POST /word-counter
Content-Type application/json

{
    "url": [your filepath goes here]
}
```

Example:

```http
POST /word-counter
Content-Type application/json

{
    "url": "https://www.somefile.com/some/file.txt"
}
```

#### Options

**async** - default to `true`. By passing `?async=false` in the query paramters of any of the requests above, you can make the word count process block and allow other requests only when it finishes processing the current request.


### word-statistics endpoint

An endpoint for querying the amount of times a word has been encountered by the word-counter-service. It is a GET request expecting a word to be provided as a query parameter

Details:

```http
GET /word-statistics?word=[your word goes here]
```

Example:

```http
GET /word-statistics?word=name
```

Returns 3 if used after the *word-counter* example.


## Tech overview

#### Server framework

I have chosen express since I am most familiar with it and it has the widest support. I have considered more optimized frameworks like *Koa* and *Fasitify* but decided it was not worth the risk for this project.

#### Database

I had a lot of conflicting thoughts over which database to choose. So I decided to cross out options based on the characteristics of my data needs:

* **Data modeling:** My data is key-value, which could be considered a defined schema. It will not leverage hierarchical features or data relations, however. (Graph databases our out of the questions then. Still fits: key-value, columns, document, table)
* **Persistence:** Since the data is key-value structured my initial thoughts were obviously Redis or Memcached. The problem is I am expecting to receive gigabytes of data, so my memory wouldn't be able to handle the data volume (and their persistency configuration options exist only for backups and not for flushing memory data). I then opted for LevelDB but found out it would work as expected only if the max file size is a couple of MB tops (which means I would end up with huge amounts of files as storage). Other LevelDB based solutions such as RocksDB were out of the questions as well (plus most are unsupported by Node.js).
* **Consistency:** I assumed the words-statistics ednpoint should return accurate data, which tips the balance to the RDBMS solutions slightly (some NoSQL databases prioritize consistency as well, but Cassandra's eventual consistency approach seemed inappropriate).
Later on (specifically after seeing how long the text parsing and insertion process is), I reevaluated this idea and decided to allow both immidiate consistency (by blocking the service and making it *await* results) and eventual consitency (by running the text addition logic in async mode **defaultly**). It was too late to make huge changes, but I realized my initial assumtion was wrong and leveraging *Node.js* strongsuit in side-thread I/O operations is the best way to go (which means it is all about evnetual consistency).
* **Read-write operations:** I realized my workload is mostly write-intensive. My reads are infrequent and do not require complex querying. I initially thought it tipped the scales back to NoSQL, but then realized that streaming my data and doing batch insertions (which should take milliseconds each) is also a fitting solution in my case. Locking and syncing data however is not something I wanted to manage, so I was okay with having one fast writer instead.
* **Data storage:** This is the big one. I realized I can not assume that whoever downloads this project would have a pre-existing database setup. I also assumed that since storage is not cheap, I was not expected to provide a cloud-based data cluster or support distribution and scaling (without mentioning the data volume didn't justify it). That ended up ruling out solutions like MongoDB or CouchBase. My only viable solution at this point was an **embedded database**. Moreover, it had to able to handle gigabytes of data as previously stated (hence the aforementioned LevelDB didn't fit). NeDB seemed like an interesting option but a closer look reveiled it has been abandoned for some time and I was really wary of the support.

Finally, I came to the conclusion, my best choice would be SQLite. It is embedded, has a pretty fast writer, can theoretically store up to 140TB on disk, has a Node.js client (even though its documentation leaves a lot to be desired) and supports my word-count upsert logic.
I admit I had a lot of second thoughts about this choice along the way, but I thought my reasoning made sense and other options were not as fitting to my use case, so I ended up staying with this choice.

#### Database client

I was considering either *node-sqlite3* or *better-sqlite3*. True to its name *better-sqlite3* seemed like the more user-friendly version and according to them, it benchmarks better performance-wise. It is synchronous,  however, and I had felt that *sqlite3* asynchronous architecture would allow me to leverage my disregard for insertion order better as. Also, there is a lack of proper documentation and support as it is, so I preferred to follow a more supported project.
