-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 27, 2025 lúc 08:56 AM
-- Phiên bản máy phục vụ: 8.0.34
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `fruitweb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Trái Cây Nhập Khẩu', 'Trái cây nhập khẩu cũng nguồn vitamin và các khoáng chất dồi dào, mang đến nhiều lợi ích về sức khỏe cho con người.'),
(2, 'Rau lá hữu cơ\r\n', 'Sử dụng rau hữu cơ sẽ giảm thiểu nguy cơ mắc các căn bệnh nguy hiểm về tim mạch, ung thư hay huyết áp.'),
(3, 'Củ quả hữu cơ \r\n', 'Củ quả hữu cơ thường giàu chất chống oxy hóa, chất chống vi khuẩn và chất chống viêm tự nhiên.'),
(4, 'Nấm\r\n', 'Những loại thực phẩm phù hợp có thể đem lại sự khác biệt mà bạn có thể thấy được. Hãy thêm nấm vào chế độ ăn của bạn.'),
(5, 'Sản Phẩm mới\r\n', 'Những sản phẩm mới luôn liên tục được cập nhật. Hãy thêm chúng vào giỏ hàng của bạn,'),
(6, 'Trái cây Việt', 'Ăn trái cây mỗi ngày hỗ trợ giảm cân, bởi hầu hết các loại quả có hàm lượng calo tương đối thấp, chứa nhiều chất xơ. Chúng giúp bạn cảm thấy no lâu hơn. '),
(7, 'Bán chạy', 'Những sản phẩm bán chạy của shop, còn chần chờ gì nữa mà không thêm chúng vào giỏ hàng.'),
(8, 'Giảm giá', 'Chương trình giảm giá đối với những sản phẩm hot!!! '),
(9, 'Hàng xịnnnn', 'XỊn xòoooo'),
(11, '11111', 'aaa');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` bigint NOT NULL,
  `content` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `content`, `created_at`, `user_id`, `product_id`, `status`) VALUES
(2, 'ưqwwwqqwq', '2025-06-16 15:30:30', 9, 1, 'APPROVED'),
(3, 'asdasas', '2025-06-16 15:57:48', 3, 2, 'APPROVED'),
(5, 'rat ngon\n', '2025-06-16 18:50:29', 3, 27, 'PENDING'),
(6, 'sản phẩm tốt', '2025-06-16 22:44:54', 3, 9, 'APPROVED'),
(7, 'sản phẩm tốt\n', '2025-06-16 22:55:43', 3, 56, 'APPROVED');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `discounts`
--

CREATE TABLE `discounts` (
  `code` varchar(50) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `expired_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `email_verification`
--

CREATE TABLE `email_verification` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(100) NOT NULL,
  `time_expire` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int NOT NULL,
  `orderid` int DEFAULT NULL,
  `productid` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unitprice` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orderdetails`
--

INSERT INTO `orderdetails` (`id`, `orderid`, `productid`, `quantity`, `unitprice`, `total`) VALUES
(3, 2, 3, 1, 3450000.00, 3450000.00),
(4, 2, 9, 10, 626500.00, 6265000.00),
(5, 3, 29, 2, 43500.00, 87000.00),
(6, 3, 15, 1, 59000.00, 59000.00),
(7, 4, 27, 9, 159000.00, 1431000.00),
(8, 4, 12, 13, 249000.00, 3237000.00),
(11, 6, 11, 7, 329000.00, 2303000.00),
(12, 6, 7, 2, 997000.00, 1994000.00),
(13, 7, 6, 6, 105000.00, 630000.00),
(14, 7, 11, 3, 329000.00, 987000.00),
(16, 9, 11, 3, 329000.00, 987000.00),
(17, 9, 8, 1, 167500.00, 167500.00),
(20, 11, 77, 3, 56700.00, 170100.00),
(21, 11, 76, 6, 56700.00, 340200.00),
(22, 12, 77, 3, 56700.00, 170100.00),
(23, 12, 76, 5, 56700.00, 283500.00),
(28, 15, 73, 5, 34500.00, 172500.00),
(29, 15, 72, 1, 85000.00, 85000.00),
(30, 16, 73, 5, 34500.00, 172500.00),
(31, 16, 72, 1, 85000.00, 85000.00),
(32, 17, 73, 5, 34500.00, 172500.00),
(33, 17, 72, 1, 85000.00, 85000.00),
(34, 18, 11, 1, 329000.00, 329000.00),
(35, 19, 73, 4, 34500.00, 138000.00),
(36, 19, 72, 1, 85000.00, 85000.00),
(37, 20, 6, 3, 105000.00, 315000.00),
(38, 20, 27, 5, 159000.00, 795000.00),
(39, 21, 27, 5, 159000.00, 795000.00),
(40, 22, 27, 5, 159000.00, 795000.00),
(42, 24, 9, 5, 626500.00, 3132500.00),
(43, 25, 9, 6, 626500.00, 3759000.00),
(44, 25, 91, 4, 19000.00, 76000.00),
(45, 26, 9, 5, 626500.00, 3132500.00),
(46, 26, 91, 3, 19000.00, 57000.00),
(47, 27, 91, 3, 19000.00, 57000.00),
(48, 27, 18, 1, 1950000.00, 1950000.00),
(51, 29, 18, 3, 1950000.00, 5850000.00),
(52, 29, 82, 5, 29400.00, 147000.00),
(53, 30, 82, 5, 29400.00, 147000.00),
(54, 30, 39, 3, 15000.00, 45000.00),
(55, 31, 82, 4, 29400.00, 117600.00),
(56, 31, 39, 3, 15000.00, 45000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `userid` int DEFAULT NULL,
  `orderdate` datetime DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paymentmethod` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `shippingaddress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `userid`, `orderdate`, `total`, `status`, `paymentmethod`, `shippingaddress`, `note`) VALUES
(2, 3, '2024-05-26 10:00:00', 9715000.00, '1', 'COD', 'Hà Nội', 'Giao tối'),
(3, 3, '2024-05-26 10:00:00', 146000.00, '3', 'COD', 'Hồ Chí Minh ', 'Giao tối'),
(4, 3, '2025-05-27 12:53:43', 4668000.00, '3', 'COD', 'Đắc lắc ', 'Giao tối'),
(6, 3, '2025-05-30 10:11:33', 4297000.00, '3', 'COD', 'THành phố hồ chí minh', 'Giao trước 20h '),
(7, 3, '2025-05-30 15:09:23', 1617000.00, '3', 'COD', 'THành phố hồ chí minh', 'sáng '),
(9, 3, '2025-05-30 15:30:44', 1154500.00, '4', 'COD', 'THành phố hồ chí minh', 'Giao trước 20h '),
(11, 3, '2025-05-30 17:46:37', 510300.00, '0', 'COD', 'THành phố hồ chí minh', 'Giao trước 20h '),
(12, 3, '2025-05-30 17:53:24', 453600.00, '4', 'COD', 'THành phố hồ chí minh', 'Giao trước 20h '),
(15, 3, '2025-06-13 21:53:30', 257500.00, '4', 'VNPAY', 'THành phố hồ chí minh', 'sáng '),
(16, 3, '2025-06-13 21:54:24', 257500.00, '4', 'VNPAY', 'sa', 'aa'),
(17, 3, '2025-06-13 21:55:27', 257500.00, 'PAID', 'VNPAY', 'THành phố hồ chí minh', 'aaa'),
(18, 3, '2025-06-16 20:11:08', 329000.00, '4', 'VNPAY', 'THành phố hồ chí minh', 'Giao trước 20h '),
(19, 3, '2025-06-16 20:11:50', 223000.00, '3', 'COD', 'THành phố hồ chí minh', 'Giao trước 20h '),
(20, 3, '2025-06-16 21:57:42', 1110000.00, 'PAID', 'VNPAY', 'THành phố hồ chí minh', 'Giao trước 1h'),
(21, 3, '2025-06-16 22:01:32', 795000.00, '4', 'VNPAY', 'THành phố hồ chí minh', 'sáng '),
(22, 3, '2025-06-16 22:01:45', 795000.00, '3', 'VNPAY', 'THành phố hồ chí minh', ''),
(24, 3, '2025-06-16 22:45:22', 3132500.00, '3', 'VNPAY', 'THành phố hồ chí minh', 'Giao trước 7h'),
(25, 3, '2025-06-16 22:56:22', 3835000.00, '4', 'VNPAY', 'THành phố hồ chí minh', 'Giao trước 19h '),
(26, 3, '2025-06-16 23:08:31', 3189500.00, '4', 'VNPAY', 'THành phố hồ chí minh', 'Giao sáng'),
(27, 3, '2025-06-16 23:29:29', 2007000.00, '3', 'VNPAY', 'THành phố hồ chí minh', 'sáng'),
(29, 3, '2025-06-16 23:43:36', 5997000.00, '3', 'VNPAY', 'THành phố hồ chí minh', 'Giao trước 20h '),
(30, 3, '2025-06-17 21:16:46', 192000.00, '3', 'VNPAY', 'THành phố hồ chí minh', 'sáng '),
(31, 3, '2025-06-18 09:44:35', 162600.00, '4', 'COD', 'THành phố hồ chí minh', 'giao truoc 12h');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `image_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url`) VALUES
(1, 1, 'Cam vàng úc', 'Điểm nổi bật Cam vàng không hạt nhập khẩu từ Úc có vỏ màu vàng, ruột màu vàng đậm, vị ngọt thanh, không hạt, mọng nước, thường dùng để ăn chứ không ép nước. Cam chứa nhiều Vitamin C, tốt cho da, chống lão hóa, có tác dụng hồi phục sức khỏe nhanh, tốt cho người ốm. Sử dụng cam thường xuyên sẽ tăng sức đề kháng, giảm đáng kể nguy cơ mắc bệnh sỏi thận, tránh lượng calo dư thừa.Bảo quản: Nơi khô ráo, thoáng mát Sản phẩm được cấp giấy chứng nhận kiểm dịch và kiểm tra an toàn thực phẩm nhập khẩu. Cam kết hoàn toàn không sử dụng hóa chất bảo quản đối với tất cả các loại trái cây đảm bảo mang, đảm bảo an toàn sức khỏe cho người sử dụng Điều kiện sử dụng Thông tin chi tiết Cam là một trong những loại hoa quả được các bà nội trợ tin dùng bởi nó rất tốt cho sức khỏe của mọi lứa tuổi. Nhưng hiện nay, những loại hoa quả này đang bị cảnh báo về chất bảo quản ảnh hưởng không tốt đến sức khỏe con người. Cam ruột vàng không hạt nhập khẩu từ Úc đảm bảo uy tín chất lượng và không có chất bảo quản. Cam có vỏ màu vàng, ruột màu vàng đậm, vị ngọt thanh, không hạt, mọng nước, thường dùng để ăn chứ không ép nước. Trái cam chín mọng được tuyển lựa kỹ lưỡng Cam chứa nhiều vitamin C tốt cho sức khỏe cả nhà Cam chứa nhiều Vitamin C tốt cho da, chống lão hóa, có tác dụng hồi phục sức khỏe nhanh, tốt cho người ốm.Sử dụng cam Úc thường xuyên sẽ giúp bảo vệ bạn khỏi nguy cơ mắc các bệnh truyền nhiễm do virus.', 159000.00, 200, 'https://res.cloudinary.com/dfryedaps/image/upload/v1750091464/kf6xmlxsmzit4faithlc.jpg'),
(2, 1, 'Cherry đỏ mỹ', 'Thông tin dinh dưỡng– Cherry Mỹ là loại Trái Cây Nhập Khẩu cung cấp vitamin, các khoáng chất thiết yếu cho cơ thể. Tất cả các loại cherry đều có giá trị dinh dưỡng cao, chính vì sự “đắt đỏ” ấy mà cherry Mỹ được ví là “kim cương của các loại hoa quả”. Chúng giàu chất xơ nên tốt cho tiêu hóa.– Khi được “nạp” đều đặn vào cơ thể, những trái anh đào Mỹ hay cherry Mỹ sẽ có tác dụng không ngờ đối với sức khỏe:+ Giúp cải thiện chức năng não bộ: Cherry (anh đào) được coi là “thực phẩm cho não” vì chứa chất chống oxy hóa mạnh là Anthocyanin giúp cải thiện sức khỏe của não bộ.+ Phòng chứng chuột rút và bệnh Gout/bệnh khớp: Kali và chất anthocyanin cũng giúp giảm đau và sưng nhiễm, ngăn ngừa chuột rút, đặc biệt có tác dụng tích cực với bệnh gout hay khớp.+ Giảm đau bụng kinh nguyệt ở phụ nữ.+ Cải thiện tiêu hóa, giảm Cholesterol trong máu từ đó ngăn người các bệnh tim mạch.+ Phòng chống ung thư nhờ chứa chất chống oxy hóa, đồng thời làm đẹp da.+ Tốt cho thị lực: cherry giàu beta carotene và retinol cùng vitamin cao gấp 20 lần dâu tây và việt quất.+ Cải thiện giấc ngủ, giúp cơ thể ngủ ngon hơn nhờ chứa melatonin, hooc-mon cần thiết để điều hòa giấc ngủ.+ Tăng hưng phấn, thúc đẩy tinh thần khiến cơ thể vui vẻ, phấn chấn.', 177500.00, 100, 'https://product.hstatic.net/200000423303/product/cherry_do_my_ebb7c2f04f884d30836838ee78a23170_large.png'),
(3, 1, 'Cherry đỏ', 'Thông tin dinh dưỡng– Cherry Mỹ là loại Trái Cây Nhập Khẩu cung cấp vitamin, các khoáng chất thiết yếu cho cơ thể. Tất cả các loại cherry đều có giá trị dinh dưỡng cao, chính vì sự “đắt đỏ” ấy mà cherry Mỹ được ví là “kim cương của các loại hoa quả”. Chúng giàu chất xơ nên tốt cho tiêu hóa.– Khi được “nạp” đều đặn vào cơ thể, những trái anh đào Mỹ hay cherry Mỹ sẽ có tác dụng không ngờ đối với sức khỏe:+ Giúp cải thiện chức năng não bộ: Cherry (anh đào) được coi là “thực phẩm cho não” vì chứa chất chống oxy hóa mạnh là Anthocyanin giúp cải thiện sức khỏe của não bộ.+ Phòng chứng chuột rút và bệnh Gout/bệnh khớp: Kali và chất anthocyanin cũng giúp giảm đau và sưng nhiễm, ngăn ngừa chuột rút, đặc biệt có tác dụng tích cực với bệnh gout hay khớp.+ Giảm đau bụng kinh nguyệt ở phụ nữ.+ Cải thiện tiêu hóa, giảm Cholesterol trong máu từ đó ngăn người các bệnh tim mạch.+ Phòng chống ung thư nhờ chứa chất chống oxy hóa, đồng thời làm đẹp da.+ Tốt cho thị lực: cherry giàu beta carotene và retinol cùng vitamin cao gấp 20 lần dâu tây và việt quất.+ Cải thiện giấc ngủ, giúp cơ thể ngủ ngon hơn nhờ chứa melatonin, hooc-mon cần thiết để điều hòa giấc ngủ.+ Tăng hưng phấn, thúc đẩy tinh thần khiến cơ thể vui vẻ, phấn chấn.', 3450000.00, 100, 'https://product.hstatic.net/200000423303/product/cherry1_9cd5b471f2664df9929386643908e8ef_large.jpeg'),
(4, 1, 'Dâu tây ', 'Chất lượng:Nhập khẩuĐặc điểm nổi bật:Thông tin dinh dưỡng:Lượng chất bảo vệ, chống oxy hóa của dâu gấp 10 lần cà rốt, giúp loại bỏ các gốc tự do có hại, làm chậm quá trình lão hóa.Các axit ellagic, lutein và zeathaccins kết hợp với vitamin C có trong dâu tây giúp ngăn ngừa ung thư, chế ngự sự phát triển của các khối u, tiêu diệt các gốc tự do và trung hòa ảnh hưởng tiêu cực có khả năng xảy ra ở tế bào trong cơ thể.Dâu có tính mát giúp giải nhiệt, thải độc hiệu quả.Dâu tây còn thường được dùng trong chế độ ăn kiêng dành cho người béo, giúp giảm cân hiệu quả.Vitamin C trong dâu tây có tác dụng sản sinh ra collagen, cải thiện độ đàn hồi cho da.Hàm lượng vitamin C trong dâu tây được đánh giá cao hơn cả cam, giúp tăng sức đề kháng, giảm cảm cúm.Hướng dẫn sử dụng:Rửa nhẹ nhàng dâu tây dưới nước.Ăn tới đâu rửa tới đó, không rửa hết toàn bộ tránh làm dâu bị dập.Hạn chế chạm tay nhiều lần vào dâu vì làn da dâu mỏng rất dễ bị nhiễm mốc, mau hư.', 245000.00, 100, 'https://product.hstatic.net/200000423303/product/untitled_design_ebde456628414a558212cd7a6b85cf05_large.png'),
(5, 1, 'Dâu Tuyết Hàn Quốc', 'Nguồn gốcDâu Tuyết Hàn QuốcDâu tây bạch tuyết tên tiếng Anh là Pineberry, có nguồn gốc từ Nam Mỹ, được lai tạo giữa Fragaria × ananassa. Loại quả này suýt bị tuyệt chủng cho tới năm 2010 được nông dân Hà Lan và Bỉ trồng lại nhằm mục đích thương mại và xuất khẩu. Dâu tây bạch tuyết rất khó phát triển nên phải trồng trong nhà kính với nhiệt độ, không khí, độ ẩm luôn được kiểm soát .Dâu tuyết Hàn Quốc hộp 330gĐặc điểm củaDâu Tuyết Hàn QuốcLoại quả này mang đặc tính “phá cách” này khiến bạn thích thú ngay từ lần nhìn đầu tiênVề hình dáng của dâuQủa giống với dâu tây đỏ nhưng to hơn, khi chín chuyển từ màu xanh sang trắng và các mắt có màu đỏ sậm đẹp mắt, vỏ mỏngVề hương vị đặc trưng củaDâu Tuyết Hàn QuốcDâu có thịt mọng nước  và có vị thơm như dứa, quả to cắn ngập răng rất thú vị, do được trồng ở thời tiết khắc nghiệt và theo chuần organic nêndâu tuyết Hàn Quốckhá mắc và thường dành cho các hộ gia đình có điều kiện.Giá trị dinh dưỡng màDâu Tuyết Hàn Quốcmang lạiĂn nhiều dâu sẽ tăng đề kháng, chống stress, cải thiện giấc ngủ sâu, giảm hàm lượng cholesterol trong máu và bổ sung cho cơ thế nguồn Vitamin A, B1, B2 và đặc biệt là lượng vitamin C giúp làm đẹp da và vóc dángBảo quảnDâu Tuyết Hàn Quốcthế nàoQuả Dâu luôn tươi ngon khi giữ nhiệt độ mát của tủ lạnh hoặc tủ mát chuyên dụng từ 7- 10 ngày, không để dâu quá gần vị trí lạnh có thể dẫn đến đông cứng dâu làm quả dâu bị khô', 435000.00, 100, 'https://product.hstatic.net/200000423303/product/dau-anh-dao-nhat_30412f8f229048398f2470c7cc6a8267_large.jpg'),
(6, 1, 'Hồng giòn hàn quốc', 'Xuất xứ:Hàn QuốcTiêu chuẩn chất lượng:Nhập khẩuĐặc điểm nổi bật:Hồng Hàn Quốc về size M, trái to, trung bình khoảng 180 - 200g/trái.Vỏ màu cam rất mỏng,quả chắc tay, ruột giòn vị ngọt thanh,không chát, có hạtHồng có giá trị dinh dưỡng cao, là trái cây ưa thích của người dân xứ sở kim chiThông tin sản phẩm:Quả hồng chứa nhiều calo, protein, chất xơ, kali, mangan, các vitamin A, C, E, K, B6, và nhiều dưỡng chất khác rất tốt cho sức khoẻ.Quả hồng giòn chứa các hợp chất thực vật có lợi có chất chống oxy hóaQuả hồng cũng chứa carotenoids, flavonoid và vitamin E giúp chống oxy hóa mạnh, chống viêm.Các dưỡng chất trong hồng giúp tăng cường hệ tiêu hóa và hỗ trợ nâng cao sức khỏe.Quả hồng cung cấp nhiều vitamin A và chất chống oxy hóa rất quan trọng cho sức khỏe của mắt.Hướng dẫn bảo quản/sử dụng:Bảo quản ở ngăn mát tủ lạnh', 105000.00, 100, 'https://product.hstatic.net/200000423303/product/hong_gion_han_quoc_tui_1kg_1447d3bcceaa4eae9fe6ee0831703936_large.jpg'),
(7, 1, 'Kiwi vàng hữu cơ', 'Kiwi Vàng hữu cơ Zespri New Zealand (Organic) được trồng trên những khu vườn chỉ sử dụng phân bón khoáng chất và hữu cơ không gây ô nhiễm đất đai. Các đối tác nông nghiệp sử dụng các thành phần tự nhiên, như phân compost hay algae để chống côn trùng và sâu bệnh. Thuốc diệt cỏ, thuốc diệt côn trùng hay các chất tổng hợp khác không được dùng trong vườn. Điều này có nghĩa là các quả Kiwi Organic Zespri được trồng hoàn toàn thuần tự nhiên.Những quả Kiwi Zespri Hữu Cơ được kiểm định bởi tổ chức BIO-GRO New Zealand. Kiwi Hữu Cơ được trồng và được chứng nhận theo tiêu chuẩn hữu cơ nghiêm ngặt nhất.Kiwi vàng Zespri Organic quả to, tươi ngon, mọng nước, cầm cứng tay, vị ngọt ngọt xen lẫn chua dịu nhẹ thanh mát, đặc trưng của Kiwi không thể lẫn vào đâu được.Giá trị dinh dưỡng của Kiwi:Quả kiwi lại chứa gấp đôi lượng vitamin C so với quả cam. Do đó mỗi ngày, bạn chỉ cần ăn một quả kiwi là đã có đủ lượng vitamin C cần thiết. Ngoài ra, kiwi cũng là loại trái cây chứa nguồn vitamin E dồi dào, có tác dụng tốt cho tim mạch.Quả kiwi có cùng lượng kali như quả chuối nhưng lại chỉ chứa một nửa lượng calo nên dẫn tới hàm lượng muối trong quả kiwi rất thấp và vẫn đảm bảo lượng kali cao – là chất có lợi để ổn định huyết áp và sức khỏe tim mạch.Quả kiwi không những có hàm lượng lutein cao hơn các loại quả – mà các nghiên cứu gần đây còn cho thấy chất lutein có trong quả kiwi còn rất dễ hấp thụ, giúp ngăn ngừa việc giảm thị lực do tuổi tác. Bên cạnh đó, chỉ cần ăn 2-3 quả kiwi mỗi ngày là giảm được lượng tế bào bị tổn thương do căng thẳng gây ra; giảm được được sự tụ tập của các tiểu huyết cầu – vốn là một yếu tố có nguy cơ cao dẫn tới làm tắc động mạch và các mạch máu.', 997000.00, 100, 'https://product.hstatic.net/200000423303/product/kiwi_organic_vang_a087c168c2a8461d94ac9ec5785862d6_large.png'),
(8, 1, 'Kiwi vàng pháp', 'kiwi là một trong những thực phẩm giàu vitamin C bổ dưỡng nhất? Đúng rồi. Trong thực tế, chỉ cần một cốc kiwi cung cấp gần 275% mức trợ cấp hàng ngày của vitamin C.Một lý do quả Kiwi không thể phủ nhận là một siêu thực phẩm là bởi vì nó là một loại thực phẩm chống oxy hóa cao có khả năng chống lại các tổn thương gốc tự do. Đây là lợi ích dinh dưỡng từ Kiwi quan trọng nhất.  Khi Kiwi được bổ sung vào chế độ ăn bình thường và chỉ có một đến hai quả kiwi vàng mỗi ngày sẽ giúp giảm đáng kể tổn thương oxy hóa bên trong xảy ra. Một lý do lớn cho điều này là mức vitamin C trong quả cam quả kiwi và cung cấp các lợi ích giúp sửa chữa và duy trì một số mô và hệ thống cơ thể.Ngoài ra, vitamin E của kiwi không chứa chất béo và là thành phần hỗ trợ mạnh trong việc giảm cholesterol và chống lại các gốc tự do. Ngoài hàm lượng vitamin C và E cao, cả hai chất chống oxy hóa tự nhiên, quả Kiwi cũng giàu polyphenol có hoạt tính kích thích miễn dịch, có nghĩa là chúng có thể nhắc nhở phản ứng của hệ thống miễn dịch.Collagen là protein phong phú nhất trong cơ thể chúng ta và khối xây dựng duy trì da, cơ, xương và gân. Nó phân hủy khi chúng ta già đi và phụ thuộc vào vitamin C, mà chúng ta biết quả Kiwi có rất nhiều.Theo nghiên cứu được công bố trên tạp chí Cellular Physiology, polysaccharide trong quả Kiwi có thể tăng gấp đôi tổng hợp collagen trong cơ thể, so với điều kiện bình thường khi hoạt động này giảm khi chúng ta già đi. Kiwi cũng chứa một carotenoid và chất chống oxy hóa được gọi là lutein, điều này cực kỳ có lợi cho sức khỏe da bằng cách bảo vệ da khỏi ánh sáng tia cực tím, đánh dấu một lợi ích dinh dưỡng kiwi khác. Lợi ích dinh dưỡng từ Kiwi luôn được đánh giá cao đối với sức khỏe da.', 167500.00, 100, 'https://product.hstatic.net/200000423303/product/kiwi_vang_phap_0d9821d6c0544e88bb8a167658510dff_large.png'),
(9, 1, 'Kiwi xanh organic', 'Kiwi Xanh hữu cơ New Zealand:có vỏ màu đồng, có lông, không trơn nhẵn như kiwi vàng. Khi trái còn xanh, sẽ cứng trái và có độ chua ngọt xen kẽ. Khi trái bắt đầu chín, cơm sẽ vàng hơn và có độ ngọt và mềm mọng nước hơn.  Hương vị ngọt ngào vùng nhiệt đới, thơm mát đã khiến nó trở thành món tráng miệng mùa hè tuyệt vời. Ngoài ra kiwi tươi còn được biết đến với nhiều giá trị dinh dưỡng tốt cho cơ thể.Thông tin dinh dưỡng:Trong trái kiwi chứa hàm lượng cao kali, giúp cân bằng electron trong cơ thể nhờ vào cơ chế làm trung hòa hàm lượng natri. Các chất chống oxy hóa trong kiwi giúp bảo vệ ADN khỏi quá trình oxy hóa. Bên cạnh đó, kiwi còn có khả năng ngăn chặn ung thư. Hàm lượng cao vitamin C cùng các hợp chất chống oxy hóa trong trái kiwi đã được chứng minh có khả năng tăng cường hệ miễn dịch Kiwi là nguồn chất xơ tuyệt vời, có thể ngăn ngừa táo bón và tiêu chảy cũng như những vấn đề về ruột khác.Hàm lượng chất xơ trong kiwi có tác dụng loại độc tố ra khỏi hệ thống đường ruột. Trong thành phần trái kiwi chứa chất chống đông máu, vừa không có bất kỳ ảnh hưởng nào mà còn tốt cho sức khỏe. Với hàm lượng thấp glycemic, kiwi không làm tăng lượng đường trong máu một cách đột ngột. Hàm lượng glycemic phù hợp trong loại trái cây này luôn an toàn cho bệnh nhân tiểu đường. Nguồn vitamin E trong kiwi được biết đến như chất chống oxy hóa, có tác dụng bảo vệ da khỏi tình trạng thoái hóa. Với nguồn dưỡng chất cân bằng, kiwi thật sự tốt cho cơ thể mọi người, mọi lứa tuổi, mọi chế độ ăn uống.Hướng dẫn sử dụng:Ăn ngon hơn khi để ngăn mát, và phù hợp làm sinh tố hoặc ăn kèm yogurt cũng đều rất ngon và khoẻ mạnh.Hướng dẫn bảo quản:Bảo quản sản phẩm ở ngăn mát tủ lạnh để dùng dần.Lưu ý, không để sản phẩm ở ngoài trời nóng và ẩm ướt.', 626500.00, 100, 'https://product.hstatic.net/200000423303/product/kiwi_xanh_huu_co_nguyen_thung_67909171710444dea58143710c15caec_large.jpg'),
(10, 1, 'Lê Hàn Quốc (Korean pear)', 'Quả có thịt trắng là ngon ngọt, hạt nhỏ màu trắng. Hương vị đã được mô tả như là một sự pha trộn giữa dưa ngọt và dưa chuột. Thịt dưa lê Hàn Quốc có vị ngọt rất tự nhiên, vị giòn chắc, hạt nhỏ màu trắng. Ngay từ miếng đầu tiên bạn đã có thể cảm nhận được vị thơm nhẹ dịu của nó như sự hòa quyện hoàn hảo của dưa ngọt và dưa chuột.Dưa lê Hàn là thực phẩm rất giàu dưỡng chất như: vitamin A, C, E, chất xơ, chất khoáng, chất chống oxy hóa,… được y học Hàn Quốc đưa vào sử dụng từ rất lâu.Là liều thuốc hiệu quả chữa trị bệnh viêm dạ dày cấp tính, sốt, rối loạn tâm thần, khó tiểu, vàng da,…Chất xơ cao có lợi cho tiêu hóa, làm sạch đường ruột, giảm cholesterol có hại trong cơ thể. Hàm lượng nước cao đánh bay cảm giác mệt mỏi do áp lực công việc, gia đình hay thời tiết khó chịu, là thực phẩm rất phù hợp cho chứng kho tiêu và ho triền miên.Quả lê rất giàu vitamin C và pectin là chất giúp làm tăng độ xốp và men vi sinh giúp hệ tiêu hóa ổn định, nhu động ruột thải bã dễ dàng. Vỏ quả lê có giá trị chữa bệnh cao, có lợi cho tim và phổi, giúp tiêu độc hạ nhiệt. Lê chứa vitamin A, B, C, D và E. Một trái lê có thể cung cấp 10% hàm lượng vitamin C và hàm lượng canxi khá lớn. Lê mặc dù rất ngọt, song độ nóng và độ ngọt gây béo rất thấp, rất thích hợp với những ai thích ăn ngọt nhưng sợ tăng cân.', 79500.00, 100, 'https://product.hstatic.net/200000423303/product/le_han_quoc_e14d213bf38347108e9ee9e418efdf35_large.jpg'),
(11, 1, 'Lựu Đỏ Peru', 'Lựu có hương thơm cực kỳ hấp dẫn, các hạt nhỏ bên trong thì đầy mọng nước, chỉ cần cắn rụp một cái thôi là có thể mang lại cho bạn cảm giác mát lạnh, tận hượng vị ngọt thanh trong lành.Công dụngLựu là loạitrái cây tươicó chứa nhiều chất oxy hóa, vitamin C và nhiều dưỡng chất khác có tác dụng làm đẹp, tăng cường hệ miễn dịch và bảo vệ sức khỏe, đặc biệt cho bà bầu.Thành phần Natri, vitamin B2, B, niaxin, vitamin C, canxi và photpho, nước ép từ tráilựurất tốt cho thai phụ và sự phát triển trí não của thai nhi, giúp em bé khi được sinh ra giảm nguy cơ bị tổn thương ở não và tim mạch.Bảo quảnLựuđược bảo quản tốt nhất ở nhiệt độ 4 - 5 độ C, làm sạch và lau khô trước khi cho trái lựu vào trong ngăn mát sẽ bảo quản được lâu hơn, an toàn hơn.', 329000.00, 100, 'https://product.hstatic.net/200000423303/product/unnamed_01bc25ff5e7346f2a478dd2cf7e067aa_large.jpg'),
(12, 1, 'Nho kẹo hữu cơ', 'Nho không tăng độ đường (ngọt) sau khi hái nên Nho chỉ được thu hoạch khi chín, vì vậy cần được bảo quản cẩn thận, lúc này Nho rất nhạy cảm, dễ bị rụng. Lúc này nho rất nhạy cảm, dễ bị rụng. Nhiệt độ để bảo quản nho từ khoảng 0 – 4 độ C,  luôn luôn để nho', 249000.00, 100, 'https://product.hstatic.net/200000423303/product/nho_keo_smile_nhap_khau_450g_ed3_69875d7a6c95457280939e42a8c1e540_large.jpeg'),
(13, 1, 'Nho xanh không hạt (non-gmo)', 'Nho được trồng tại các vùng thung lũng màu mỡ và khí hậu ôn đới với đặc điểm ngày nóng, đêm lạnh. Sau khi ngủ đông 3 tháng trong thời tiết lạnh, nho sẽ chồi lộc, ra hoa và kết trái vào mùa xuân. Nho xanh không hạt Úc quả to, thuôn dài, màu xanh hổ phách, ', 192500.00, 100, 'https://product.hstatic.net/200000423303/product/nho_xanh_khong_hat__non-gmo__-_500g_b19ad79e912744ebab047545baac117a_large.png'),
(14, 1, 'Quýt Ai Cập Mafa', 'Quýt có nguồn gốc từ Ai Cập. Quả tròn vừa ăn, có vỏ ngoài màu vàng tươi, vị ngọt thanh, mọng nước, ít xơ, có hạt và dễ bóc vỏ. Quýt mà Vitamin House nhập khẩu đến từ thương hiệu - một trong những nhà trồng quýt lớn nhất nước.Quýt chứa nhiều vitamin C tốt ', 139000.00, 100, 'https://product.hstatic.net/200000423303/product/7f0d585ea8ea5e64b014c616b10c105d_88c4e02b242c4a4abf921201522367e0_large.jpg'),
(15, 1, 'Quýt úc Oma Organicfood', 'Lợi ích của trái quýt với sức khỏe:- Hạn chế tăng cân, béo phì do chứa nhiều chất xơ và hoàn toàn không có chất béo.- Tăng cường hệ miễn dịch nhờ lượng Vitamin C dồi dào.- Phòng chống các bệnh về tim mạch, khắc phục tình trạng co thắt cơ tim.- Bảo vệ làn ', 59000.00, 100, 'https://product.hstatic.net/200000423303/product/images__7_-700x700_d8ec04b47e7149ca91ee2bab52e7c1c0_large.jpg'),
(16, 1, 'Quýt vàng Úc', 'Quýt Úc có nhiều lợi ích cho sức khỏe, chúng chứa nhiều Vitamin C, chất xơ và các chất chống oxy hóa.Màu vàng óng, có vị ngọt đậm xen lẫn vị chua nhẹ, hương thơm đặc trưng, dùng để trang trí và tăng thêm hương vị cho mỗi buổi ăn của gia đình bạn.Tiêu chuẩ', 85000.00, 100, 'https://product.hstatic.net/200000423303/product/quyt_uc_075cede6208b4b728653fb73ad0335e9_large.jpg'),
(17, 1, 'Táo dazzle', 'Mùa vụ của táo DazzleTáo Dazzle được trồng trong khoảng từ tháng 3 đến tháng 8Táo Dazzle có chỉ số PSI (độ giòn) là 8,5-9 và độ ngọt (brix) là 16 và 17.Đặc điểm của táo DazzleTáo Dazzle có nguồn gốc từ New Zealand, nơi được mệnh danh là có nhiều táo nhất ', 67000.00, 100, 'https://product.hstatic.net/200000423303/product/tao-huu-co-dazzle_76f5ce0e169c4da3b02edcb87e37e735_large.jpg'),
(18, 1, 'Táo đỏ hữu cơ daisy mỹ', 'TÁO ĐỎ DAISY GIRL CHUẨN HỮU CƠ - KHÔNG NÊN BỎ QUA ‼️🍎 Táo Daisy Girl Organic U.S.A 🍎Lần đầu tiên nhập khẩu thị trường Việt NamTáo Organic Daisy Girl cực giòn và ngọt, đặc biệt rất thơm. Chất lượng của táo Daisy Girl chẳng thua kém bất kì 1 loại táo nào đâ', 1950000.00, 100, 'https://product.hstatic.net/200000423303/product/tao_daisy_528dc6c64d2c4b77815c5efe89bad42a_large.png'),
(19, 1, 'Táo envy mỹ', 'Envy Organic Mỹ có quả to tròn, với vỏ màu đỏ điểm thêm các sọc màu vàng Envy Organic mang trong mình vị ngọt tự nhiên, hương thơm quyến rũ cùng vị giòn tan khiến bạn không thể cưỡng lại được..Hãy cắn thử táo Envy Organic , bạn sẽ bị cái giòn, vị ngọt ngo', 289000.00, 100, 'https://product.hstatic.net/200000423303/product/tao-envy-organic_1bae02bb976f44e4850b4c937036bb3d_large.jpg'),
(20, 1, 'Táo envy New Zealand', 'Envy có quả to tròn, với vỏ màu đỏ điểm thêm các sọc màu vàng Envy  mang trong mình vị ngọt tự nhiên, hương thơm quyến rũ cùng vị giòn tan khiến bạn không thể cưỡng lại được..Hãy cắn thử táo Envy, bạn sẽ bị cái giòn, vị ngọt ngon hương thơm nồng nàn của t', 124500.00, 100, 'https://product.hstatic.net/200000423303/product/tao_envy_size_24_22c1a296f4f741d88b3c5009c927d0d8_large.png'),
(21, 1, 'Táo hữu cơ juliet', 'Táo JULIET Organic là loại táo duy nhất trên thế giới được sản xuất độc quyền trong canh tác hữu cơ. Táo được trồng độc quyền tại Pháp và chỉ được trồng hữu cơ.Tại Pháp, táo Juliet Organic thực sự rất phổ biến và được ưa chuộng. Nó thậm chí có cả nhân vật', 74500.00, 100, 'https://product.hstatic.net/200000423303/product/tao_huu_co_juliet_b19bed9e80f741ee9c7e96bf3132c332_large.png'),
(22, 1, 'Táo juliet pháp organic', 'TÁO JULIET ORGANIC PHÁP -NGON LÀNH TỪ THIÊN NHIÊNĐược gieo trồng theo phương pháp thuần hữu cơ, táo Juliet Organic chứa trọn hương vị thiên nhiên của miền nam nước Pháp lịch lãm.- KHÔNG sử dụng bất kỳ phân bón hóa học hay chất bảo vệ thực vật nào- Vỏ ngoà', 74500.00, 100, 'https://product.hstatic.net/200000423303/product/tao_juliet_phap_organic_size_100_a2b3afdc3407490c8ace4732af77d3ff_large.png'),
(23, 1, 'Táo Pixie hữu cơ Pháp', 'Vi vu nửa vòng trái đất để hạ cánh tại Organicfood.vn - Táo Pixie Organic vẫn giữ trọn trong mình hương vị tinh tế của ẩm thực Pháp cùng một nguồn dinh dưỡng đặc trưng giúp đem đến một sức khỏe vững vàng cho tim mạch, hệ tiêu hóa...Ẩn chứa sau mỗi những q', 62000.00, 100, 'https://product.hstatic.net/200000423303/product/d4d99907-695e-4d93-844a-a00decdb5faa_2644bcd07fb945c091f0053b7ebda0da_large.jpg'),
(24, 1, 'Táo Rockit New Zealand', 'Xuất xứ: New ZealandTiêu chuẩn chất lượng: Nhập KhẩuĐặc điểm sản phẩm:Trái vừa ăn, giòn, ngọt và có chút chua nhẹ.Loại táo ngon được nhiều người yêu thích. Trái to vừa với hộp ống tiện lợi mang đi.Hướng dẫn sử dụngĂn trực tiếp, làm nước ép hoặc làm bánh đ', 160000.00, 100, 'https://product.hstatic.net/200000423303/product/tao_rockit_new_zealand_size_48_53cb076fd5284744802aff048b5b7461_large.jpeg'),
(25, 1, 'Việt quất hữu cơ rainier', 'Xuất xứ:MỹChất lượng:Nhập khẩuĐặc điểm nổi bật:Vị ngọt, chua nhẹ vô cùng hòa quyện.Thông tin dinh dưỡng:Quả việt quất giàu các chất chống oxy hóa khác nhau, cùng với các vitamin như vitamin C, B2, B6, E và K, chất xơ, đồng, mangan, lutein, gallic acide,Tă', 119000.00, 100, 'https://product.hstatic.net/200000423303/product/viet_quat_huu_co_rainier_-_125g_9aa81f3c40424b81ad741c677ea7595a_large.jpeg'),
(26, 1, 'Việt quất hữu cơ rainier', 'Xuất xứ:MỹChất lượng:Nhập khẩuĐặc điểm nổi bật:Vị ngọt, chua nhẹ vô cùng hòa quyện.Thông tin dinh dưỡng:Quả việt quất giàu các chất chống oxy hóa khác nhau, cùng với các vitamin như vitamin C, B2, B6, E và K, chất xơ, đồng, mangan, lutein, gallic acide,Tă', 119000.00, 100, 'https://product.hstatic.net/200000423303/product/viet_quat_huu_co_rainier_-_125g_9aa81f3c40424b81ad741c677ea7595a_large.jpeg'),
(27, 1, 'Việt quất jumbo', 'Việt Quất New Zealand Size Jumbolà loại trái cây luôn được ưa chuộng trong những mùa hè nóng bức do có vị ngọt, mọng nước, nhiều chất dinh dưỡng. Không những thế, bạn còn có thể kết hợp chúng với những thực phẩm khác để chế biến những món ăn bổ dưỡng.Thôn', 159000.00, 100, 'https://product.hstatic.net/200000423303/product/viet-quat-new-zealand-size-jumbo-hop_be7a46d6a256469abdbc3d387e4422e7_large.jpg'),
(28, 2, 'Cải bẹ trắng hữu cơ', 'Cải bẹ trắng có hình dáng gần giống cải thìa nhưng cuốn của nó màu trắng sữa. Cải bẹ trắng thường dùng đễ chế biến : nấu canh, hấp cá, ăn lẩu, ăn sống, trộn dầu giắm ăn như xà lách, muối dưa.Thành phần dinh dưỡng trong 100g rau cải bẹ trắng ăn được trong ', 29400.00, 100, 'https://product.hstatic.net/200000423303/product/cai_be_trang_78c5d77a2be248e4b78263322b4555c9_large.png'),
(29, 2, 'Cải bó xôi hữu cơ ', '• Cải bó xôi còn gọi là rau chân vịt, ba thái, có tên khoa học là Spinacia oleracea L. Chenopodiaceae. Cải bó xôi thường có cuống nhỏ và lá xanh đậm, lá mọc chụm lại ở một gốc bé xíu. Thân và lá dòn, dễ gãy, dập. Cải bó xôi không những là một món ăn ngon ', 43500.00, 100, 'https://product.hstatic.net/200000423303/product/cai-bo-xoi-huu-co_dcef0c0e1fc1491599583cc06a19b830_large.jpg'),
(30, 2, 'Cải dún hữu cơ', 'Cải dún là loại rau xanh chứa vitamin C, mềm, ngọt mát, dễ ăn, giải nhiệt trong những ngày nóng. Chế biến món ăn Cải dún nấu canh thịt bằm, luộc chấm mắm, xào dầu… đều rất ngon. Bữa ăn gia đình không thể thiếu món canh rau hữu cơ thơm ngon này', 33750.00, 100, 'https://product.hstatic.net/200000423303/product/cai-dun-huu-co_772109c4c8084d3e9257e0ebbfd79d2e_large.jpg'),
(31, 2, 'Cải kale hữu cơ', 'Cải Kale là một loại rau với lá xanh, có họ gần với bắp cải hơn các loại rau trồng khác. Với đặc tính khá cứng nên phải nấu khá lâu mới mềm (như rau ngót). Cải Kale rất giàu chất xơ, canxi cùng nhiều vitamin (như vitamin C, A, K…) và khoáng chất có lợi kh', 62500.00, 100, 'https://product.hstatic.net/200000423303/product/cai-kale-huu-co_ae3cdc590cc4408baef391f07d422596_large.jpg'),
(32, 2, 'Cải ngồng hữu cơ', 'Ngồng cải là thực phẩm rất tốt cho sức khỏe vì hầu như mọi chất dinh dưỡng của cây được dồn để nuôi hoa. Bên trong cây cải chứa nhiều vitamin như vitamin B1, B2, Betacaroten…có lợi cho sức khỏe, là thực phẩm giúp đẹp da, giúp cơ thể chống lại một số tác h', 29400.00, 100, 'https://product.hstatic.net/200000423303/product/cai_ngong_huu_co_3e072e9a34324b89a4809b56bc979e03_large.png'),
(33, 2, 'Cải ngọt hữu cơ ', 'Cải ngọt có nguồn gốc từ Ấn Độ, Trung Quốc. Cây thảo, cao tới 50 - 100 cm, thân tròn, không lông, lá có phiến xoan ngược tròn dài, đầu tròn hay tù, gốc từ từ hẹp, mép nguyên không nhăn, mập, trắng trắng, gân bên 5 - 6 đôi, cuống dài, tròn. Chùm hoa như ng', 24500.00, 100, 'https://product.hstatic.net/200000423303/product/cai_ngot_huu_co_cbec648b32644f609c65236a87ffdc82_large.png'),
(34, 2, 'Cải thìa hữu cơ ', 'Một chén cải thìa sống (tương đương khoảng 170g) chứa 9 calo, 1g protein, 1,5g carbohydrate, 0,7g chất xơ, không có cholesterol và chỉ 0,1g chất béo không có khả năng sản sinh cholesterol. Với hàm lượng dinh dưỡng lành mạnh như trên, cải thìa không chỉ ng', 29400.00, 100, 'https://product.hstatic.net/200000423303/product/cai-thia-huu-co_32d27534b5824cedaed997aaf9adb451_large.jpg'),
(35, 2, 'Cải xanh hữu cơ', 'Rau cải xanh hữu cơ là loại rau họ cải thuộc nhóm rau. Rau cải xanh tại Organicfood.vn là loại rau được trồng tuân thủ nghiêm ngặt theo quy trình kiểm soát chặt chẽ theo nguyên tắc 6 KHÔNG. trong đó có KHÔNG PHUN THUỐC TRỪ SÂU, đảm bảo an toàn cho sức kho', 24500.00, 100, 'https://product.hstatic.net/200000423303/product/cai-xanh-huu-co_6e554418635142bab42cb6cbb78c27ce_large.jpg'),
(36, 2, 'Cần tây hữu cơ', 'Cần tây tại Organicfood.vn được chứng nhận hữu cơ bởi USDA và EU Organic. Cần Tây là loại cây thảo sống 1-2 năm có thân mọc đứng, cao khoảng 1m, có rãnh dọc. Lá ở gốc có cuống, xẻ ba thuỳ hình tam giác, các lá giữa và lá ở ngọn không có cuống, cũng chia b', 97000.00, 100, 'https://product.hstatic.net/200000423303/product/can-tay-huu-co_0feceb1ecf5649df899e18407e0f2379_large.jpg'),
(37, 2, 'Đọt rau lang hữu cơ', 'Rau khoai lang là thứ rau dân dã trước đây chỉ dành cho nhà nghèo. Ngày nay, người ta đã \"phát hiện\" ra rằng thứ rau này cũng rất ngon và có nhiều tác dụng đối với sức khỏe. Ở một số nước như châu Âu, Hồng Kông, Nhật Bản... rau khoai lang không còn là loạ', 38000.00, 100, 'https://product.hstatic.net/200000423303/product/dot_rau_lang_organic_db894f83890b41e18e21186e994179d6_large.jpeg'),
(38, 2, 'Hành lá hữu cơ', 'Hành lá tốt cho sức khỏe vì chứa nhiều vitamin C và K. Đây cũng là nguồn phong phú vitamin A rất tốt cho mắt.Theo báo The Times of India dẫn nguồn từ các chuyên gia dinh dưỡng Ấn Độ, hành lá còn có tác dụng giảm lượng đường trong máu. Những ai có vấn đề v', 19000.00, 100, 'https://product.hstatic.net/200000423303/product/hanh-la-huu-co_a65378db597946fe8c47ab7b9010bac6_large.jpg'),
(39, 2, 'Húng lủi hữu cơ', 'Húng lủi thuộc cây thảo, là loại cây có nguồn gốc từ hoang dã, mùi thơm đặc trưng thường được dùng làm rau sạch, chế biến với nhiều món ăn, ngoài ra cây còn được sử dụng để chế biến thành nhiều loại thảo dược chữa bệnh, xua đuổi muỗi.  CÔNG DỤNGRau húng l', 15000.00, 100, 'https://product.hstatic.net/200000423303/product/hung-lui-huu-co_8115569038564585a99e14d27d291898_large.jpg'),
(40, 2, 'Húng quế hữu cơ', 'Húng quế là cây rau xanh, lá nhỏ, cành tím, có hoa màu trắng. Húng quế có các loại húng quế, húng quế ngọt, húng chanh, húng quế hồi.CÔNG DỤNG Húng quế có lợi cho sức khỏe: Tốt cho hệ tiêu hoá, kháng khuẩn, ngăn ngừa lão hóa, lợi sữa, giảm cholesterol, gi', 15000.00, 100, 'https://product.hstatic.net/200000423303/product/hung-que-huu-co_47ca788924f14811b41f71d21eab7035_large.jpg'),
(41, 2, 'Lá bạc hà hữu cơ', 'Bạc hà tây được dùng làm gia vị vì nó có mùi thơm đặc trưng.Ngoài ra bạc hà còn được điều chế làm tinh dầu... Cần để bạc hà tây trong bao kín và bảo quản trong tủ lạnh.', 30000.00, 100, 'https://product.hstatic.net/200000423303/product/la-bac-ha-huu-co_46bd363bd35d485083f7ada2182c8125_large.jpg'),
(42, 2, 'Lá trà xanh', 'Trà xanh là thức uống quen thuộc của nhiều người Việt vì tính thơm mát, thanh lọc, hương vị mộc mạc mà thơm ngon.', 36000.00, 100, 'https://product.hstatic.net/200000423303/product/la-tra-xanh_f40e59a9a3914737b2ffbec4e855c203_large.jpg'),
(43, 2, 'Mồng tơi hữu cơ', 'Rau mồng tơi (mùng tơi) vị chua ngọt, rau mồng tơi hữu cơ (có nơi gọi là rau mùng tơi) được trồng theo công nghệ vi sinh, có vị ngọt và thơm.   CÁCH SỬ DỤNG Mồng tơi nấu canh tôm, nấu với mướp, nấu với rau đây hay luộc chấm muối vừng đều rất ngon. Hầu hết', 29400.00, 100, 'https://product.hstatic.net/200000423303/product/rau-mong-toi-huu-co-300g_485f465a9c014565b6fd7a8e44f33b1c_large.jpg'),
(44, 2, 'Ngò gai', 'Ngò gai, tên khoa học là Eryngium foetidum, thuộc họ Hoa tán (Apiaceae). Còn gọi là mùi tàu, ngò tây hoặc mùi gai, hồ tuy, thích nguyên tuy, dương nguyên tuy và sơn nguyên tuy.   Rau ngò gai (miền Bắc gọi là mùi tàu) trồng theo phương thức hữu cơ tại tran', 13500.00, 100, 'https://product.hstatic.net/200000423303/product/rau-mong-toi-huu-co-300g_485f465a9c014565b6fd7a8e44f33b1c_large.jpg'),
(45, 2, 'Ngò rí hữu cơ', 'Cây ngò rí (mùi tàu) là một loại gia vị quen thuộc trong bữa cơm. Đông y còn sử dụng ngò rí làm vị thuốc trị 10 chứng bệnh hay gặp như tiêu chảy, loét miệng, thiêu máu... Không chỉ là loại gia vị giúp món ăn trở nên thơm ngon hơn, ngò rí (hay còn gọi là n', 13500.00, 100, 'https://product.hstatic.net/200000423303/product/ngo-gai-huu-co_c24513d118934516a8965be45cea041f_large.jpg'),
(46, 2, 'Ngò tây lá xoăn hữu cơ', 'Ngò tây (parsley) được trồng tại trang trại hữu cơ Organica tại Đà Lạt (Lâm Đồng).Rau được trồng theo phương thức hữu cơ (không sử dụng phân bón hóa học, thuốc trừ sâu hóa học và chất kích thích tăng trưởng). Thay vào đó, chúng tôi sử dụng các loại phân b', 33000.00, 100, 'https://product.hstatic.net/200000423303/product/ngo-tay-huu-co_aaf93bc333a643e79624bd0761e26e03_large.jpg'),
(47, 2, 'Rau cải mầm hữu cơ', 'Rau cải mầm tại Organicfood.vn đảm bảo được lựa chọn lựa và nuôi trồng trong môi trường hoàn toàn hữu cơ, đảm bảo an toàn sức khỏe và giữ nguyên các chất dinh dưỡng cho cơ thể.CÔNG DỤNG Hàm lượng chất dinh dưỡng có trong rau cải mầm cao gấp khoảng 5 lần r', 46500.00, 100, 'https://product.hstatic.net/200000423303/product/cai-mam-huu-co_b4f28add6e3f4937867e1d29894f5292_large.jpg'),
(48, 2, 'Rau dền cơm hữu cơ', 'Rau dền cơm hữu cơ tại Organicfood.vn được trồng và thu hoạch trong môi trường hoàn toàn hữu cơ, không có các chất hóa học, không sử dụng thuốc tăng trưởng, biến đổi gen,… Chắc chắn sẽ là một thực phẩm không thể thiếu trong mỗi bữa ăn hàng ngày của gia đì', 32700.00, 100, 'https://product.hstatic.net/200000423303/product/den_com_33e2ff39d20d43659bc3090f22cea9e7_large.png'),
(49, 2, 'Rau dền hữu cơ ', 'Rau dền hữu cơ tại Organicfood.vn được trồng và thu hoạch trong môi trường hoàn toàn hữu cơ, không có các chất hóa học, không sử dụng thuốc tăng trưởng, biến đổi gen,… Chắc chắn sẽ là một thực phẩm không thể thiếu trong mỗi bữa ăn hàng ngày của gia đình b', 46500.00, 100, 'https://product.hstatic.net/200000423303/product/rau_den_huu_co_ecab6eb0a8a54067b4b3f3f68e4cf3d9_large.png'),
(50, 2, 'Rau diếp cá hữu cơ', 'Cây diếp cá có thân màu lục hoặc tím đỏ, lá mọc so le, hình tim, có bẹ, khi vò ra có mùi tanh như mùi cá. Diếp cá có vị cay chua, mùi tanh, tính mát, có tác dụng thanh nhiệt giải độc, lợi tiểu tiêu thũng, sát trùng, còn có tác dụng ức chế thần kinh và chố', 13200.00, 100, 'https://product.hstatic.net/200000423303/product/rau-diep-ca-huu-co_44aef83ae38f44328aa87df85bf1e83c_large.jpg'),
(51, 2, 'Rau hẹ hữu cơ', 'Rau hẹ (hay còn gọi là lá hẹ, bông hẹ) có tên gọi khác là cửu thái, cửu thái tử... Thuộc họ hành. Là một loại thuốc quý, có vị hay nồng, cay, một chút nhẫn.CÔNG DỤNG Rau hẹ có tác dụng chữa được ngứa ghẻ, chín mé, nhiễm trùng da bằng cách đắp lá giã nhỏ l', 17900.00, 100, 'https://product.hstatic.net/200000423303/product/rau-he-huu-co_a1bb8c232f884d4eade205ab6a711fe1_large.jpg'),
(52, 2, 'Rau kinh giới hữu cơ', 'Rau kinh giới hữu cơ không chỉ là gia vị được dùng trong nhiều món ăn. Bên cạnh đó loại rau này còn có công dụng chữa nhiều bệnh, rất tốt cho sức khỏe.CÔNG DỤNGRau kinh giới hữu cơ rất giàu vitamin và khoáng chất, không chỉ là gia vị mà còn có tác dụng ch', 13500.00, 100, 'https://product.hstatic.net/200000423303/product/rau-kinh-gioi-huu-co_5fc3527a76ce48b49cade9417c1fbda4_large.jpg'),
(53, 2, 'Rau muống hữu cơ', 'Rau muống hữu cơ được trồng và thu hoạch trong môi trường hoàn toàn hữu cơ, không có các chất hóa học, không sử dụng thuốc tăng trưởng, biến đổi gen,… Chắc chắn sẽ là một thực phẩm không thể thiếu trong mỗi bữa ăn hàng ngày của gia đình bạn   CÔNG DỤNG Ra', 28200.00, 100, 'https://product.hstatic.net/200000423303/product/rau_muong_huu_co_c9a3ac40b83542158cc777090bee8441_large.png'),
(54, 2, 'Rau ngót nhật hữu cơ', '- Rau ngót tính mát lạnh (nấu chín sẽ bớt lạnh), vị ngọt. Có công năng thanh nhiệt, giải độc, lợi tiểu, tăng tiết nước bọt, hoạt huyết hoá ứ, bổ huyết, cầm huyết, nhuận tràng, sát khuẩn, tiêu viêm, sinh cơ, có nhiều tác dụng chữa bệnh.', 27500.00, 100, 'https://product.hstatic.net/200000423303/product/rau-ngot-nhat-huu-co-250g_d71279e085ab47438cafbfe6c34b59ee_large.jpg'),
(55, 2, 'Rau ngót ta hữu cơ ', 'Thì là: một loài cây lấy lá làm gia vị và lấy hạt làm thuốc được sử dụng rất phổ biến ở nước ta.', 43500.00, 100, 'https://product.hstatic.net/200000423303/product/rau_ngot_ta_huu_co_-_300g_422916eae9844a969ba31b74a5a8d9fb_large.jpeg'),
(56, 2, 'Rau rocket arugula hữu cơ', 'Rau rocket hay còn gọi là cải lông,  là một nguyên liệu tuyệt vời cho món salad trộn. Vị cay cay cùng độ hăng tự nhiên giúp các món ăn từ loại rau này trở nên đặc biệt hơn bao giờ hết.  Ngoài hương vị thơm ngon, rocket còn lại một loại rau giàu chất dinh ', 57000.00, 100, 'https://product.hstatic.net/200000423303/product/rau-rocket-arugula-huu-co_c2442818bd464f3199d257418f2239b0_large.jpg'),
(57, 2, 'Rau thì là hữu cơ', 'Thì là: một loài cây lấy lá làm gia vị và lấy hạt làm thuốc được sử dụng rất phổ biến ở nước ta.', 27000.00, 100, 'https://product.hstatic.net/200000423303/product/rau-thi-la-huu-co_e0f58a9801d74a8fb3f96f23c9701469_large.jpeg'),
(58, 2, 'Rau thơm hỗn hợp hữu cơ', 'Trong ẩm thực, rau thơm hay rau gia vị là khái niệm khái quát dùng để chỉ các loại rau ăn được, được trồng hoặc hái từ tự nhiên, có mùi thơm đặc biệt tùy theo loại do các tinh dầu trong rau bay hơi tạo thành', 44250.00, 100, 'https://product.hstatic.net/200000423303/product/rau-thom-hon-hop_e410c0791eda4fbf8dbfa1ed62ee7f2e_large.png'),
(59, 2, 'Rau tía tô hữu cơ ', 'Cây tía tô thường có chiều cao 0,5- 1m. Lá mọc đối, mép khía răng, mặt dưới tím tía, có khi hai mặt đều tía, nâu hay màu xanh lục có lông nhám.CÔNG DỤNG Toàn thân có mùi tinh dầu thơm, có giá trị dinh dưỡng khá cao, giàu vitamin A, C, giàu hàm lượng Ca, F', 34000.00, 100, 'https://product.hstatic.net/200000423303/product/tia-to-huu-co_bc5a22e6748e4414950e168b5cdd63e5_large.jpg'),
(60, 2, 'Rong nho tách nước oki budo nhật bản', 'Rong nho được tách nước giúp bạn dễ bảo quản, chỉ cần ngâm trong nước 3 phút là có thể sử dụng món rong nho đầy dinh dưỡng. Rong nho tách nước OKI-BUDO hộp 10 gói x 25g được đóng gói cẩn thận, vệ sinh, có thể ăn sống hoặc ăn tái. Rong nho OKI-BUDO giòn ăn', 187000.00, 100, 'https://product.hstatic.net/200000423303/product/rong-nho-tach-nuoc-oki-budo-nhat-ban_aa002c49d3384e69b5b36d991c3bb2c0_large.jpg'),
(61, 2, 'Tần ô hữu cơ ', 'Rau tần ô (cải cúc) MÔ TẢ: Rau tần ô là loài cây thân thảo sống hằng năm, có thể cao tới 1,2m. Lá ôm vào thân, xẻ lông chim hai lần với những thuỳ hình trứng hay hình thìa không đều. Cụm hoa ở nách lá, các hoa ở mép màu vàng sẫm, các hoa ở giữa đầu màu và', 37500.00, 100, 'https://product.hstatic.net/200000423303/product/tan-o-huu-co_11ba5bae0ae84d93b7ba56248993c5fd_large.jpg'),
(62, 2, 'Xà lách búp mỹ hữu cơ', 'Xà lách Iceberg (hay còn gọi là xà lách Mỹ búp) là loại xà lách có nguồn gốc từ Mỹ, hiện đang được trồng tại một số trang trại rau ở Đà Lạt để xuất khẩu, xà lách Iceberg có đặc điểm cuộn chặt thành búp lớn, nặng, nhìn tương tự búp bắp cải.  Đây thực sự là', 60000.00, 100, 'https://product.hstatic.net/200000423303/product/xa-lach-bup-my_b613211d8656419aa255c0521633681e_large.jpg'),
(63, 2, 'Xà lách hỗn hợp asian hữu cơ hộp', 'Xà Lách Hỗn Hợp Italian Hữu Cơ Hộp 150 gram : - Được chứng nhận hữu cơ - Giàu Chất xơ - Giàu vitamin và chất chống oxi hóa Xà Lách Hỗn Hợp Italian Hữu Cơ là sản phẩm được làm từ các loại rau hữu cơ - được canh tác tại nông trại Organicfood Dalat. Hơn nữa,', 62850.00, 100, 'https://product.hstatic.net/200000423303/product/xa-lach-hon-hop-italian-huu-co-100g_117083daadcc462db7ab552fdf359a3a_large.jpg'),
(64, 2, 'Xà lách lô lô xanh hữu cơ', 'Bảo quản: Để bảo quản được lâu, bạn rửa sạch, để ráo nước, sau đó cho vào túi nilong và lưu trữ trong tủ lạnh ở nhiệt độ 5-12°C. Nếu bạn để xà lách Lô lô xanh lâu ngày, hãy cho vào nước ấm và ngâm trong nước đá lạnh vài phút, rau sẽ tươi trở lại.', 42250.00, 100, 'https://product.hstatic.net/200000423303/product/xa-lach-lolo-xanh_1ecdb9c6a85c4c58803f3ee6fe568f01_large.jpg'),
(65, 2, 'Xà lách romaine hữu cơ', 'Xà lách Romaine cây có màu xanh tươi, ăn rất giòn, có vị ngọt và thơm, hiện đang được trồng tại một số trang trại rau cao cấp ở Đà Lạt. Xà lách Romaine giàu Vitamin A, Vitamin K, Vitamin C, Magiê, chất xơ và ít protein. Xà lách Romaine có tác dụng hỗ trợ ', 53700.00, 100, 'https://product.hstatic.net/200000423303/product/xa-lach-romaine_744edd7c02bc4944987ae1d202a9b625_large.jpg'),
(66, 3, 'Bắp cải tím hữu cơ', 'Bắp cải tím: tên khoa học là Brassica oleracea var capitata ruba là cây bắp cải có màu tím. Xuất xứ từ Địa Trung Hải, hiện nay được trồng rộng rãi khắp thế giới, thích hợp với khí hậu ôn đới và tại Việt Nam bắp cải tím được trồng nhiều ở Đà Lạt.• Sở dĩ bắ', 55000.00, 100, 'https://product.hstatic.net/200000423303/product/bap-cai-tim-huu-co_203f203060064cf5a24b9f8e9c352214_large.jpg'),
(67, 3, 'Bắp cải trái tim hữu cơ', '• Bắp cải, Cải bắp - Brassica oleracea L. var. capitata L., là một loại rau chủ lực trong họ Cải - Brassicaceae. Người Pháp gọi nó là Su (Chon) nên từ đó còn có tên là Sú. • Bắp cải là loài rau ôn đới gốc ở Địa Trung Hải được nhập vào trồng ở nước ta. Bắp', 38150.00, 100, 'https://product.hstatic.net/200000423303/product/bap-cai-tim_496c69f52d9348be8a9f11bf64f58ef8_large.jpg'),
(68, 3, 'Bắp cải trắng hữu cơ', '- Trong bữa ăn gia đình, bắp cải được các bà nội trợ biến hóa thành nhiều món ăn ngon. Bắp cải luộc thơm ngọt vị gừng, bắp cải xào cà chua thanh mát, dưa bắp cải muối giòn rụm, chấm cùng nước mắm cay thật ngon miệng. Cầu kỳ hơn, nhiều người còn làm gỏi bắ', 68600.00, 100, 'https://product.hstatic.net/200000423303/product/bap-cai-huu-co_203a09f5391b4cb59bbad82f94c1cd7d_large.jpg'),
(69, 3, 'Bắp ngọt hữu cơ', 'Bắp Ngô Ngọt- Xuất Xứ: Việt Nam- Màu sắc: Vỏ xanh trong màu vàng- Ngô ngọt (hay ngô đường, bắp ngọt, bắp đường) là giống ngô có hàm lượng đường cao, hương vị dân dã, quen thuộc với nhiều người.- Ngô ngọt là kết quả xuất hiện tự nhiên của đặc tính lặn của ', 44000.00, 100, 'https://product.hstatic.net/200000423303/product/ngongot_efdb710405b44b06a1ea02e5db5cf3f9_large.jpg'),
(70, 3, 'Bầu xanh hữu cơ', 'Bầu xanh hữu cơ có vị ngọt, tính lạnh, có tác dụng giải nhiệt, giải độc, lợi tiểu, chữa đái dắt, đái đường. Bầu hữu cơ được trồng theo phương pháp hữu cơ, an toàn và dinh dưỡng cho người sử dụng. Bầu được trồng theo tiêu chuẩn hữu cơ khắt khe, an toàn cho', 60000.00, 100, 'https://product.hstatic.net/200000423303/product/bau-xanh-huu-co_f9e1daaefa2944b7bd8701b11685d4ae_large.jpg'),
(71, 3, 'Bí đao hữu cơ', 'Đặc điểm: Cây bí đao thuộc họ bầu bí nó thích hợp với khí hậu nóng ẩm và có tốc độ phát triển khá nhanh dễ dàng thích ứng với nhiều điều kiện khí hậu thời tiết khác nhau đặc biệt là sức đề kháng khả năng chống chịu sâu bệnh cực tốt. Bởi thế mà khi trồng l', 57500.00, 100, 'https://product.hstatic.net/200000423303/product/bi_dao_huu_co_3ebe99c919104e6bae55cdc2473c318f_large.png'),
(72, 3, 'Bí đỏ hạt đậu hữu cơ', 'Xuất xứ: Việt Nam Thành phần: Bí đỏ nguyên trái Hướng dẫn sử dụng: Dùng để nấu canh, soup, hấp, xào,... Hướng dẫn bảo quản: Bảo quản nơi khô ráo, thoáng mát Bí Hạt Đậu Hữu Cơ Danny Green có hình dáng giống hạt đậu, ít hạt, thịt màu vàng cam, vỏ mỏng mịn đ', 85000.00, 100, 'https://product.hstatic.net/200000423303/product/bi_do_hat_dau_huu_co_b03f29a6449d4e7ebb7951b2e357e565_large.png'),
(73, 3, 'Bí ngòi xanh hữu cơ', 'Bí ngòi xanh là loại trái thuộc họ bầu bí, thân tròn, dài, bên ngoài bí có màu xanh sậm, có ít vân. CÔNG DỤNG Bí ngòi nói chung giúp chữa các bệnh về hô hấp như hen suyễn, giúp tránh nhồi máu cơ tim và đột quỵ, ngăn ngừa cá bệnh về hoại huyết, thâm tím bị', 34500.00, 100, 'https://product.hstatic.net/200000423303/product/bi-ngoi-huu-co_65502365fb8b4a229a16daa8b6630bd6_large.jpg'),
(74, 3, 'Bông cải xanh baby hữu cơ', 'Bông cải xanh hoặc súp lơ xanh, là một loại cây thuộc họ cải, có hoa lớn ở đầu, thường được dùng như rau. Bông cải xanh thường được chế biến bằng cách luộc hoặc hấp, nhưng cũng có thể được ăn sống như là rau sống trong những đĩa đồ nguội khai vị.CÁCH SỬ D', 58500.00, 100, 'https://product.hstatic.net/200000423303/product/bong_cai_xanh_baby_huu_co_e7962ebc7b5c45b686bbbdb1d411c673_large.jpeg'),
(75, 3, 'Bông cải xanh hữu cơ', 'Bông cải xanh hoặc súp lơ xanh, là một loại cây thuộc họ cải, có hoa lớn ở đầu, thường được dùng như rau. Bông cải xanh thường được chế biến bằng cách luộc hoặc hấp, nhưng cũng có thể được ăn sống như là rau sống trong những đĩa đồ nguội khai vị.CÁCH SỬ D', 56700.00, 100, 'https://product.hstatic.net/200000423303/product/bong-cai-xanh-huu-co_9dbd73ab4b3a4e62bf00ddeeb645b9a7_large.jpg'),
(76, 3, 'Cà chua bee ngọt hữu cơ', '• Cà chua bi so cô la có kích thước nhỏ, quả tròn như viên bi, có màu nâu, mọng nước, ăn vào có vị hơi chua.CÔNG DỤNG • Cà chua bi sô cô la có công dụng làm đẹp như: chống lão hóa, làm da mịn màng tươi sáng, bảo vệ bề mặt da .... • Cũng giống như các loại', 56700.00, 100, 'https://product.hstatic.net/200000423303/product/ca-chua-bee-cherry-huu-co_2afe5b08b1f242809cac54171701fff4_large.jpg'),
(77, 3, 'Cà chua bee socola hữu cơ', '• Cà chua bi so cô la có kích thước nhỏ, quả tròn như viên bi, có màu nâu, mọng nước, ăn vào có vị hơi chua.CÔNG DỤNG • Cà chua bi sô cô la có công dụng làm đẹp như: chống lão hóa, làm da mịn màng tươi sáng, bảo vệ bề mặt da .... • Cũng giống như các loại', 56700.00, 100, 'https://product.hstatic.net/200000423303/product/ca-chua-bee-chocolate-huu-co_8ec3455fc8df4335a4eacebd16bcce42_large.jpg'),
(78, 3, 'Cà chua beef hữu cơ', 'Cà chua beef hướng hữu cơ là giống cà chua cao cấp khác hẳn cà chua thông thường ở điểm quả cà chua to, chắc, ít hạt, cơm dày.  Cà chua beef cung cấp một lượng Vitamin A, C, K tuyệt vời. Những chất này có tác dụng giúp tăng cường thị lực, phòng bệnh quáng', 39000.00, 100, 'https://product.hstatic.net/200000423303/product/ca-chua-beef-huu-co_c78e7c53d66b46b288318569f3866694_large.jpg'),
(79, 3, 'Cà rốt baby hữu cơ', '• Cà rốt là loại cây có củ, củ to ở phần đầu và nhọn ở phần đuôi, củ cà rốt thường có màu cam hoặc đỏ, phẩn ăn được thường gọi là củ nhưng thực chất đó là phần rễ của cà rốt.CÔNG DỤNG • Cà rốt chứa rất nhiều vitamin A, B, C đặc biệt là hàm lượng vitamin A', 57000.00, 100, 'https://product.hstatic.net/200000423303/product/ca-rot-baby-huu-co_5e6a67ea790d4023a2a9a3197ad46fc8_large.jpg'),
(80, 3, 'Cà rốt hữu cơ ', 'GIỚI THIỆU SẢN PHẨM • Cà rốt là loại cây có củ, củ to ở phần đầu và nhọn ở phần đuôi, củ cà rốt thường có màu cam hoặc đỏ, phẩn ăn được thường gọi là củ nhưng thực chất đó là phần rễ của cà rốt.CÁCH SỬ DỤNG • Ai cũng biết, cà rốt là loại rau mà có mặt hầu', 40500.00, 100, 'https://product.hstatic.net/200000423303/product/ca-rot-huu-co_051657cb99144443bac8015f6dd34dae_large.jpg'),
(81, 3, 'Cà tím hữu cơ', 'Cà tím là một loài cây thuộc họ cà, màu tím huế, ruột trắng, không xơ, ăn ngon. Cà tím giúp giảm nguy cơ mắc các bệnh tim mạch nhờ tác dụng giống như nhóm statins, giúp phòng ngừa bệnh cao huyết áp cũng như bệnh tiểu đường ở một số người có nguy cơ cao. C', 33000.00, 100, 'https://product.hstatic.net/200000423303/product/ca-tim-huu-co_9d03c19ee8244329b73899813a6bd05a_large.png'),
(82, 3, 'Cải thảo hữu cơ', '• Cải thảo có màu sắc khá giống với cải bắp, phần lá bao ngoài của màu xanh đậm, còn lá cuộn ở bên trong (gọi là lá non) có màu xanh nhạt, trong khi phần cuống lá có màu trắng.  CÔNG DỤNG • Cải thảo có vị ngọt, tính mát, có tác dụng hạ khí, thanh nhiệt nh', 29400.00, 100, 'https://product.hstatic.net/200000423303/product/cai-thao-huu-co_d5a332d40bf843e283c45aae5039351c_large.jpg'),
(83, 3, 'Chanh không hạt', 'Quả chanh không hạt có đường kính khoảng 6 cm, so với chanh ta thì có kích thước lớn hơn, không hạt, cứng hơn, thân cây không có gai, quả tạo thành chùm, vỏ mỏng, nước quả ít chua hơn và không có vị đắng như chanh ta.CÔNG DỤNG1. Nhuận trường, dễ tiêu hóa ', 39000.00, 100, 'https://product.hstatic.net/200000423303/product/cherry1_9cd5b471f2664df9929386643908e8ef_large.jpeg'),
(84, 3, 'Củ cải đỏ hữu cơ', 'Củ cải đỏ hay còn được gọi là củ cải đường là loại rau củ có quan hệ gần gũi với củ dền. Củ cải đỏ có hình dạng tròn, kích thước nhỏ, có lớp vỏ mỏng màu đỏ bao bọc phần thịt trắng bên trong. Củ cải đỏ là một trong những loại rau củ có chất kháng viêm cao ', 43750.00, 100, 'https://product.hstatic.net/200000423303/product/cu-cai-duong-huu-co_5734dac5ba674eb2b32d1b3071792c4b_large.jpg'),
(85, 3, 'Củ cải trắng hữu cơ ', '• Củ trắng thuộc họ củ cải, thân tròn dài và to, chứa nhiều nước. Củ cải trắng là một trong những loại củ hỗ trợ điều trị tiểu đường rất hiệu quả. CÔNG DỤNG • Củ cải trắng giúp chữa được rất nhiều bệnh, được lưu truyền rộng rãi trong dân gian. Một số bệnh', 44800.00, 100, 'https://product.hstatic.net/200000423303/product/cu-cai-huu-co_6ada47cdc7f842f9a99f7541cf6742a7_large.jpg'),
(86, 3, 'Củ dền hữu cơ ', '• Có rễ phồng thành củ nạc, ngọt, màu đỏ thẫm. Thân đứng có vằn, ít phân nhánh. Lá có phiến hình trứng, màu lục, có mép lượn sóng. Hoa màu lục nhạt, mọc thành bông khá dài.CÁCH SỬ DỤNG • Củ dền cũng được sử dụng như các loại củ khác để xào hoặc nấu canh. ', 99000.00, 100, 'https://product.hstatic.net/200000423303/product/cu-den-huu-co_5b7a9b55f9674d91bba675d05f47acb1_large.jpg'),
(87, 3, 'Đậu bắp hữu cơ', 'Đậu bắp còn có nhiều tên gọi khác như mướp tây, bông vàng, bắp chà hay thảo cà phê, okra (Anh), có tên khoa học cũ gọi là Hibicus enculentus L. (Albelmoschus enculentus Wight et Arn) thuộc họ Đông (Malvaceae). Là loại cây có nguồn gốc từ Tây Phi, có khả n', 38000.00, 100, 'https://product.hstatic.net/200000423303/product/dau-bap-huu-co_e059bcf650af44dbb4c1e044d34b419d_large.jpg'),
(88, 3, 'Đậu cove hữu cơ', '• Đậu cove thuộc họ đâu, có thân nhỏ tròn và dài như chiếc đũa, đậu có màu xanh nhạt khi còn non và xanh lục khi chín.CÔNG DỤNG • Loại đậu này tính ôn, có tác dụng nhuận tràng, bồi bổ nguyên khí. Đậu cô ve không chỉ có chứa nhiều nguyên tố vi lượng như pr', 37500.00, 100, 'https://product.hstatic.net/200000423303/product/dau-cove-huu-co_ad40962f4583495398654ddbef3e9504_large.jpg'),
(89, 3, 'Đậu nành slb đông lạn', 'Giàu chất xơ, rất tốt cho hệ tiêu hóa, phù hợp với người mắc chứng khó tiêu, đầy hơiNguồn protein chất lượng, cung cấp hầu hết các axit amin thiết yếu, tác động tích cực tới hệ tim mạch', 95000.00, 100, 'https://product.hstatic.net/200000423303/product/dau_nanh_slb_dong_lanh_500g_653aba15aa26484cabb5120e014d310b_large.jpg'),
(90, 3, 'Dưa leo hữu cơ', 'Dưa leo hữu cơ được trồng và chăm sóc theo phương pháp hữu cơ, là sự lựa chọn hoàn hảo cho những ai đang tìm kiếm sự tươi ngon và an toàn cho sức khỏe của mình. Với tiêu chuẩn nghiêm ngặt và quy trình sản xuất cẩn thận, dưa leo hữu cơ của chúng tôi đảm bả', 64500.00, 100, 'https://product.hstatic.net/200000423303/product/dua-leo-huu-co_6d5ca8015aea4e86bffbeb58e2a431fd_large.jpg'),
(91, 3, 'Gừng già hữu cơ ', 'Ăn gừng thường xuyên phòng chữa sỏi mật Sử dụng gừng thường xuyên rất có lợi cho việc phòng, chữa sỏi mật. Sỏi mật hiện nay thường được điều trị bằng phẫu thuật và chưa có một thuốc đặc trị nào có hiệu quả. Nghiên cứu mới đây của các nhà khoa học Nhật Bản', 19000.00, 100, 'https://product.hstatic.net/200000423303/product/gung-huu-co_607c3c7e7e294cb49bf3dcfb2c0ad705_large.jpg'),
(92, 3, 'Hành tây hữu cơ baby', 'Hành tây là thực phẩm thông dụng trong bữa ăn của người Việt. Nó là một loại cây thảo, có tên khoa học là Allium cepa, thuộc họ hành (Alliaceae). Hành tây có hương vị cay nồng. Hành rất giàu vitamin A, B, C và là một nguồn tiềm năng của acid folic, canxi,', 57500.00, 100, 'https://product.hstatic.net/200000423303/product/hanh-tay-baby-huu-co_fcd7cf2b5e7d4ef0b4b1e4d14c5267e1_large.png'),
(93, 5, 'Khổ qua hữu cơ', 'Trên lâm sàng, khổ qua thường dùng chữa các chứng do bệnh nhiệt gây thử nhiệt phiền khát, trúng thử (say nóng), ung sưng, mắt đỏ đau nhức, kiết lỵ, viêm quầng, nhọt độc, tiểu ít…Khổ qua (mướp đắng) – Momordia charantia L. thuộc họ Hồ lô (Cucurbitaceae). V', 45000.00, 100, 'https://product.hstatic.net/200000423303/product/kho-qua-huu-co_6465f3e31e9e4c9c97fbb803604bf6c7_large.jpg'),
(94, 5, 'Khoai lang Lệ Cần hữu cơ', 'Khoai lang Lệ Cầnlà một đặc sản Gia Lai.Khoai đặc sản được trồng trên đất Lệ Cần thuộc xã Tân Bình, huyện Đak Đoa(được bảo hộ chỉ dẫn địa lý). Loại khoai lang ngon đặc biệt bời mùi thơm lạ đặc trưng, bở, ruột nghệ, ngọt lịm của mảnh đất Bazan màu mỡ có hà', 42500.00, 100, 'https://product.hstatic.net/200000423303/product/khoai-lang-huu-co_ef58ccf99007482181f157921d4b1014_large.jpg');
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url`) VALUES
(104, 2, 'Cam vàng úc', 'qewqeqqqqq', 100000.00, 1222, 'https://res.cloudinary.com/dfryedaps/image/upload/v1750215224/om07ksrpa6r3dbafzzsb.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `date`) VALUES
(2, 2, 3, 5, 'aadasdas', '2025-06-16 18:02:20'),
(3, 27, 3, 4, 'sdsdsd', '2025-06-16 11:29:24'),
(4, 27, 3, 4, 'sdsdsd', '2025-06-16 11:34:03'),
(5, 12, 3, 3, '12344', '2025-06-16 11:34:14'),
(6, 27, 3, 5, 'dsdsdsdsdsd', '2025-06-16 11:36:19'),
(7, 12, 3, 3, '', '2025-06-16 11:36:36'),
(8, 73, 3, 4, 'ăn rất ngon miệng', '2025-06-16 13:15:04'),
(9, 72, 3, 1, 'bị hư', '2025-06-16 13:15:16'),
(12, 91, 3, 3, 'tốt', '2025-06-16 16:31:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  `role` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `password`, `email`, `fullname`, `address`, `phonenumber`, `role`) VALUES
(1, '$2a$10$MrEwmV4.LQXm5uX0GQvmhuN1thoPybAzZ5fymGIt9ge9mITCVFgfO', 'admin@example.com', 'Admin User', '123 Admin St', '0123456789', 1),
(2, '$2a$10$6U80w8gseDjlE2Xo7T1Kfe1gx9FTVSr368Fl5VU6BUgbtTq8T7b/q', 'user@example.com', 'Regular User', '456 User Rd', '0987654321', 1),
(3, '$2a$10$SwFlYb9y5qXg5Kq.OdBhIuy9fY.1QEKJHE37eCBDvV0t.ojwtD67i', 'trungnguyen020103@gmail.com', 'Nguyen Van A', '123 Le Loi, Quan 1, TP.HCM', '0374929393', 0),
(6, '$2a$10$hwD0D8aEajacc4qxwlq5ReVuPU/tPhs9BbfTd9tcWHDkeyqXKvpQ6', 'trung123@example.com', 'Nguyen Van A', '123 Le Loi, Quan 1, TP.HCM', '0987654321', 1),
(8, 'GoogleLogin@123', 'quoctrung020103@gmail.com', 'Trung Nguyễn', NULL, NULL, 1),
(9, '$2a$10$Sfsby6N6POH1BpK68uRHauP/ZrwmY9W/lKkhE7Oi1RR/SVkcnq13e', 'abcdd@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung ABC Hồ Chí Minh', '0364758287', 1),
(10, '$2a$10$WgzLGNe69SauoSEx7AE5puGERg3DSX9lxYdXASiOjqRuV1knqewM6', 'abcd@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung Thủ Đuck Hồ CHí Minh', '0364758295', 1),
(15, '$2a$10$8rR23RYyRbbE76/mBnj3OuHZEwxXF6YK9FWhen8rkIN2nzkBEXtBu', 'trungnguyen0201030405@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung Thủ Đuck Hồ CHí Minh', '0364758295', 1),
(16, '$2a$10$biXkryvk0evyc8ZqIiHtMe0Sx05DWmgy8adAqPtPtte8k3GJGpjH2', 'abcdgg@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung ABC Hồ Chí Minh', '0363879580', 1),
(20, '$2a$10$cxU2oMI9jiIQRq0gGGal1eD9TFjbXiQ2UkNxGLCGh.jWehNS2kiwC', 'abcsdasda@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung ABC Hồ Chí Minh', '0363879582', 1),
(22, '$2a$10$bF3MdUpmMLpv8Obp5HDJWu5ohdxlatr9IrwSftrNBjOOQcANLYKyy', 'asssbc@gmail.com', 'Nguyễn Quốc Trung', '106 Hoàng Diệu 2 Quận Thủ Đức TP Hồ Chí Minh', '0363879580', 1),
(23, '$2a$10$JqWbcaqdiQ10UhhYDel4Vepjst5odtpuBYrg71Foti9PYWDLVCN9W', 'anccczc@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung ABC Hồ Chí Minh', '0364758295', 1),
(24, '$2a$10$3.WbtbQf60RTu.VTyZvOv.gIx23gBMSqfD7shOlJNUlm6PIBAIkla', 'abcdaaa@gmail.com', 'Nguyen Van A', '161/12 Quang Trung Thủ Đuck Hồ CHí Minh', '0123456783', 1),
(28, '$2a$10$6w6Xk8Ls1nZa0Z84cEAamuNQ/llKNs6QfYb/EZ4dPeYjmP.kRtUcK', 'trungnguyen020103121@gmail.com', 'Nguyễn Quốc Trung', '161/12 Quang Trung Thủ Đuck Hồ CHí Minh', '0363879585', 1),
(33, '$2a$10$3yIAvweS0/.SiCc.Bg/DZumS4753wW.j5s5phKRVX3ZcJueYR73Ey', 'abcaaaa@gmail.com', 'Nguyễn Quốc Trung', '106 Hoàng Diệu 2 Quận Thủ Đức TP Hồ Chí Minh', '0363879581', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`code`);

--
-- Chỉ mục cho bảng `email_verification`
--
ALTER TABLE `email_verification`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_orderdetails_orderid` (`orderid`),
  ADD KEY `fk_orderdetails_productid` (`productid`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_orders_userid` (`userid`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `email_verification`
--
ALTER TABLE `email_verification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `fk_orderdetails_orderid` FOREIGN KEY (`orderid`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderdetails_productid` FOREIGN KEY (`productid`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
