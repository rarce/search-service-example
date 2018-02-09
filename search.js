const elasticsearch = require('elasticsearch');
const jsontransform = require('node-json-transform');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
});

const mappingSearchModel = function mappingSearchModel(resp) {
  const map = {
    list: 'hits.hits',
    item: {
      text: '_source.model',
      id: '_source.model_id',
    },
  };
  const dataTransform = jsontransform.DataTransform(resp, map);
  const outputList = dataTransform.transform();
  return { items: outputList, total_count: resp.hits.total };
};

const searchModel = function searchModel(term, page) {
  let resultsFrom = 0;
  const resultsSize = 10;
  if (page) {
    resultsFrom = resultsSize * (page - 1);
  }
  const query = {
    index: 'car_models',
    type: 'document',
    body: {
      query: {
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
        },
      },
      size: resultsSize,
      from: resultsFrom,
    },
  };
  return client.search(query).then(mappingSearchModel);
};

module.exports = { searchModel };
