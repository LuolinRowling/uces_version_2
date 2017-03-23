# 辅导员考核系统（重构）
辅导员考核系统 University Counsellor Examination System
## 项目介绍
> 旧版：[@LuolinRowling/UCES](https://github.com/LuolinRowling/UCES)，使用JSP + Servlet + JDBC，部署在Tomcat上

主要功能包括：
- 平台辅助老师进行辅导员考核，提供教师管理、学生管理及考核功能。
- 允许操作者通过excel表格**批量导入**名单，**校验**学生信息录入的**完整性**，允许根据学号查询学生，考核通过**滚动照片**方式抽取学生。

在2016年12月对项目进行重构，由本人完成整个项目的设计、实现与部署。

## 前端介绍
- 前端页面不采用模板，为纯手写实现，使用SCSS预处理器
- 由于项目功能多为数据驱动，故采用MVVM架构的Vue.js帮助实现
- 使用Zepto.js，使用AJAX + JSON与服务器进行交互

## 后台介绍
- 后台服务器开发使用express框架，数据传递格式为JSON
- 使用lodash、async、xlsx等JavaScript库辅助开发

## 项目截图
<div style="text-align: center;">
    <img src="http://t.cn/R6trftr" style="width: 80%" />
    <p style="text-align: center; width: 100%;">Fig. 登录</p>
</div>
<br/>
<div style="text-align: center;">
    <img src="http://t.cn/R6tBj7u" style="width: 80%" />
    <p style="text-align: center; width: 100%;">Fig. 功能选择</p>
</div>
<br/>
<div style="text-align: center;">
    <img src="http://t.cn/R6trpsE" style="width: 80%" />
    <p style="text-align: center; width: 100%;">Fig. 教师录入页</p>
</div>
<br/>
<div style="text-align: center;">
    <img src="http://t.cn/R6trYGY" style="width: 80%" />
    <p style="text-align: center; width: 100%;">Fig. 学生信息录入页</p>
</div>
<br/>
<div style="text-align: center;">
    <img src="http://t.cn/R6trm0h" style="width: 80%" />
    <p style="text-align: center; width: 100%;">Fig. 考核页</p>
</div>
