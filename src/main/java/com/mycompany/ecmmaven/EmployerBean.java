/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;
//import static com.mycompany.ecmmaven.HibernateUtil1.getEm;


import static com.mycompany.ecmmaven.HibernateUtil.getEm;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;

import javax.persistence.Query;

/**
 *
 * @author Admin
 */
@Stateless
public class EmployerBean {
    
    private EntityManager em;
    
    public String add(Employer employer) {
        
        em = getEm();
        
        try {
            em.getTransaction().begin();
            em.persist(employer);
            em.getTransaction().commit();
        }
        catch(Exception ex) {
            return ex.getMessage();
        }
        
        return "OK";
        
    }
    
    public String delete(Employer employer) {
        
        em = getEm();

        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        query.setParameter("surname", employer.getSurname());
        query.setParameter("name", employer.getName());
        query.setParameter("patronymic", employer.getPatronymic());
        
        Employer result;
        
        try {
            result = (Employer)query.getSingleResult();
        }
        catch(Exception ex){
            return ex.getMessage();
        }
        
        em.getTransaction().begin();
        em.remove(result);
        em.getTransaction().commit();  
        
        return "OK";
    }
    
    public String edit(Employer oldEmployer, Employer newEmployer) {
        
        em = getEm();
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        query.setParameter("surname", oldEmployer.getSurname());
        query.setParameter("name", oldEmployer.getName());
        query.setParameter("patronymic", oldEmployer.getPatronymic());

        Employer result = (Employer)query.getSingleResult();
        
        if(result != null) {
            em.getTransaction().begin();
            result.setName(newEmployer.getName());
            result.setSurname(newEmployer.getSurname());
            result.setPatronymic(newEmployer.getPatronymic());
            result.setPost(newEmployer.getPost());
            em.getTransaction().commit();
            
            return "OK";
        }
        
        else
            return "Error";
        
    }
    
    public List<Employer> getAll() {
        
        em = getEm();
        Query query = em.createQuery("SELECT e FROM Employer e");
        return (List<Employer>) query.getResultList();
        
    }
}
