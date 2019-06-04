-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- 생성 시간: 16-05-24 04:36
-- 서버 버전: 5.5.42
-- PHP 버전: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- 데이터베이스: `dbbd`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `comment`
--

CREATE TABLE `comment` (
  `cmt_no` int(11) NOT NULL,
  `pck_no` int(11) NOT NULL,
  `cmt_code` varchar(20) NOT NULL,
  `cmt_info` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`cmt_no`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `comment`
--
ALTER TABLE `comment`
  MODIFY `cmt_no` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;