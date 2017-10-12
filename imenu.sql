-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 13, 2017 at 08:14 PM
-- Server version: 5.7.19-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imenu`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

CREATE TABLE `bank_accounts` (
  `acc_no` bigint(20) NOT NULL,
  `cust_name` text NOT NULL,
  `balance` double NOT NULL,
  `contact_no` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `billings`
--

CREATE TABLE `billings` (
  `bill_no` bigint(20) NOT NULL,
  `time` datetime NOT NULL,
  `orders` longtext NOT NULL COMMENT 'comma seperated values',
  `amount` int(11) NOT NULL,
  `tax` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `cat_id` int(11) NOT NULL,
  `cat_title` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`cat_id`, `cat_title`) VALUES
(1, 'Juice'),
(2, 'Shakes'),
(3, 'Desserts'),
(4, 'Snacks'),
(5, 'Meals');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `title` mediumtext NOT NULL,
  `price` float NOT NULL,
  `description` mediumtext NOT NULL,
  `ingredients` mediumtext NOT NULL,
  `cat_id` int(11) NOT NULL,
  `longdescription` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `title`, `price`, `description`, `ingredients`, `cat_id`, `longdescription`) VALUES
(1, 'Apple Juice', 40, 'Delicious Himachal, Kashmir apple.', 'Apple', 1, NULL),
(2, 'Vanilla Shake', 60, 'Delicious extra delicious.', 'Vanilla, Milk, Sugar.', 2, NULL),
(3, 'Gulab Jamun', 45, 'Indian Dessert.', 'Maidha, Honey, Sugar.', 3, NULL),
(4, 'Chicken Biriyani', 150, 'Thalassery Dham Biriyani.', 'Chicken, Basumati, Ghee.', 5, NULL),
(6, 'Pineapple', 45, 'Natural pineapple', 'pineapple,sugar,water', 1, 'Great Taste'),
(13, 'Chicken Cutlet', 15, 'Delicious chicken crispy cutlet.', 'Meat, Potato, Egg, Rotti Powder, Chicken Masala, Green Chilly, Pepper.', 4, 'A very long description cannot be provided.');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `item_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `price` double NOT NULL,
  `time` datetime NOT NULL,
  `parcel` tinyint(1) NOT NULL,
  `engagetime` datetime NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_accounts`
--
ALTER TABLE `bank_accounts`
  ADD PRIMARY KEY (`acc_no`);

--
-- Indexes for table `billings`
--
ALTER TABLE `billings`
  ADD PRIMARY KEY (`bill_no`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
