/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import java.io.Serializable;
import static java.lang.Math.toIntExact;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author Admin
 */
@Entity
@Table(name = "units")
public class Unit implements Serializable{
    
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "contactDetails")
    private String contactDetails;
    
    @ManyToOne
    @JoinColumn(name = "unitHead", nullable = false)
    private Employer unitHead;
   
    
    @ManyToOne
    @JoinColumn(name = "organization", nullable = false)
    private Organization organization;

    String persistStatus;
    
    
    public Unit() {
    }
    
    public Unit(String persistStatus) {
        this.persistStatus = persistStatus;
    }
    
    public Unit(String name, String contactDetails, Employer head, Organization organization, String persistStatus) {
        this.name = name;
        this.contactDetails = contactDetails;
        this.unitHead = head;
        this.organization = organization;
        this.persistStatus = persistStatus;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getContactDetails() {
        return contactDetails;
    }
    
    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }
    
    public Employer getUnitHead() {
        return unitHead;
    }
    
    public void setUnitHead(Employer unitHead) {
        this.unitHead = unitHead;
    }
  
    public Organization getOrganization() {
        return organization;
    }
    
    public void setOrganization(Organization organization) {
        this.organization = organization;
    }
    
    public String getPersistStatus() {
        return persistStatus;
    }
    
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
 
        Unit that = (Unit) o;
        if (id != that.id) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        return true;
    }
    
    @Override
    public int hashCode() {
        int result = toIntExact(id);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }
}
