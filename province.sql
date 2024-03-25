-- --------------------------------------------------------
-- 호스트:                          j10a305.p.ssafy.io
-- 서버 버전:                        11.3.2-MariaDB-1:11.3.2+maria~ubu2204 - mariadb.org binary distribution
-- 서버 OS:                        debian-linux-gnu
-- HeidiSQL 버전:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- travel 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `travel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `travel`;

-- 테이블 travel.province 구조 내보내기
CREATE TABLE IF NOT EXISTS `province` (
  `province_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `img_url` varchar(500) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 travel.province:~17 rows (대략적) 내보내기
INSERT INTO `province` (`province_id`, `created_at`, `updated_at`, `img_url`, `name`) VALUES
	(1, '2024-03-22 08:25:56.918833', '2024-03-22 08:25:56.918833', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/1aa592b4-b543-449c-ba2e-bef61d613abf_seoul.jpg', '서울'),
	(2, '2024-03-22 08:29:31.973645', '2024-03-22 08:29:31.973645', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/a7fbfcfc-6ec1-428a-976f-ae5c7a5aa8dd_인천.jpeg', '인천'),
	(3, '2024-03-22 08:29:49.064627', '2024-03-22 08:29:49.064627', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/313350ac-e3b9-4d57-b619-c589018a4f17_대전.jfif', '대전'),
	(4, '2024-03-22 08:30:57.453489', '2024-03-22 08:30:57.453489', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/025d1f22-d838-4ed0-b547-62a41e16f991_대구.jpg', '대구'),
	(5, '2024-03-22 08:47:32.533031', '2024-03-22 08:47:32.533031', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/89a61b90-bc42-491f-b34d-174a09fae799_광주.jpg', '광주'),
	(6, '2024-03-22 08:47:23.089445', '2024-03-22 08:47:23.089445', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/23686c6c-662f-40fa-b39f-3251d3984826_부산.jfif', '부산'),
	(7, '2024-03-22 08:47:14.093566', '2024-03-22 08:47:14.093566', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/fb821d15-9d46-4288-b696-14207d6c748c_울산.webp', '울산'),
	(8, '2024-03-22 08:48:23.221278', '2024-03-22 08:48:23.221278', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/525c1796-f8a2-48c2-9674-9b99242c27ff_세종시.jpg', '세종시'),
	(31, '2024-03-22 08:28:29.300974', '2024-03-22 08:28:29.300974', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/f185f424-d0fa-4c8c-b109-0822ef54c696_경기도.jpeg', '경기도'),
	(32, '2024-03-22 08:40:21.735158', '2024-03-22 08:40:21.735158', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/447cdd3b-da4b-4eb8-8eaa-6c8424cf083b_강원도.jpeg', '강원도'),
	(33, '2024-03-22 08:50:26.863176', '2024-03-22 08:50:26.863176', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/d9958903-6027-4094-83af-e4e10a53f294_충북.jpg', '충청북도'),
	(34, '2024-03-22 08:33:24.898229', '2024-03-22 08:33:24.898229', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/2bea1bae-bea6-43e7-96d3-8c81de7b4059_충청남도.jpeg', '충청남도'),
	(35, '2024-03-22 08:32:13.533563', '2024-03-22 08:32:13.533563', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/632a2da3-caf4-4172-be3a-0374b4c26901_경상북도.webp', '경상북도'),
	(36, '2024-03-22 08:50:36.405428', '2024-03-22 08:50:36.405428', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/a4b65fda-c807-4a57-92dd-2494b1d28efd_경남.jpg', '경상남도'),
	(37, '2024-03-22 08:41:45.738142', '2024-03-22 08:41:45.738142', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/80573c8e-3bae-448d-93ab-9e89429fb691_전라북도.jpeg', '전라북도'),
	(38, '2024-03-22 08:32:41.408897', '2024-03-22 08:32:41.408897', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/fe680053-fca9-40ba-bd95-8b0aaf664535_전라남도.jpeg', '전라남도'),
	(39, '2024-03-22 08:32:54.759569', '2024-03-22 08:32:54.759569', 'https://travel-maker.s3.ap-northeast-2.amazonaws.com/82aaa4b4-960c-4aa5-af6e-af5a4b3f0be4_제주도.jpeg', '제주도');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
