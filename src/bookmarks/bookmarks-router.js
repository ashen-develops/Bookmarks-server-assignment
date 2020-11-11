const express = require('express');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const { bookmarks } = require('../store');
// console.log(bookmarks);

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const {url, description = [] } = req.body;

    if(!url) {
      logger.error('URL is empty');
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!description) {
      logger.error('A description is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    const id = uuid();

    const bookmark = { 
      id: uuid(), 
      url, 
      description
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('bookmarks/:id')
  .get((req, res) => {
    const {id} = req.params.id;
    const bookmark = bookmarks.find(b => b.id === id);

    if(!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const {id} = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id === id);

    if(bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Card with id ${id} deleted.`);

    res
      .status(204)
      .end();
  });

module.exports = bookmarksRouter;



