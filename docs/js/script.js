// 页面加载完成后隐藏加载动画
window.addEventListener('load', function() {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 300);
    }
});

// 切换大类内容显示/隐藏
function toggleCategory(categoryId) {
    const content = document.getElementById(categoryId);
    const header = content.previousElementSibling;
    
    const isExpanding = !content.classList.contains('expanded');
    
    if (isExpanding) {
        // 折叠所有其他大类
        document.querySelectorAll('.subcategory-panel').forEach(panel => {
            if (panel.id !== categoryId) {
                panel.classList.remove('expanded');
                const panelHeader = panel.previousElementSibling;
                if (panelHeader) {
                    panelHeader.classList.remove('active');
                }
                
                // 折叠该大类内的所有子类别
                panel.querySelectorAll('.models-table-container').forEach(container => {
                    container.classList.remove('expanded');
                    const containerHeader = container.previousElementSibling;
                    if (containerHeader) {
                        containerHeader.classList.remove('active');
                    }
                });
            }
        });
        
        // 同步折叠左侧导航栏的所有子分类列表
        document.querySelectorAll('.subcategory-list').forEach(list => {
            list.classList.remove('expanded');
            const listButton = list.previousElementSibling;
            if (listButton && listButton.classList.contains('toggle-subcategories')) {
                const listIcon = listButton.querySelector('i');
                if (listIcon) {
                    listIcon.className = 'fas fa-chevron-down';
                }
            }
        });
    } else {
        // 折叠当前大类时,同时折叠其内部的所有子类别
        content.querySelectorAll('.models-table-container').forEach(container => {
            container.classList.remove('expanded');
            const containerHeader = container.previousElementSibling;
            if (containerHeader) {
                containerHeader.classList.remove('active');
            }
        });
    }

    content.classList.toggle('expanded');
    header.classList.toggle('active');
}

// 切换子类别内容显示/隐藏
function toggleSubcategory(subcategoryId) {
    const content = document.getElementById(subcategoryId);
    const header = content.previousElementSibling;
    
    const isExpanding = !content.classList.contains('expanded');
    
    if (isExpanding) {
        // 折叠同一大类下的所有其他子类别
        const parentPanel = content.closest('.subcategory-panel');
        if (parentPanel) {
            parentPanel.querySelectorAll('.models-table-container').forEach(container => {
                if (container.id !== subcategoryId) {
                    container.classList.remove('expanded');
                    const containerHeader = container.previousElementSibling;
                    if (containerHeader) {
                        containerHeader.classList.remove('active');
                    }
                }
            });
        }
        
        // 同步折叠左侧导航栏的所有子分类列表(除了当前大类对应的)
        const currentCategoryCard = content.closest('.category-card');
        let currentCategoryId = null;
        if (currentCategoryCard) {
            const categoryIdMap = {
                'cv-models': 'cv-sub',
                'nlp-models': 'nlp-sub',
                'llm-models': 'llm-sub',
                'vlm-models': 'vlm-sub'
            };
            currentCategoryId = categoryIdMap[currentCategoryCard.id];
        }
        
        document.querySelectorAll('.subcategory-list').forEach(list => {
            if (list.id !== currentCategoryId) {
                list.classList.remove('expanded');
                const listButton = list.previousElementSibling;
                if (listButton && listButton.classList.contains('toggle-subcategories')) {
                    const listIcon = listButton.querySelector('i');
                    if (listIcon) {
                        listIcon.className = 'fas fa-chevron-down';
                    }
                }
            }
        });
    }

    content.classList.toggle('expanded');
    header.classList.toggle('active');

    // 添加动画效果
    content.classList.add('fade-in');
    setTimeout(() => {
        content.classList.remove('fade-in');
    }, 300);
}

// 切换侧边栏子类别显示/隐藏
function toggleSubcategories(subId) {
    const sublist = document.getElementById(subId);
    const button = sublist.previousElementSibling;
    
    const isExpanding = !sublist.classList.contains('expanded');
    
    if (isExpanding) {
        // 折叠所有其他子分类列表
        document.querySelectorAll('.subcategory-list').forEach(list => {
            if (list.id !== subId) {
                list.classList.remove('expanded');
                // 更新对应按钮的图标
                const listButton = list.previousElementSibling;
                if (listButton && listButton.classList.contains('toggle-subcategories')) {
                    const listIcon = listButton.querySelector('i');
                    if (listIcon) {
                        listIcon.className = 'fas fa-chevron-down';
                    }
                }
            }
        });
    }

    sublist.classList.toggle('expanded');
    const icon = button.querySelector('i');
    if (sublist.classList.contains('expanded')) {
        icon.className = 'fas fa-chevron-up';
    } else {
        icon.className = 'fas fa-chevron-down';
    }
}

// 切换模型列表显示/隐藏
function toggleModelList(modelId) {
    const details = document.getElementById(modelId);
    if (details.style.display === 'block') {
        details.style.display = 'none';
    } else {
        // 隐藏其他打开的详情
        document.querySelectorAll('.model-list-details').forEach(el => {
            if (el.id !== modelId) el.style.display = 'none';
        });
        details.style.display = 'block';
    }
}

// 搜索模型功能
function searchModels() {
    const searchInput = document.getElementById('model-search');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const clearBtn = document.querySelector('.clear-search');
    const searchCount = document.getElementById('search-count');
    
    // 显示/隐藏清除按钮
    clearBtn.style.display = searchTerm ? 'block' : 'none';

    let visibleCount = 0;
    let totalCount = 0;

    // 获取所有模型行
    const allRows = document.querySelectorAll('.models-table tbody tr');
    
    allRows.forEach(row => {
        totalCount++;
        const modelName = row.querySelector('.model-cell')?.textContent.toLowerCase() || '';
        const codebase = row.querySelector('.codebase-link')?.textContent.toLowerCase() || '';
        const modelType = row.querySelector('.type-badge')?.textContent.toLowerCase() || '';
        const runtime = row.querySelector('.runtime-badge')?.textContent.toLowerCase() || '';
        
        const matches = !searchTerm || 
            modelName.includes(searchTerm) || 
            codebase.includes(searchTerm) || 
            modelType.includes(searchTerm) || 
            runtime.includes(searchTerm);

        if (matches) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // 显示搜索结果计数
    if (searchTerm) {
        searchCount.style.display = 'block';
        searchCount.textContent = `找到 ${visibleCount} 个结果 (共 ${totalCount} 个模型)`;
        
        // 自动展开所有包含结果的分类
        expandCategoriesWithResults();
    } else {
        searchCount.style.display = 'none';
        // 清除搜索时,折叠所有分类
        collapseAllCategories();
    }
}

// 清除搜索
function clearSearch() {
    const searchInput = document.getElementById('model-search');
    searchInput.value = '';
    searchModels();
}

// 展开包含搜索结果的分类
function expandCategoriesWithResults() {
    const allTables = document.querySelectorAll('.models-table');
    
    allTables.forEach(table => {
        const visibleRows = Array.from(table.querySelectorAll('tbody tr'))
            .filter(row => row.style.display !== 'none');
        
        const subcategoryItem = table.closest('.subcategory-item');
        
        if (visibleRows.length > 0) {
            // 有结果：展开并显示子类别
            if (subcategoryItem) {
                subcategoryItem.style.display = '';
                const header = subcategoryItem.querySelector('.subcategory-header');
                const content = subcategoryItem.querySelector('.models-table-container');
                if (header && content) {
                    header.classList.add('active');
                    content.classList.add('expanded');
                }
            }
            
            // 展开大类
            const categoryCard = table.closest('.category-card');
            if (categoryCard) {
                categoryCard.style.display = '';
                const categoryHeader = categoryCard.querySelector('.category-header');
                const categoryContent = categoryCard.querySelector('.subcategory-panel');
                if (categoryHeader && categoryContent) {
                    categoryHeader.classList.add('active');
                    categoryContent.classList.add('expanded');
                }
            }
        } else {
            // 无结果：隐藏整个子类别
            if (subcategoryItem) {
                subcategoryItem.style.display = 'none';
            }
        }
    });
    
    // 检查每个大类是否有可见的子类别，如果没有则隐藏整个大类
    document.querySelectorAll('.category-card').forEach(card => {
        const visibleSubcategories = Array.from(card.querySelectorAll('.subcategory-item'))
            .filter(item => item.style.display !== 'none');
        
        if (visibleSubcategories.length === 0) {
            card.style.display = 'none';
        }
    });
}

// 折叠所有分类
function collapseAllCategories() {
    // 折叠所有子类别
    document.querySelectorAll('.subcategory-header').forEach(header => {
        header.classList.remove('active');
    });
    document.querySelectorAll('.models-table-container').forEach(content => {
        content.classList.remove('expanded');
    });
    
    // 折叠所有大类
    document.querySelectorAll('.category-header').forEach(header => {
        header.classList.remove('active');
    });
    document.querySelectorAll('.subcategory-panel').forEach(panel => {
        panel.classList.remove('expanded');
    });
    
    // 显示所有分类和子类别
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.display = '';
    });
    document.querySelectorAll('.subcategory-item').forEach(item => {
        item.style.display = '';
    });
}

// 按运行环境过滤
let currentRuntimeFilter = 'all';
function filterByRuntime(runtime) {
    currentRuntimeFilter = runtime;
    
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${runtime}"]`).classList.add('active');

    // 过滤模型行
    const allRows = document.querySelectorAll('.models-table tbody tr');
    let visibleCount = 0;
    
    allRows.forEach(row => {
        const runtimeBadge = row.querySelector('.runtime-badge');
        if (!runtimeBadge) return;
        
        const rowRuntime = runtimeBadge.textContent.toLowerCase();
        
        if (runtime === 'all' || rowRuntime.includes(runtime)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // 如果有搜索词，重新应用搜索
    const searchTerm = document.getElementById('model-search').value;
    if (searchTerm) {
        searchModels();
    }
}

// 字母索引滚动
function scrollToLetter(letter) {
    const allRows = document.querySelectorAll('.models-table tbody tr');
    let found = false;

    for (let row of allRows) {
        const modelCell = row.querySelector('.model-cell');
        if (!modelCell) continue;
        
        const modelName = modelCell.textContent.trim().toUpperCase();
        let firstChar = modelName.charAt(0);
        
        // 处理数字
        if (letter === '0' && /[0-9]/.test(firstChar)) {
            found = true;
        } else if (firstChar === letter) {
            found = true;
        }
        
        if (found) {
            // 展开相关的类别
            const subcategoryItem = row.closest('.subcategory-item');
            if (subcategoryItem) {
                const header = subcategoryItem.querySelector('.subcategory-header');
                const content = subcategoryItem.querySelector('.models-table-container');
                if (header && content) {
                    header.classList.add('active');
                    content.classList.add('expanded');
                }
            }
            
            const categoryCard = row.closest('.category-card');
            if (categoryCard) {
                const categoryHeader = categoryCard.querySelector('.category-header');
                const categoryContent = categoryCard.querySelector('.subcategory-panel');
                if (categoryHeader && categoryContent) {
                    categoryHeader.classList.add('active');
                    categoryContent.classList.add('expanded');
                }
            }
            
            // 滚动到该行
            window.scrollTo({
                top: row.offsetTop - 200,
                behavior: 'smooth'
            });
            
            // 高亮该行
            row.classList.add('highlight-row');
            setTimeout(() => {
                row.classList.remove('highlight-row');
            }, 2000);
            
            break;
        }
    }
    
    if (!found) {
        alert(`没有找到以 "${letter}" 开头的模型`);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    // 设置侧边导航点击效果
    document.querySelectorAll('.category-list > li > a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // 移除所有active类
            document.querySelectorAll('.category-list > li > a').forEach(a => {
                a.classList.remove('active');
            });

            // 添加当前active类
            this.classList.add('active');

            // 滚动到目标位置
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // 先折叠所有其他大类
                document.querySelectorAll('.subcategory-panel').forEach(panel => {
                    if (panel.id !== targetElement.querySelector('.subcategory-panel')?.id) {
                        panel.classList.remove('expanded');
                        const panelHeader = panel.previousElementSibling;
                        if (panelHeader) {
                            panelHeader.classList.remove('active');
                        }
                    }
                });
                
                // 展开目标大类
                const categoryCard = targetElement.closest('.category-card');
                if (categoryCard) {
                    const categoryHeader = categoryCard.querySelector('.category-header');
                    const categoryContent = categoryCard.querySelector('.subcategory-panel');

                    categoryHeader.classList.add('active');
                    categoryContent.classList.add('expanded');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 设置子类别导航点击效果
    document.querySelectorAll('.subcategory-list a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // 滚动到目标位置
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const targetCategoryCard = targetElement.closest('.category-card');
                
                // 第一步：先折叠所有内容（包括其他大类和它们内部的所有子类别）
                document.querySelectorAll('.subcategory-panel').forEach(panel => {
                    const panelCard = panel.closest('.category-card');
                    if (panelCard !== targetCategoryCard) {
                        panel.classList.remove('expanded');
                        const panelHeader = panel.previousElementSibling;
                        if (panelHeader) {
                            panelHeader.classList.remove('active');
                        }
                        
                        // 关键：折叠该大类内的所有子类别
                        panel.querySelectorAll('.models-table-container').forEach(container => {
                            container.classList.remove('expanded');
                            const containerHeader = container.previousElementSibling;
                            if (containerHeader) {
                                containerHeader.classList.remove('active');
                            }
                        });
                    }
                });
                
                // 折叠同一大类下的所有子类别（包括目标子类别，稍后再展开）
                const parentPanel = targetElement.closest('.subcategory-panel');
                if (parentPanel) {
                    parentPanel.querySelectorAll('.models-table-container').forEach(container => {
                        container.classList.remove('expanded');
                        const containerHeader = container.previousElementSibling;
                        if (containerHeader) {
                            containerHeader.classList.remove('active');
                        }
                    });
                }
                
                // 第二步：等待折叠动画完成后，展开目标大类
                setTimeout(() => {
                    if (targetCategoryCard) {
                        const categoryHeader = targetCategoryCard.querySelector('.category-header');
                        const categoryContent = targetCategoryCard.querySelector('.subcategory-panel');
                        if (categoryHeader && categoryContent) {
                            categoryHeader.classList.add('active');
                            categoryContent.classList.add('expanded');
                        }
                    }
                    
                    // 第三步：再等待一下，展开目标子类别
                    setTimeout(() => {
                        const subcategoryHeader = targetElement.querySelector('.subcategory-header');
                        const subcategoryContent = targetElement.querySelector('.models-table-container');

                        if (subcategoryHeader && subcategoryContent) {
                            subcategoryHeader.classList.add('active');
                            subcategoryContent.classList.add('expanded');
                        }
                        
                        // 第四步：最后滚动到目标位置
                        setTimeout(() => {
                            const scrollTarget = subcategoryHeader || targetElement;
                            const targetTop = scrollTarget.getBoundingClientRect().top + window.pageYOffset - 120;
                            
                            window.scrollTo({
                                top: targetTop,
                                behavior: 'smooth'
                            });
                        }, 50);
                    }, 50);
                }, 450);
            }
        });
    });

    // 初始化时打开第一个大类的第一个子类别
    // 已禁用：默认全部折叠
    // const firstSubcategory = document.querySelector('.subcategory-item');
    // if (firstSubcategory) {
    //     const header = firstSubcategory.querySelector('.subcategory-header');
    //     const content = firstSubcategory.querySelector('.models-table-container');
    //     if (header && content) {
    //         header.classList.add('active');
    //         content.classList.add('expanded');
    //     }
    // }
});

// 返回顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 显示/隐藏返回顶部按钮
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
});
