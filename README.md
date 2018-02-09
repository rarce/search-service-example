Elastic Search Example
======================

This project show how to use elastic search for a autocomplete select using relevance and full text search.

The elasticsearch server is served from docker with docker compose, to start execute:

```
docker-compose up -d
```

The example documents are in the `sample-data` directory, the `models.json` file include a sample list of models for brazilian car from (ComparaOnline)[comparaonline.com.br], to load this data in the elasticsearch server can be use the python script `load_models.py` so:

```
# install dependencies
pip install
# run script
python load_models.py
```

Finally to test the results, is provided a express server, run with

```
# install dependencies
npm install
# run server
node index.js
```

open the sample on (http://localhost:3000/)

Configure search parameters
---------------------------

To configure the elasticsearch query edit the `search.js` file, the trade-off between full-text and relevance of every document (model) is controlled with the `function_score` parameter, the `field_value_factor` set how to get the score from the `count_by_model` of every document:
```
...
function_score: {
    query: {
    multi_match: {
        query: term,
        fields: ['brand', 'model'],
    },
    },
    field_value_factor: {
    field: 'count_by_model',
    modifier: 'log1p',
    factor: 2,
    },
}
...
```

this configuration set the following final score:
```
new_score = old_score * log(1 + factor * count_by_model)
```
