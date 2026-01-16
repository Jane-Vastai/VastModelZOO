// 自动修复GitHub Pages上的Markdown链接
// 将相对路径的.md链接转换为GitHub仓库链接

(function() {
    // 配置你的GitHub仓库信息
    const GITHUB_USER = 'your-username';  // 替换为你的GitHub用户名
    const GITHUB_REPO = 'VastModelZOO';    // 仓库名
    const GITHUB_BRANCH = 'main';          // 分支名
    
    // 自动检测GitHub信息(从页面URL推断)
    function detectGitHubInfo() {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/([^\/]+)\//);
        if (match) {
            return {
                user: GITHUB_USER !== 'your-username' ? GITHUB_USER : match[1],
                repo: GITHUB_REPO,
                branch: GITHUB_BRANCH
            };
        }
        return { user: GITHUB_USER, repo: GITHUB_REPO, branch: GITHUB_BRANCH };
    }
    
    // 修复所有Markdown链接
    function fixMarkdownLinks() {
        const githubInfo = detectGitHubInfo();
        const baseURL = `https://github.com/${githubInfo.user}/${githubInfo.repo}/blob/${githubInfo.branch}`;
        
        // 查找所有指向.md文件的链接
        const links = document.querySelectorAll('a[href$=".md"]');
        let fixedCount = 0;
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // 跳过已经是完整URL的链接
            if (href.startsWith('http://') || href.startsWith('https://')) {
                return;
            }
            
            // 处理相对路径
            let newHref = href;
            
            // 移除开头的 ../
            newHref = newHref.replace(/^\.\.\//, '');
            
            // 构建GitHub链接
            const githubURL = `${baseURL}/${newHref}`;
            
            // 更新链接
            link.setAttribute('href', githubURL);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            fixedCount++;
        });
        
        console.log(`✓ Fixed ${fixedCount} Markdown links`);
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixMarkdownLinks);
    } else {
        fixMarkdownLinks();
    }
})();
