const express = require("express")
const app = express();
const path = require('path');
const pg = require("pg")

app.use(express.json())

const { client, initDB } = require('./db.js');

app.get('/api/flavors', async (req, res, next) => {
    try {
      const SQL = `SELECT * from flavors;`
      const response = await client.query(SQL)
      res.send(response.rows)
    } catch (ex) {
      next(ex)
    }
  });

  app.get('/api/flavors/:id', async (req, res, next) => {
   const {id} = req.params
   console.log(id)
    try {
      const SQL = `SELECT * from flavors WHERE id = $1;`
      const response = await client.query(SQL, [id]);
      if (response.rows.length === 0) {
        return res.status(404).send({ error: "Flavor not found" });
      }
      res.send(response.rows)
    } catch (ex) {
      next(ex)
    }
  });

  app.post('/api/flavors', async (req, res, next) => {
    const {name, is_favorite} = req.body;

     try {
       const SQL =
         `INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *;`;

       const response = await client.query(SQL, [name, is_favorite]);
       res.status(201).send(response.rows[0]);
     } catch (ex) {
       next(ex)
     }
   });

   app.delete('/api/flavors/:id', async (req, res, next) => {
    const {id} = req.params
     try {
       const SQL = `DELETE from flavors WHERE id = $1;`
       await client.query(SQL, [id]);
      res.sendStatus(204);
     } catch (ex) {
        next(ex);
     }
    });

    app.put('/api/flavors/:id', async (req, res, next) => {
        const { id } = req.params;
        const {name, is_favorite } = req.body;
        try {
            const SQL = `
            UPDATE flavors
            SET name = $1, is_favorite = $2, updated_at = now()
            WHERE id = $3
            RETURNING *;
          `;
          const response = await client.query(SQL, [name, is_favorite, id]);
          if (response.rows.length === 0) {
            return res.status(404).send({ error: "Flavor not found" });
          }
          res.send(response.rows[0]);
        } catch (ex) {
          next(ex);
        }
      });

const init = async () => {

await initDB();

  console.log('data seeded');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  };

  init();
