-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 31 Ağu 2025, 12:27:04
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `lanetv1_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `postId` int(11) NOT NULL,
  `authorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `footerlink`
--

CREATE TABLE `footerlink` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `order` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `widget` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `footerlink`
--

INSERT INTO `footerlink` (`id`, `title`, `url`, `order`, `createdAt`, `updatedAt`, `widget`) VALUES
(3, 'test1', 'https://www.material-tailwind.com/docs/react/tabs', 4, '2025-07-22 08:39:34.832', '2025-07-27 11:54:38.999', 1),
(4, 'test3 ', 'https://www.material-tailwind.com/docs/react/tabs', 3, '2025-07-22 08:42:22.439', '2025-07-22 08:42:22.439', 2),
(5, 'test2', 'https://www.material-tailwind.com/docs/react/tabs', 2, '2025-07-22 08:44:26.713', '2025-07-27 11:54:39.009', 1),
(6, 'test3', 'https://www.material-tailwind.com/docs/react/tabs', 9, '2025-07-22 08:44:46.943', '2025-07-22 10:40:49.396', 1),
(8, 'test444', 'https://www.material-tailwind.com/docs/react/tabs', 6, '2025-07-22 08:58:43.325', '2025-07-22 08:58:43.325', 2),
(10, 'qweqwe', 'https://www.material-tailwind.com/docs/react/tabs', 8, '2025-07-22 09:24:56.687', '2025-07-22 09:24:56.687', 3),
(11, 'testtttttt', 'https://www.material-tailwind.com/docs/react/tabs', 5, '2025-07-22 09:25:20.680', '2025-07-22 10:40:49.384', 1),
(12, 'Çekilişler', 'http://localhost:5173/cekilisler', 10, '2025-07-22 12:25:58.801', '2025-07-22 12:25:58.801', 2);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `maincard`
--

CREATE TABLE `maincard` (
  `id` int(11) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `badgeText` varchar(191) NOT NULL,
  `href` varchar(191) NOT NULL,
  `imageSrc` varchar(191) NOT NULL,
  `logoSrc` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `marquee`
--

CREATE TABLE `marquee` (
  `id` int(11) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `linkUrl` varchar(191) NOT NULL,
  `order` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` varchar(191) NOT NULL,
  `targetUserId` int(11) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `targetRole` enum('ADMIN','MODERATOR','USER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `partnerbrand`
--

CREATE TABLE `partnerbrand` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `linkUrl` varchar(191) NOT NULL,
  `order` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `videoUrl` varchar(191) NOT NULL,
  `game` varchar(191) DEFAULT NULL,
  `betAmount` double DEFAULT NULL,
  `multiplier` double DEFAULT NULL,
  `winnings` double DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `authorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `posts`
--

INSERT INTO `posts` (`id`, `videoUrl`, `game`, `betAmount`, `multiplier`, `winnings`, `likes`, `isVerified`, `createdAt`, `updatedAt`, `authorId`) VALUES
(1, 'https://www.ppshare.net/GnuiCkvGjn', 'sweet', 1000, 5, 5000, 0, 0, '2025-08-12 16:30:14.126', '2025-08-12 16:30:14.126', 78);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `promotioncard`
--

CREATE TABLE `promotioncard` (
  `id` int(11) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `modalTitle` varchar(191) NOT NULL,
  `modalDescription` text NOT NULL,
  `modalImage` varchar(191) NOT NULL,
  `date` datetime(3) DEFAULT NULL,
  `promotionLink` varchar(191) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `seo_description` varchar(191) DEFAULT NULL,
  `footer_text` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `favicon_url` varchar(191) DEFAULT NULL,
  `help_link` varchar(191) DEFAULT NULL,
  `help_text` varchar(191) DEFAULT NULL,
  `instagram_link` varchar(191) DEFAULT NULL,
  `instagram_text` varchar(191) DEFAULT NULL,
  `site_logo_url` varchar(191) DEFAULT NULL,
  `site_title` varchar(191) DEFAULT NULL,
  `skype_link` varchar(191) DEFAULT NULL,
  `skype_text` varchar(191) DEFAULT NULL,
  `telegram_link` varchar(191) DEFAULT NULL,
  `telegram_text` varchar(191) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `whatsapp_link` varchar(191) DEFAULT NULL,
  `whatsapp_text` varchar(191) DEFAULT NULL,
  `youtube_link` varchar(191) DEFAULT NULL,
  `youtube_text` varchar(191) DEFAULT NULL,
  `facebook_link` varchar(191) DEFAULT NULL,
  `facebook_text` varchar(191) DEFAULT NULL,
  `twitter_link` varchar(191) DEFAULT NULL,
  `twitter_text` varchar(191) DEFAULT NULL,
  `maintenanceMode` tinyint(1) DEFAULT 0,
  `popup_text` varchar(191) DEFAULT NULL,
  `allow_search_engines` tinyint(1) DEFAULT 1,
  `google_analytics_id` varchar(191) DEFAULT NULL,
  `heroVideoThumbnail` varchar(191) DEFAULT NULL,
  `heroVideoUrl` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `site_settings`
--

INSERT INTO `site_settings` (`id`, `seo_description`, `footer_text`, `createdAt`, `favicon_url`, `help_link`, `help_text`, `instagram_link`, `instagram_text`, `site_logo_url`, `site_title`, `skype_link`, `skype_text`, `telegram_link`, `telegram_text`, `updatedAt`, `whatsapp_link`, `whatsapp_text`, `youtube_link`, `youtube_text`, `facebook_link`, `facebook_text`, `twitter_link`, `twitter_text`, `maintenanceMode`, `popup_text`, `allow_search_engines`, `google_analytics_id`, `heroVideoThumbnail`, `heroVideoUrl`) VALUES
(1, NULL, 'footer metni', '2025-07-22 08:42:25.606', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-30 09:45:15.261', NULL, NULL, NULL, NULL, 'www.testlink.com22', 'testfacebook', NULL, NULL, 0, NULL, 1, NULL, 'https://i.ytimg.com/vi/cZ4C0QvTmG0/maxresdefault.jpg', 'https://www.youtube.com/embed/cZ4C0QvTmG0');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `slider`
--

CREATE TABLE `slider` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sponsor`
--

CREATE TABLE `sponsor` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `buttonText` varchar(191) NOT NULL,
  `buttonUrl` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `logoUrl` varchar(191) NOT NULL,
  `order` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isMain` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('ADMIN','MODERATOR','USER') NOT NULL DEFAULT 'USER',
  `isEmailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `isBanned` tinyint(1) NOT NULL DEFAULT 0,
  `banReason` varchar(191) DEFAULT NULL,
  `bannedUntil` datetime(3) DEFAULT NULL,
  `customBonus` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `firstName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `phone` varchar(191) DEFAULT NULL,
  `referralCode` varchar(191) DEFAULT NULL,
  `referredBy` varchar(191) DEFAULT NULL,
  `telegram` varchar(191) DEFAULT NULL,
  `joinedReferralOwner` varchar(191) DEFAULT NULL,
  `avatarUrl` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `isEmailVerified`, `lastLoginAt`, `isBanned`, `banReason`, `bannedUntil`, `customBonus`, `createdAt`, `updatedAt`, `firstName`, `lastName`, `level`, `phone`, `referralCode`, `referredBy`, `telegram`, `joinedReferralOwner`, `avatarUrl`) VALUES
(1, 'test1', 'test1@gmail.com', '$2b$10$kMzqSr19VikP6mRrexaNDOhe0s26uLrYOr8boP5Uu355kwqxzsdp.', 'ADMIN', 0, NULL, 0, NULL, NULL, NULL, '2025-07-29 07:47:59.152', '2025-07-29 13:24:05.182', NULL, NULL, 1, NULL, NULL, '9864da87', NULL, NULL, NULL),
(78, 'test3', 'test3@hotmail.com', '$2b$10$FVW3IsmgjKNzLyMrwn7TG.oNd/eabnl9dudEyTJVqByoG3LWGolG6', 'USER', 0, NULL, 0, NULL, NULL, NULL, '2025-08-12 16:29:31.891', '2025-08-12 16:29:31.891', 'koray', 'test', 1, NULL, 'e399d45f', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `videocard`
--

CREATE TABLE `videocard` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `videoUrl` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `videocard`
--

INSERT INTO `videocard` (`id`, `title`, `videoUrl`, `imageUrl`, `order`, `createdAt`, `updatedAt`, `isActive`) VALUES
(7, 'test', 'https://www.youtube.com/watch?v=cZ4C0QvTmG0', 'https://img.youtube.com/vi/cZ4C0QvTmG0/maxresdefault.jpg', 1, '2025-08-12 15:04:35.583', '2025-08-30 10:14:51.415', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1296c25c-1256-4e32-9916-ffe98a1c17df', '940a5501c632e5dfcdd40563a3f8750143b53e458f5371cc8bf6aaa66b88aee2', '2025-07-22 08:18:54.315', '20250721075430_add_twitter_settings', NULL, NULL, '2025-07-22 08:18:54.304', 1),
('153bba04-6219-4673-84c6-00b93871d2cd', '06541256d54f8cabce3d7d67c0d18588de00ae62488134b849b269c0bb385b59', '2025-07-22 08:18:54.243', '20250716120041_init', NULL, NULL, '2025-07-22 08:18:54.231', 1),
('3fe21512-2b50-4dc8-86fe-0c1bd41d0a58', '74d78b9649b9e89669b14f1f4fa944839f4a55f0d7a08a7bdccb1c0cdcc84f8a', '2025-07-22 08:37:04.141', '20250722083704_add_widget_column', NULL, NULL, '2025-07-22 08:37:04.129', 1),
('50a903ce-f38c-4fa2-904e-2e62506edfb9', 'a8851ec39bff89ea4f3ea70052facb17c03ed18cd700885f2ca4574b040ba499', '2025-07-22 08:18:54.337', '20250721125544_add_popup_text_to_settings', NULL, NULL, '2025-07-22 08:18:54.327', 1),
('6019e332-f91a-4298-9ee5-f84b697b6d12', '96681813fd38f0c18f6bea7d93989f7362a4527c8889c350c462d99a6e175e98', '2025-07-22 08:18:54.301', '20250718122608_add_facebook_settings', NULL, NULL, '2025-07-22 08:18:54.290', 1),
('65bd4afa-98aa-41cf-ab1e-61c97dfb216b', 'a75a4802cd257006ed5c0adbeed14458782d4904d009d964f44aa8b8b897698c', '2025-07-22 08:18:54.324', '20250721121604_add_maintenance_mode', NULL, NULL, '2025-07-22 08:18:54.316', 1),
('9563064e-1b29-4ea7-b27c-e364ab1ebf56', 'aa0556e71fdd7e2a3d8a5cf81e162e611fd59cb263bc5c32f32958d4d1fd29a5', '2025-07-22 08:18:54.288', '20250718120934_add_social_media_settings_and_updated_at', NULL, NULL, '2025-07-22 08:18:54.257', 1),
('a34c64be-86f6-4a46-9204-d3ddd9688a64', '493876b92906f39dfb20a59eef04125643fc28777fe3b8676c250c5ea344f2f8', '2025-07-22 08:18:54.255', '20250718105126_add_site_settings_table', NULL, NULL, '2025-07-22 08:18:54.244', 1),
('b6b72121-5d45-446a-b941-219ccb3fb89c', 'e5db0e4d5cc693ce068b76b339cfab2a17fa452f5ddf6115935d7fe49b335f1c', '2025-07-22 08:18:54.350', '20250721133548_add_allow_search_engines', NULL, NULL, '2025-07-22 08:18:54.338', 1),
('df885e39-fe9c-4c57-b754-6f18459191ce', 'cff994449ac6c898c588f3f0b6cbaab2fd8f251637e40bf50c22f6c85beb73df', '2025-07-22 08:18:54.366', '20250721141004_add_footer_links', NULL, NULL, '2025-07-22 08:18:54.351', 1);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_postId_fkey` (`postId`),
  ADD KEY `comments_authorId_fkey` (`authorId`);

--
-- Tablo için indeksler `footerlink`
--
ALTER TABLE `footerlink`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `maincard`
--
ALTER TABLE `maincard`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `marquee`
--
ALTER TABLE `marquee`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_targetUserId_fkey` (`targetUserId`);

--
-- Tablo için indeksler `partnerbrand`
--
ALTER TABLE `partnerbrand`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_authorId_fkey` (`authorId`);

--
-- Tablo için indeksler `promotioncard`
--
ALTER TABLE `promotioncard`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `slider`
--
ALTER TABLE `slider`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `sponsor`
--
ALTER TABLE `sponsor`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_key` (`username`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_referralCode_key` (`referralCode`);

--
-- Tablo için indeksler `videocard`
--
ALTER TABLE `videocard`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `footerlink`
--
ALTER TABLE `footerlink`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `maincard`
--
ALTER TABLE `maincard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `marquee`
--
ALTER TABLE `marquee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Tablo için AUTO_INCREMENT değeri `partnerbrand`
--
ALTER TABLE `partnerbrand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `promotioncard`
--
ALTER TABLE `promotioncard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Tablo için AUTO_INCREMENT değeri `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `slider`
--
ALTER TABLE `slider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `sponsor`
--
ALTER TABLE `sponsor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- Tablo için AUTO_INCREMENT değeri `videocard`
--
ALTER TABLE `videocard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
