/*
 * V1 category-level evidence snapshot.
 * Counts are dependency references from mapped-only Python, JavaScript/TypeScript and C/C++ projects.
 * They are repeated on scenarios in the same category as a planning signal, not a scenario-specific bill of materials.
 */
window.SCENARIO_V1_COVERAGE = {
  version: '1.0.0',
  generatedOn: '2026-09-13',
  scope: '仅统计具备当前目录数据的 Python、JavaScript/TypeScript、C/C++ 项目；Go、Java、Rust 数据缺失，不按0计入。',
  unit: '项目依赖引用',
  domains: {
    1: { projects: 3, languages: { 'C/C++': 2, 'JavaScript/TypeScript': 1 }, involved: 82, completed: 65, gap: 17 },
    2: { projects: 6, languages: { 'C/C++': 5, 'JavaScript/TypeScript': 1 }, involved: 17, completed: 16, gap: 1 },
    3: { projects: 4, languages: { Python: 2, 'JavaScript/TypeScript': 1, 'C/C++': 1 }, involved: 55, completed: 46, gap: 9 },
    4: { projects: 8, languages: { Python: 6, 'JavaScript/TypeScript': 2 }, involved: 156, completed: 102, gap: 54 },
    5: { projects: 4, languages: { 'JavaScript/TypeScript': 3, Python: 1 }, involved: 59, completed: 45, gap: 14 },
    6: { projects: 18, languages: { 'JavaScript/TypeScript': 14, Python: 4 }, involved: 575, completed: 412, gap: 163 },
    7: { projects: 4, languages: { 'JavaScript/TypeScript': 4 }, involved: 33, completed: 22, gap: 11 },
    8: { projects: 8, languages: { Python: 6, 'JavaScript/TypeScript': 2 }, involved: 187, completed: 150, gap: 37 },
    9: { projects: 36, languages: { 'JavaScript/TypeScript': 17, 'C/C++': 13, Python: 6 }, involved: 562, completed: 396, gap: 166 },
    10: { projects: 15, languages: { 'JavaScript/TypeScript': 9, Python: 6 }, involved: 297, completed: 208, gap: 89 },
    11: { projects: 23, languages: { Python: 19, 'JavaScript/TypeScript': 4 }, involved: 418, completed: 306, gap: 112 },
    12: { projects: 16, languages: { Python: 11, 'JavaScript/TypeScript': 5 }, involved: 163, completed: 126, gap: 37 },
    13: { projects: 26, languages: { Python: 13, 'JavaScript/TypeScript': 13 }, involved: 896, completed: 605, gap: 291 },
    14: { projects: 30, languages: { 'JavaScript/TypeScript': 24, Python: 4, 'C/C++': 2 }, involved: 777, completed: 547, gap: 230 },
    15: { projects: 9, languages: { Python: 5, 'C/C++': 3, 'JavaScript/TypeScript': 1 }, involved: 53, completed: 37, gap: 16 }
  }
};
