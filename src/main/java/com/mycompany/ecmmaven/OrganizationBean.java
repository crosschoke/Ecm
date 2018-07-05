/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import static com.mycompany.ecmmaven.HibernateUtil.getEm;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.Query;

/**
 *
 * @author Admin
 */
@Stateless
public class OrganizationBean {
    
    private EntityManager em;
    
    public List<Organization> getAll() {
        em = getEm();
        Query query = em.createQuery("SELECT e FROM Organization e");
        return (List<Organization>) query.getResultList();
    }
    
    public String add(String name, String physicalAddress, String juridicalAddress, String headFullname) {
        
        Organization organization = create(name, physicalAddress, juridicalAddress, headFullname);
        
        if(organization.getPersistStatus().equals("OK")) {
            //em = getEm();
            try {
               em.getTransaction().begin();
               em.persist(organization);
               em.getTransaction().commit();
            }
            catch(Exception ex) {
               return "Error";
            }
            return "OK";
        }
        else {
            return organization.getPersistStatus();
        }
    }
    
    public Organization create(String name, String physicalAddress, String juridicalAddress, String head) {
        em = getEm();
        
        String[] headFullname = head.split(" ");
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        query.setParameter("surname", headFullname[0]);
        query.setParameter("name", headFullname[1]);
        query.setParameter("patronymic", headFullname[2]);
        
        Employer headObject;
        
        try {
            headObject = (Employer)query.getSingleResult();
        }
        catch(Exception ex){
            return new Organization("Head doesn't exist");
        }
        
        Organization organization = new Organization(name, physicalAddress, juridicalAddress, headObject, "OK");
        
        return organization;
    }
    
    public String edit(Organization oldOrganization, Organization newOrganization) {
        
        em = getEm();
        Query query = em.createQuery("Select e FROM Organization e WHERE e.name = :name");
        query.setParameter("name", oldOrganization.getName());

        Organization result = (Organization)query.getSingleResult();
        
        if(result != null) {

            em.getTransaction().begin();
            
            result.setName(newOrganization.getName());
            result.setPhysicalAddress(newOrganization.getPhysicalAddress());
            result.setJuridicalAddress(newOrganization.getJuridicalAddress());
            result.setHead(newOrganization.getHead());
            
            em.getTransaction().commit();
            
            return "OK";
        }
        
        else
            return "Error";
        
    }
    
    public String delete(String name) {
        em = getEm();

        Query query = em.createQuery("Select e FROM Organization e WHERE e.name = :name");
        query.setParameter("name", name);

        
        Organization result;
        
        try {
            result = (Organization)query.getSingleResult();
        }
        catch(Exception ex){
            return ex.getMessage();
        }
        
        em.getTransaction().begin();
        em.remove(result);
        em.getTransaction().commit();  
        
        return "OK";
    }
    
}
