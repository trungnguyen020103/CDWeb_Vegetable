package com.example.demo.controller;

import com.example.demo.config.VNPayConfig;
import com.example.demo.model.Order;
import com.example.demo.service.I18nService;
import com.example.demo.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment/vnpay")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private I18nService i18nService;

    @Autowired
    private VNPayConfig vnpayConfig;

    @PostMapping("/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestBody Order order,
            @RequestParam Long userId,
            Locale locale) {
        logger.info("Received request to create VNPay payment for userId: {}", userId);
        try {
            logger.debug("Order details: {}", order);
            // Lưu đơn hàng trước khi tạo URL thanh toán
            Order savedOrder = orderService.addOrder(order, userId);
            logger.info("Order saved with ID: {}", savedOrder.getId());

            // Tạo tham số thanh toán VNPay
            String vnpOrderInfo = "Thanh toan don hang #" + savedOrder.getId();
            String vnpTxnRef = String.valueOf(savedOrder.getId());
            String vnpCreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String vnpAmount = String.valueOf((long) (savedOrder.getTotal() * 100)); // VNPay yêu cầu số tiền * 100
            String vnpIpAddr = "127.0.0.1"; // Có thể thay bằng logic lấy IP thực tế nếu cần

            // Tạo map chứa các tham số
            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", VNPayConfig.VNP_VERSION);
            vnpParams.put("vnp_Command", VNPayConfig.VNP_COMMAND);
            vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
            vnpParams.put("vnp_Amount", vnpAmount);
            vnpParams.put("vnp_CurrCode", VNPayConfig.VNP_CURRENCY_CODE);
            vnpParams.put("vnp_TxnRef", vnpTxnRef);
            vnpParams.put("vnp_OrderInfo", vnpOrderInfo);
            vnpParams.put("vnp_OrderType", VNPayConfig.VNP_ORDER_TYPE);
            vnpParams.put("vnp_Locale", VNPayConfig.VNP_LOCALE);
            vnpParams.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            vnpParams.put("vnp_IpAddr", vnpIpAddr);
            vnpParams.put("vnp_CreateDate", vnpCreateDate);

            // Tạo chuỗi hash và query string
            StringBuilder hashData = new StringBuilder();
            StringBuilder queryString = new StringBuilder();
            for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                if (value != null && !value.isEmpty()) { // Chỉ thêm tham số có giá trị
                    String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8.toString());
                    String encodedValue = URLEncoder.encode(value, StandardCharsets.UTF_8.toString());

                    // Tạo chuỗi hash với giá trị đã mã hóa URL
                    hashData.append(key).append("=").append(encodedValue).append("&");
                    // Tạo query string
                    if (queryString.length() > 0) queryString.append("&");
                    queryString.append(encodedKey).append("=").append(encodedValue);
                }
            }

            // Tạo secure hash
            String hashInput = hashData.substring(0, hashData.length() - 1); // Bỏ "&" cuối cùng
            logger.debug("Hash input for vnp_SecureHash: {}", hashInput);
            logger.debug("Using vnp_HashSecret: {}", vnpayConfig.getHashSecret());
            String vnpSecureHash = hmacSHA512(vnpayConfig.getHashSecret(), hashInput);
            queryString.append("&vnp_SecureHash=").append(vnpSecureHash);

            // Tạo URL thanh toán
            String paymentUrl = vnpayConfig.getPaymentUrl() + "?" + queryString.toString();
            logger.info("Generated VNPay payment URL: {}", paymentUrl);

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating VNPay payment URL for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", i18nService.getMessage("payment.create.failed", locale)));
        }
    }

    @GetMapping("/return")
    public ResponseEntity<Void> paymentReturn(@RequestParam Map<String, String> vnpParams, Locale locale) throws UnsupportedEncodingException {
        logger.info("Received VNPay return callback with params: {}", vnpParams);
        try {
            String vnpSecureHash = vnpParams.get("vnp_SecureHash");
            if (vnpSecureHash != null) {
                vnpParams.remove("vnp_SecureHash");
            }

            String vnpSecureHashType = vnpParams.get("vnp_SecureHashType");
            if (vnpSecureHashType != null) {
                vnpParams.remove("vnp_SecureHashType");
            }

            // Tạo chuỗi hash để kiểm tra
            StringBuilder hashData = new StringBuilder();
            TreeMap<String, String> sortedParams = new TreeMap<>(vnpParams);
            for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
                if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                    hashData.append(entry.getKey()).append("=")
                            .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8)).append("&");
                }
            }

            String calculatedHash = "";
            if (hashData.length() > 0) {
                calculatedHash = hmacSHA512(vnpayConfig.getHashSecret(), hashData.substring(0, hashData.length() - 1));
            }

            String vnpResponseCode = vnpParams.get("vnp_ResponseCode");
            Integer orderId = Integer.parseInt(vnpParams.get("vnp_TxnRef"));

            if ((vnpSecureHash == null || calculatedHash.equals(vnpSecureHash)) && "00".equals(vnpResponseCode)) {
                // Thanh toán thành công
                orderService.updateOrderStatus(orderId, "0");
                logger.info("Payment successful for orderId: {}", orderId);
            } else {
                // Thanh toán thất bại
                orderService.updateOrderStatus(orderId, "FAILED");
                logger.warn("Payment failed for orderId: {}, responseCode: {}", orderId, vnpResponseCode);
            }

            // Chuyển hướng đến trang kết quả thanh toán trên frontend
            String frontendUrl = vnpayConfig.getFrontendResultUrl();
            String queryString = buildQueryString(vnpParams);
            String redirectUrl = frontendUrl + "?" + queryString;

            logger.info("Redirecting to frontend payment result page: {}", redirectUrl);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        } catch (Exception e) {
            logger.error("Error processing VNPay return callback: {}", vnpParams, e);
            String frontendUrl = vnpayConfig.getFrontendResultUrl();
            String redirectUrl = frontendUrl + "?error=" + URLEncoder.encode("Lỗi xử lý kết quả thanh toán", StandardCharsets.UTF_8.toString());

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        }
    }

    private String buildQueryString(Map<String, String> params) {
        StringBuilder queryString = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                try {
                    if (queryString.length() > 0) queryString.append("&");
                    queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()))
                            .append("=")
                            .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                } catch (Exception e) {
                    logger.error("Error encoding query param: {}", entry.getKey(), e);
                }
            }
        }
        return queryString.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hmacData) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo hash", e);
        }
    }
}
