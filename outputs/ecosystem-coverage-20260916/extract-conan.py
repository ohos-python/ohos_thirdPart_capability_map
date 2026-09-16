"""Extract recipe metadata with AST only: NEVER import or execute a recipe."""
import ast
import hashlib
import json
from pathlib import Path
import tarfile

root = Path(__file__).resolve().parent
source = json.loads((root / 'conan-source.json').read_text(encoding='utf-8'))
archive = root / 'conan-index.tar.gz'
assert hashlib.sha256(archive.read_bytes()).hexdigest() == source['archiveSha256']
recipes = {}
configs = set()
errors = []
with tarfile.open(archive, 'r:gz') as tar:
    for member in tar:
        parts = member.name.split('/')
        if len(parts) == 4 and parts[1] == 'recipes' and parts[3] == 'config.yml':
            configs.add(parts[2])
        if len(parts) != 5 or parts[1] != 'recipes' or parts[-1] != 'conanfile.py':
            continue
        raw = tar.extractfile(member).read()
        try:
            tree = ast.parse(raw.decode('utf-8-sig'))
        except (SyntaxError, UnicodeDecodeError) as exc:
            errors.append({'path': member.name, 'error': str(exc)})
            continue
        attrs = {}
        for node in tree.body:
            if not isinstance(node, ast.ClassDef):
                continue
            for stmt in node.body:
                if isinstance(stmt, ast.Assign):
                    for target in stmt.targets:
                        if isinstance(target, ast.Name) and target.id in ('name', 'description', 'homepage', 'topics', 'license', 'package_type'):
                            try:
                                attrs[target.id] = ast.literal_eval(stmt.value)
                            except (ValueError, TypeError):
                                pass
        item = {'name': parts[2], 'description': attrs.get('description', ''), 'homepage': attrs.get('homepage', ''), 'keywords': attrs.get('topics', []), 'packageType': attrs.get('package_type'), 'path': '/'.join(parts[1:]), 'sha256': hashlib.sha256(raw).hexdigest()}
        item['sourceUrl'] = f"https://github.com/conan-io/conan-center-index/blob/{source['commit']}/{item['path']}"
        recipes.setdefault(parts[2], []).append(item)
packages = []
for name in sorted(configs):
    candidates = sorted(recipes.get(name, []), key=lambda r: (not r['description'], '/all/' not in r['path'], r['path']))
    item = candidates[0] if candidates else {'name': name, 'description': '', 'homepage': '', 'keywords': [], 'sourceUrl': f"https://github.com/conan-io/conan-center-index/tree/{source['commit']}/recipes/{name}"}
    item['recipeVariants'] = len(candidates)
    packages.append(item)
assert len(packages) > 1000
result = {**source, 'definition': 'One package family per recipes/<name>/config.yml; static AST metadata from a representative conanfile.py', 'parseErrors': errors, 'packages': packages}
(root / 'conan-registry.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'conanPackages': len(packages), 'missingDescription': sum(not p['description'] for p in packages), 'parseErrors': len(errors)}))
