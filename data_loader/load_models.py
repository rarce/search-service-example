import json
import elasticsearch
import elasticsearch.helpers

es = elasticsearch.Elasticsearch()
docs = json.load(open('../sample-data/models.json'))

# transform year_list to array
for i in range(len(docs)):
    docs[i]['year_list'] = docs[i]['year_list'].split(',')

success, failed = 0, 0
for ok, item in elasticsearch.helpers.streaming_bulk(es, docs):
    if not ok:
        failed += 1
    else:
        success += 1

print("inserted %s items successful, and failed %s items" % (success, failed))