# ZotDegree - 4-Year Planner for UCI

by Luke Ren

Plan out your years at UCI with ease using ZotDegree!
https://zotdegree.herokuapp.com/

## Planned Features

Virtualize Requirements Lists - Improve the performance of
requirements lists by virtualizing them.

Themes - Dark mode?

Course Offering Detector - Detect if the course is planning to be
offered that quarter and that year

Requirement Colors - Color requirements or sections of
requirements a certain color that also colors them in the course
plan.

Advanced Course Search Bar - A single course search bar with ElasticSearch for courses

## Run Locally

Each command in this section should be run from the root directory of the repository (i.e. this directory).

1. Install nodejs:

[https://nodejs.org/en/](https://nodejs.org/en/)

2. Scrape course pages to get course database

```bash
source buildpack-run.sh
```

You will see a list of courses printed to screen as the scraper runs. It should take a few minutes to scrape everything.

Note: Try not to scrape course pages too often; you should only need to do this once.

3. Install node dependencies

```bash
npm install
```

4. I had to install yarn separately for some reason.

From `/client` directory:
```bash
npm install yarn
```
Then, build the client:

```bash
yarn build
```
This will produce a new folder in `/client` called `build`.

5. Start server

```bash
node server/index.js
```

You will see
```
Setting up course indexes
Server Start! Listening on port 8080
```

6. To view the app, go to `localhost:8080`