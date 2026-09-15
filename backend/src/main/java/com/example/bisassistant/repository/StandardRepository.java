package com.example.bisassistant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bisassistant.entity.Standard;

public interface StandardRepository extends JpaRepository<Standard, Integer> {

    Standard findByIsNumber(String isNumber);

}