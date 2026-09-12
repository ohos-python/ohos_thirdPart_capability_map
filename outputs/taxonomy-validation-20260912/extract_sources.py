import json
import argparse
from pathlib import Path
import openpyxl

out = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description='从原始项目工作簿重新生成 local-source.json')
parser.add_argument('source', type=Path, help='全部项目三方库归一总结表.xlsx 的路径')
source = parser.parse_args().source.resolve(strict=True)
wb = openpyxl.load_workbook(source, read_only=True, data_only=True)
rows = []
for rownum, r in enumerate(wb['项目三方库总表'].iter_rows(min_row=4, values_only=True), 4):
    if r[2]:
        rows.append(dict(zip(['id','source','project','language','framework','dependencies','dependencyCount','url','hasDependencies'], r)) | {'sourceRow': rownum})
(out / 'local-source.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
print('Extracted', len(rows), 'project rows')
for r in rows:
    print(str(r['id']) + '\t' + str(r['project']) + '\t' + str(r['language']) + '\t' + str(r['framework']))
