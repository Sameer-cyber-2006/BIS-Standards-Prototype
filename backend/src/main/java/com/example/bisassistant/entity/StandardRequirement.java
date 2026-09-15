package com.example.bisassistant.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "standard_requirements")
public class StandardRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sid", nullable = false)
    private Integer sid;

    @Column(name = "requirement_type", nullable = false)
    private String requirementType;

    @Column(name = "requirement_name", nullable = false)
    private String requirementName;

    @Column(name = "requirement_value")
    private String requirementValue;

    @Column(name = "unit")
    private String unit;

    public StandardRequirement() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getSid() {
        return sid;
    }

    public String getRequirementType() {
        return requirementType;
    }

    public String getRequirementName() {
        return requirementName;
    }

    public String getRequirementValue() {
        return requirementValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setSid(Integer sid) {
        this.sid = sid;
    }

    public void setRequirementType(String requirementType) {
        this.requirementType = requirementType;
    }

    public void setRequirementName(String requirementName) {
        this.requirementName = requirementName;
    }

    public void setRequirementValue(String requirementValue) {
        this.requirementValue = requirementValue;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}