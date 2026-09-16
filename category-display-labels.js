/* Homepage presentation only. IDs, memberships, counts and raw snapshots stay unchanged. */
(() => {
  const aliases = {
    '开发基础库': '通用编程工具库',
    '业务与行业组件': '行业应用与待复核库',
    '业务与领域组件': '行业应用与待复核库'
  };
  const label = value => aliases[value] || value;
  function decorate(catalog) {
    const categories = catalog.categories.map(c => ({...c, label: label(c.label)}));
    const byId = new Map(categories.map(c => [c.id, c]));
    const libraries = catalog.libraries.map(r => r.categoryId && byId.has(r.categoryId)
      ? {...r, category: byId.get(r.categoryId).label} : r);
    return {...catalog, categories, libraries};
  }
  window.CAPABILITY_CATEGORY_LABELS = {label, decorate};
})();
