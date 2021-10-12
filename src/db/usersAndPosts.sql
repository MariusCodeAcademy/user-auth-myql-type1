-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Oct 12, 2021 at 07:53 AM
-- Server version: 5.7.32
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `usersDB1`
--

-- --------------------------------------------------------

--
-- Table structure for table `userPosts`
--

CREATE TABLE `userPosts` (
  `postId` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `author` int(11) NOT NULL,
  `timeStamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userPosts`
--

INSERT INTO `userPosts` (`postId`, `title`, `author`, `timeStamp`) VALUES
(1, '007 movie', 16, '2021-10-12 10:52:54'),
(2, 'double o seven', 16, '2021-10-12 10:52:54'),
(3, 'Boxing', 18, '2021-10-12 10:52:54'),
(4, 'Jane at home dinner and movie ', 17, '2021-10-12 10:52:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `timeStamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `timeStamp`) VALUES
(16, 'James@bond.com', '$2a$10$l3uLR9fOqWaOX8niDbJdpeQJQa/JyO3lNUc4lNHN8rLX014LttpwS', '2021-10-12 08:32:21'),
(17, 'Jane@Brown.com', '$2a$10$C4EBhQlKv4UEdAvUnFu6Luz63ld6wz2u4LM2iZGcyBaO2oTxu0rsC', '2021-10-12 10:51:34'),
(18, 'Mike@Tyson.com', '$2a$10$ny6z/bq14vxczp3C/lm11.hdtRP75lWhhSaRX5nHIqzA5WzoPuyyW', '2021-10-12 10:51:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `userPosts`
--
ALTER TABLE `userPosts`
  ADD PRIMARY KEY (`postId`),
  ADD KEY `post_to_author` (`author`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `userPosts`
--
ALTER TABLE `userPosts`
  MODIFY `postId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userPosts`
--
ALTER TABLE `userPosts`
  ADD CONSTRAINT `post_to_author` FOREIGN KEY (`author`) REFERENCES `users` (`id`);
