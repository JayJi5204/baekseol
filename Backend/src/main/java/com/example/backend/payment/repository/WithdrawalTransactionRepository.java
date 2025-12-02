package com.example.backend.payment.repository;

import com.example.backend.payment.entity.WithdrawalTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalTransactionRepository extends JpaRepository<WithdrawalTransaction, Long> {
}
