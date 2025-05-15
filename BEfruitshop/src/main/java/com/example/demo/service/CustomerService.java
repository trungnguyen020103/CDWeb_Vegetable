package com.example.demo.service;


import com.example.demo.model.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Lấy tất cả khách hàng
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Lấy khách hàng theo ID
    public Customer getCustomerById(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        return customer.orElse(null);  // Trả về null nếu không tìm thấy
    }

    // Lấy khách hàng theo email
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
}
