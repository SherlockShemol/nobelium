const data = {
    zh: {
        name: "宋飒",
        location: "北京",
        email: "shemol106@gmail.com",
        website: "https://shemol.tech",
        sections: [
            {
                title: "教育经历",
                items: [
                    {
                        left: "北京邮电大学",
                        right: "2020年9月 - 2024年7月",
                        subLeft: "通信工程 | 本科",
                        subRight: "85.01/100 (29.34%)"
                    },
                    {
                        left: "北京邮电大学",
                        right: "2024年9月 - 至今",
                        subLeft: "信息与通信工程 | 研究生",
                        subRight: ""
                    }
                ]
            },
            {
                title: "专业技能",
                content: [
                    "熟悉使用 <span class='tech-stack'>Go</span> 进行开源项目开发，熟悉相关数据类型和基本的并发编程",
                    "具备 <span class='tech-stack'>Kubernetes Operator</span> 开发经验，使用 <span class='tech-stack'>client-go</span> 实现 <span class='tech-stack'>CRD controller</span> 的扩展开发",
                    "熟悉使用 <span class='tech-stack'>Docker</span> 容器化技术完成应用标准化部署与镜像管理，掌握 <span class='tech-stack'>Kubernetes</span> 容器编排，具备集群搭建、<span class='tech-stack'>Pod</span> 调度维护经验",
                    "熟悉操作系统，计算机网络基础知识，熟悉基础数据结构与算法",
                    "熟练使用 <span class='tech-stack'>Zorin</span>、<span class='tech-stack'>Ubuntu</span>、<span class='tech-stack'>Arch Linux</span> 等发行版，具备 <span class='tech-stack'>Linux</span> 系统全栈配置能力，包括系统服务管理、软件包部署、用户权限控制、网络接口配置及自动化运维脚本开发，曾通过内核参数调优、资源监控和存储管理提升系统性能",
                    "熟练掌握 <span class='tech-stack'>Git</span> 分布式版本控制系统，具备开源社区协作经验，能够高效完成分支策略设计、代码冲突解决、<span class='tech-stack'>Pull Request</span> 提交"
                ]
            },
            {
                title: "项目经历",
                items: [
                    {
                        left: "联合推理与联邦学习控制器优化",
                        right: "2024年7月 - 2024年11月",
                        desc: "技术栈：<span class='tech-stack'>Go</span>、<span class='tech-stack'>Kubernetes</span>、<span class='tech-stack'>client-go</span>、<span class='tech-stack'>CRD Operator</span>、<span class='tech-stack'>Informer</span> 事件驱动、级联删除<br>项目简介：修复了两个控制器不能级联删除的 <span class='tech-stack'>bug</span>，为联合推理控制器实现 <span class='tech-stack'>deployment</span> 的 <span class='tech-stack'>informer</span> 过程，为联邦学习控制器实现了误操作删除 <span class='tech-stack'>pod</span> 自动重新创建的能力，增强了联合推理和联邦学习过程的鲁棒性。"
                    }
                ]
            }
        ]
    },
    en: {
        name: "Song Sa",
        subtitle: "SherlockShemol",
        location: "Beijing",
        email: "shemol106@gmail.com",
        website: "https://shemol.tech",
        sections: [
            {
                title: "Education",
                items: [
                    {
                        left: "Beijing University of Posts and Telecommunications",
                        right: "Sep 2020 - Jul 2024",
                        subLeft: "Communication Engineering | Bachelor",
                        subRight: "GPA: 85.01/100 (Top 29.34%)"
                    },
                    {
                        left: "Beijing University of Posts and Telecommunications",
                        right: "Sep 2024 - Present",
                        subLeft: "Information and Communication Engineering | Master",
                        subRight: ""
                    }
                ]
            },
            {
                title: "Skills",
                content: [
                    "Proficient in <span class='tech-stack'>Go</span> for open source project development, familiar with data types and basic concurrent programming",
                    "Experience in <span class='tech-stack'>Kubernetes Operator</span> development, using <span class='tech-stack'>client-go</span> to implement <span class='tech-stack'>CRD controller</span> extensions",
                    "Proficient in <span class='tech-stack'>Docker</span> containerization technology for application deployment and image management; mastered <span class='tech-stack'>Kubernetes</span> container orchestration; experienced in cluster setup and <span class='tech-stack'>Pod</span> scheduling maintenance",
                    "Familiar with operating systems, basic computer network knowledge, and fundamental data structures and algorithms",
                    "Proficient in <span class='tech-stack'>Linux</span> distributions like <span class='tech-stack'>Zorin</span>, <span class='tech-stack'>Ubuntu</span>, <span class='tech-stack'>Arch Linux</span>; capable of full-stack <span class='tech-stack'>Linux</span> system configuration including service management, package deployment, permission control, network configuration, and automation scripting; improved system performance through kernel tuning and resource monitoring",
                    "Proficient in <span class='tech-stack'>Git</span> distributed version control system; experienced in open source community collaboration; capable of efficient branching strategy design, conflict resolution, and <span class='tech-stack'>Pull Request</span> submission"
                ]
            },
            {
                title: "Projects",
                items: [
                    {
                        left: "Joint Inference and Federated Learning Controller Optimization",
                        right: "Jul 2024 - Nov 2024",
                        desc: "Tech Stack: <span class='tech-stack'>Go</span>, <span class='tech-stack'>Kubernetes</span>, <span class='tech-stack'>client-go</span>, <span class='tech-stack'>CRD Operator</span>, <span class='tech-stack'>Informer</span> event-driven, Cascading deletion<br>Project: Fixed bugs where two controllers could not perform cascading deletion. Implemented <span class='tech-stack'>deployment</span> <span class='tech-stack'>informer</span> process for the joint inference controller. Implemented automatic <span class='tech-stack'>pod</span> recreation after accidental deletion for the federated learning controller, enhancing robustness."
                    }
                ]
            }
        ]
    }
};

let currentLang = 'zh';

function render() {
    const d = data[currentLang];
    const container = document.getElementById('resume-content');

    let html = `
        <div class="header">
            <h1>${d.name}</h1>
            <div class="contact-info">
                <span>📍 ${d.location}</span>
                <span>📧 <a href="mailto:${d.email}">${d.email}</a></span>
                <span>🔗 <a href="${d.website}" target="_blank">Website</a></span>
            </div>
        </div>
    `;

    d.sections.forEach(section => {
        html += `<div class="section"><div class="section-title">${section.title}</div>`;

        if (section.content) {
            html += `<ul>${section.content.map(c => `<li>${c}</li>`).join('')}</ul>`;
        } else if (section.items) {
            section.items.forEach(item => {
                html += `
                    <div class="item">
                        <div class="item-header">
                            <span>${item.left}</span>
                            <span>${item.right}</span>
                        </div>
                        ${(item.subLeft || item.subRight) ? `
                        <div class="item-sub">
                            <span>${item.subLeft}</span>
                            <span>${item.subRight}</span>
                        </div>` : ''}
                        ${item.desc ? `<div class="item-desc">${item.desc}</div>` : ''}
                    </div>
                `;
            });
        }
        html += `</div>`;
    });

    container.innerHTML = html;
    document.title = `Resume - ${d.name}`;
}

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    render();
}

// Using native browser print functionality
function downloadPDF() {
    window.print();
}

// Initial render
render();
