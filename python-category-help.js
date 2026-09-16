/* Native disclosure: tap/click or Enter/Space, not hover-only. */
(() => {
  const descriptions={
    foundation:'原名称：开发基础库。配置、解析、序列化、数据校验、日期、缓存、字符串、数据结构等跨应用工具；不包含已单列的构建、测试、Web框架与数据库驱动，语言标准库本身不计入三方包。',
    domain:'原名称：业务与行业组件。金融、电商、医疗、教育等行业功能组件，以及该主类中证据尚待复核的候选；不能把整个类别视为已确认的行业能力。本页按本批元数据分类，不沿用首页“信息不足就暂归行业”的历史回退；无明确证据的包仍在“其他/待确认”。此次仅优化名称，类别ID、库归属和统计数值不变。'
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function html(id,label){
    if(!Object.hasOwn(descriptions,id))return esc(label);
    return `<details class="category-help"><summary aria-label="${esc(label)}：轻触展开或收起解释">${esc(label)} <span class="category-help-hint">说明</span></summary><p>${esc(descriptions[id])}</p></details>`;
  }
  window.PYTHON_CATEGORY_HELP={html,has:id=>Object.hasOwn(descriptions,id)};
})();
