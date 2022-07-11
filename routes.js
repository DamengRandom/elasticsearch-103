const express = require("express");
const elastic = require("elasticsearch");

const router = express.Router();

const bodyParser = express.json();

const elasticClient = elastic.Client({
  host: "localhost:9200",
});

// API request interceptor

router.use((req, res, next) => {
  elasticClient
    .index({
      index: "logs",
      body: {
        url: req.url,
        method: req.method,
      },
    })
    .then((res) => {
      console.log("Indexed: ", res);
    })
    .catch((error) => {
      console.error(error);
    });

  next();
});

// Routes deinfitions

router.post("/products", bodyParser, (req, res, next) => {
  elasticClient
    .index({
      index: "products",
      body: req.body,
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      return res.status(500).json({ msg: error?.message });
    });
});

router.get("/products/:id", bodyParser, (req, res, next) => {
  let query = {
    index: "products",
    id: req.params.id,
  };

  elasticClient
    .get(query)
    .then((result) => {
      if (!res) res.status(404).json({ msg: "Oops, record not found .." });

      res.status(200).json({
        product: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error?.message });
    });
});

router.put("/products/:id", bodyParser, (req, res, next) => {
  elasticClient
    .update({
      index: "products",
      id: req.params.id,
      body: { doc: req.body },
    })
    .then((result) => {
      res.status(200).json({
        msg: "product updated ..",
      });
    })
    .catch((error) => {
      return res.status(500).json({ msg: error?.message });
    });
});

router.delete("/products/:id", bodyParser, (req, res, next) => {
  elasticClient
    .delete({
      index: "products",
      id: req.params.id,
    })
    .then((result) => {
      res.status(200).json({
        msg: "product has been deleted ..",
      });
    })
    .catch((error) => {
      return res.status(500).json({ msg: error?.message });
    });
});

router.get("/products", bodyParser, (req, res, next) => {
  let query = {
    index: "products",
  };
  if (req.query.product) query.q = `*${req.query.product}*`;

  elasticClient
    .search(query)
    .then((result) => {
      res.status(200).json({
        products: result.hits.hits,
      });
    })
    .catch((error) => {
      return res.status(500).json({ msg: error?.message });
    });
});

module.exports = router;
