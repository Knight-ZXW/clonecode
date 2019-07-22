/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50528
Source Host           : localhost:3306
Source Database       : probability_analysis

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2019-07-05 15:58:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `receipts`
-- ----------------------------
DROP TABLE IF EXISTS `receipts`;
CREATE TABLE `receipts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `token` varchar(200) DEFAULT NULL,
  `is_run` int(3) DEFAULT NULL,
  `is_locked` int(3) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `total` int(11) DEFAULT '0',
  `fail` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of receipts
-- ----------------------------
INSERT INTO `receipts` VALUES ('1', 'duihuan060', 'Q5KZqvmWIxkSeBBXAzClWF2JIWoUFc1C8STNK83Gl5eIEws506z8frZ9siuCowMKYRkBC9xhXAAiVRKAMlJtoq', '0', '1', '2019-07-04 20:24:01', '2019-06-20 18:45:36', '0', '0');
INSERT INTO `receipts` VALUES ('2', 'duihuan072', 'kRfzY2tVmy172OiCsWfHeIMBs3OiidllB1E7uCcle1Id6gCdzG9jw7jWSIzUcIfEm3DpcgoS4qB6fmm28G3oqm', '0', '1', '2019-07-04 20:24:02', '2019-06-20 21:04:44', '0', '0');
INSERT INTO `receipts` VALUES ('3', 'duihuan061', 'cCZJqMvTQm5dFYLAQvHWQ20pqCoGufbpurUCAk6mZfT1dBGdmHEDcn72v67bn5dSYgaUcqRVygIZTyooMowhtS', '0', '1', '2019-07-05 07:58:09', '2019-06-21 20:35:43', '0', '0');
