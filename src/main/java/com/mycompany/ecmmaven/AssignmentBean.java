/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import static com.mycompany.ecmmaven.HibernateUtil.getEm;
import java.util.ArrayList;
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
public class AssignmentBean {
    private EntityManager em;// = getEm();
    
    public String add(String subject, String author, String text, boolean controlAttribute, java.sql.Date executionDate,
            ExecutionAttributeEnum executionAttribute, String[] executors){
        
        Assignment assignment = create(subject, author, text, controlAttribute, executionDate, executionAttribute, executors);
        
        if(assignment.getPesistStatus().equals("OK")) {
            //em = getEm();
            try {
               em.getTransaction().begin();
               em.persist(assignment);
               em.getTransaction().commit();
            }
            catch(Exception ex) {
               return "Error";
            }
            return "OK";
        }
        else {
            return assignment.getPesistStatus();
        }
        
    }
    
    public Assignment create(String subject, String author, String text, boolean controlAttribute, java.sql.Date executionDate,
            ExecutionAttributeEnum executionAttribute, String[] executors) {
        em = getEm();
        String[] authorFullname = author.split(" ");
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        query.setParameter("surname", authorFullname[0]);
        query.setParameter("name", authorFullname[1]);
        query.setParameter("patronymic", authorFullname[2]);
        
        Employer authorObject;
        
        try {
            authorObject = (Employer)query.getSingleResult();
        }
        catch(Exception ex){
            return new Assignment("Author doesn't exist");
        }
        
        Set<Employer> executorsSet = new HashSet<>();
        
        for (String executor : executors) {
            String[] executorFullname = executor.split(" ");
            
            query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
            query.setParameter("surname", executorFullname[0]);
            query.setParameter("name", executorFullname[1]);
            query.setParameter("patronymic", executorFullname[2]);
            
            Employer executorObject;
            
            try {
                executorObject = (Employer)query.getSingleResult();
            }
            catch(Exception ex) {
                return new Assignment("Executor doesn't exist");
            }
            
            executorsSet.add(executorObject);
        }
        
        Assignment assignment = new Assignment(subject, authorObject, text, controlAttribute, executionDate, executionAttribute, executorsSet, "OK");
        /*
        try {
            em.getTransaction().begin();
            em.persist(assignment);
            em.getTransaction().commit();
        }
        */
        
        return assignment;
    }
    
    public List<Assignment> getAll() {
        em = getEm();
        Query query = em.createQuery("SELECT e FROM Assignment e");
        return (List<Assignment>) query.getResultList();
    }
    
    public String edit(Assignment oldAssignment, Assignment newAssignment) {
        
        em = getEm();
        Query query = em.createQuery("Select e FROM Assignment e WHERE e.subject = :subject and e.author = :author");
        query.setParameter("subject", oldAssignment.getSubject());
        query.setParameter("author", oldAssignment.getAuthor());

        Assignment result = (Assignment)query.getSingleResult();
        
        if(result != null) {
            
            Iterator<Employer> iter = newAssignment.getExecutors().iterator();
            
            Set<Employer> totalEmployers = new HashSet();
            
            while(iter.hasNext()) {
                
                Employer tmp = iter.next();
                
                query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
                
                query.setParameter("surname", tmp.getSurname());
                query.setParameter("name", tmp.getName());
                query.setParameter("patronymic", tmp.getPatronymic());
        
                totalEmployers.add((Employer)query.getSingleResult());
            }
            
            em.getTransaction().begin();
            
            result.setSubject(newAssignment.getSubject());
            result.setAuthor(newAssignment.getAuthor());
            result.setText(newAssignment.getText());
            result.setControlAttribute(newAssignment.getControlAttribute());
            result.setExecutionDate(newAssignment.getExecutionDate());
            result.setExecutionAttribute(newAssignment.getExecutionAttribute());
            //result.setExecutors(newAssignment.getExecutors());
            
            iter = result.getExecutors().iterator();
            while(iter.hasNext()) {
                 result.removeExecutor(iter.next());
            }
            
            iter = totalEmployers.iterator();
            while(iter.hasNext()) {
                 result.addExecutor(iter.next());
            }
            
            em.getTransaction().commit();
            
            return "OK";
        }
        
        else
            return "Error";
    }
    
    public String getAssignmentText(String subject, String author) {
        em = getEm();
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        
        String[] fullname = author.split(" ");
        
        query.setParameter("surname", fullname[0]);
        query.setParameter("name", fullname[1]);
        query.setParameter("patronymic", fullname[2]);
        
        Employer authorObject = (Employer)query.getSingleResult();
        
        query = em.createQuery("Select e FROM Assignment e WHERE e.subject = :subject and e.author = :author");
        query.setParameter("subject", subject);
        query.setParameter("author", authorObject);
        
        Assignment assignment = (Assignment)query.getSingleResult();
        
        return assignment.getText();

    }
    
    public String delete(String subject, String author) {
        em = getEm();
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        
        String[] fullname = author.split(" ");
        
        query.setParameter("surname", fullname[0]);
        query.setParameter("name", fullname[1]);
        query.setParameter("patronymic", fullname[2]);
        
        Employer authorObject = (Employer)query.getSingleResult();
        
        query = em.createQuery("Select e FROM Assignment e WHERE e.subject = :subject and e.author = :author");
        query.setParameter("subject", subject);
        query.setParameter("author", authorObject);
        
        Assignment assignment = (Assignment)query.getSingleResult();
        
        em.getTransaction().begin();
        em.remove(assignment);
        em.getTransaction().commit();  
        
        return "OK";
    }
    
    public List<Assignment> getMyAssignments(String surname, String name, String patronymic) {
        em = getEm();
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        
        query.setParameter("surname", surname);
        query.setParameter("name", name);
        query.setParameter("patronymic", patronymic);
        
        Employer employer;
        
        try{
            employer = (Employer)query.getSingleResult();
        }
        catch(Exception ex) {
            return null;
        }

        query = em.createQuery("Select e FROM Assignment e WHERE e.author = :author");
        query.setParameter("author", employer);
        
        return (List<Assignment>) query.getResultList();
        
    }
    
    public List<Assignment> getAssignmentsForMe(String surname, String name, String patronymic) {
        em = getEm();
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        
        query.setParameter("surname", surname);
        query.setParameter("name", name);
        query.setParameter("patronymic", patronymic);
        
        Employer employer;
        
        try{
            employer = (Employer)query.getSingleResult();
        }
        catch(Exception ex) {
            return null;
        }

        query = em.createQuery("Select e FROM Assignment e WHERE :employer MEMBER OF e.executors");
        query.setParameter("employer", employer);
        
        
        return (List<Assignment>) query.getResultList();
    }
    
    
}
