package com.example.bisassistant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bisassistant.entity.StandardRequirement;

public interface StandardRequirementRepository
        extends JpaRepository<StandardRequirement, Integer> {

    List<StandardRequirement> findBySid(Integer sid);

}