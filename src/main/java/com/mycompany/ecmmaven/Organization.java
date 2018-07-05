/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 *
 * @author Admin
 */
@Entity
@Table(name = "organizations")
public class Organization implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "physicalAddress", nullable = false)
    private String physicalAddress;
    
    @Column(name = "juridicalAddress", nullable = false)
    private String juridicalAddress;
    
    @ManyToOne
    @JoinColumn(name = "head", nullable = false)
    private Employer head;
    
    
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Unit> units = new HashSet<Unit>();
    
    String persistStatus;
    
    public Organization() {
    }
    
    public Organization(String persistStatus) {
        this.persistStatus = persistStatus;
    }
    
    public Organization(String name, String physicalAddress, String juridicalAddress, Employer head, String persistStatus){
        this.name = name;
        this.physicalAddress = physicalAddress;
        this.juridicalAddress = juridicalAddress;
        this.head = head;
        this.persistStatus = persistStatus;
    }
    
    public String getPersistStatus() {
        return persistStatus;
    }
    
    public void setPersistStatus(String persistStatus) {
        this.persistStatus = persistStatus;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhysicalAddress() {
        return physicalAddress;
    }
    
    public void setPhysicalAddress(String physicalAddress) {
        this.physicalAddress = physicalAddress;
    }
    
    public String getJuridicalAddress() {
        return juridicalAddress;
    }
    
    public void setJuridicalAddress(String juridicalAddress) {
        this.juridicalAddress = juridicalAddress;
    }
    
    public Employer getHead() {
        return head;
    }
    
    public void setHead(Employer head) {
        this.head = head;
    }
    
  
    public void addUnit(Unit unit) {
        units.add(unit);
        unit.setOrganization(this);
    }
 
    public void removeUnit(Unit unit) {
        units.remove(unit);
        //employer.getExecutorAssignments().remove(this);
    }
    
    public Set<Unit> getUnits() {
        return units;
    }
 
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Organization)) return false;
        return id != null && id.equals(((Organization) o).id);
    }
 
    @Override
    public int hashCode() {
        return 32;
    }
}
