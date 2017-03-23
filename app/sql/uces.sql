-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-12-25 12:14:38
-- 服务器版本： 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `uces`
--

-- --------------------------------------------------------

--
-- 表的结构 `student`
--

CREATE TABLE IF NOT EXISTS `student` (
`id` int(11) NOT NULL COMMENT '序号',
  `student_id` varchar(20) NOT NULL,
  `dorm_id` varchar(20) DEFAULT NULL COMMENT '宿舍号',
  `student_name` varchar(40) DEFAULT NULL COMMENT '姓名',
  `class` varchar(40) DEFAULT NULL COMMENT '班级',
  `major` varchar(40) DEFAULT NULL COMMENT '专业',
  `origin` varchar(20) DEFAULT NULL COMMENT '生源地',
  `party` varchar(20) DEFAULT NULL COMMENT '政治面貌',
  `study` varchar(20) DEFAULT NULL COMMENT '学习排名情况',
  `family` varchar(20) DEFAULT NULL COMMENT '家庭经济情况',
  `isleader` varchar(10) DEFAULT NULL COMMENT '是否干部',
  `others` varchar(800) DEFAULT NULL COMMENT '其他情况',
  `guidance` varchar(800) DEFAULT NULL COMMENT '辅导情况',
  `reserved` varchar(40) DEFAULT NULL COMMENT '保留位',
  `teacher_id` int(11) NOT NULL COMMENT '老师序号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
`id` int(11) NOT NULL,
  `school` varchar(40) NOT NULL,
  `school_id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `reserved` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
`id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `reserved` varchar(40) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `reserved`) VALUES
(1, 'admin', 'yuanxiaomin', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student`
--
ALTER TABLE `student`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号';
--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
