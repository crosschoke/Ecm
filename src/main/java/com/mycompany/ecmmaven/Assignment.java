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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author Admin
 */
@Entity
@Table(name = "assignments")
public class Assignment implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name= "subject", nullable = false)
    private String subject;

    //@Column(name= "author", nullable = false)
    //private String author;
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Employer author;
    
    
    
    @ManyToMany(cascade = { 
        CascadeType.PERSIST, 
        CascadeType.MERGE
    })
    
    //@ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "assignment_employer",
            joinColumns = @JoinColumn(name = "assignment_id"),
            inverseJoinColumns = @JoinColumn(name = "employer_id"))
    
    private Set<Employer> executors = new HashSet<>();
   
    @Column(name= "executionDate", nullable = false)
    private java.sql.Date executionDate;
    
    @Column(name= "controlAttribute", nullable = false)
    private boolean controlAttribute;
    
    @Enumerated(EnumType.STRING)
    @Column(name= "executionAttribute", nullable = false)
    private ExecutionAttributeEnum executionAttribute;
    
    //@Lob
    @Column(name= "text", nullable = false)
    private String text;
    
    private String persistStatus;
    
    public Assignment() {
    }
    
    public Assignment(String status) {
        persistStatus = status;
    }
    
    public Assignment(String subject, Employer author, String text, boolean controlAttribute, java.sql.Date executionDate,
            ExecutionAttributeEnum executionAttribute, Set<Employer> executors) {
        
        this.subject = subject;
        this.author = author;
        this.text = text;
        this.controlAttribute = controlAttribute;
        this.executionDate = executionDate;
        this.executionAttribute = executionAttribute;
        this.executors = executors;
    }
    
    public Assignment(String subject, Employer author, String text, boolean controlAttribute, java.sql.Date executionDate,
            ExecutionAttributeEnum executionAttribute, Set<Employer> executors, String status) {
        
        this.subject = subject;
        this.author = author;
        this.text = text;
        this.controlAttribute = controlAttribute;
        this.executionDate = executionDate;
        this.executionAttribute = executionAttribute;
        this.executors = executors;
        this.persistStatus = status;
    }
    
    public void addExecutor(Employer employer) {
        executors.add(employer);
        employer.getExecutorAssignments().add(this);
    }
 
    public void removeExecutor(Employer employer) {
        executors.remove(employer);
        employer.getExecutorAssignments().remove(this);
    }
    
    
    
    public void setPersistStatus(String status) {
        persistStatus = status;
    }
    
    public String getPesistStatus() {
        return persistStatus;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setAuthor(Employer author) {
        this.author = author;
    }
    
    public Employer getAuthor() {
        return author;
    }

    public void setExecutors(Set<Employer> employers) {
        this.executors = employers;
    }
    
    public Set<Employer> getExecutors() {
        return executors;
    }

    public void setExecutionDate(java.sql.Date executionDate) {
        this.executionDate = executionDate;
    }
    
    public java.sql.Date getExecutionDate() {
        return executionDate;
    }
    
    public void setControlAttribute(boolean controlAttribute) {
        this.controlAttribute = controlAttribute;
    }
    
    public boolean getControlAttribute() {
        return controlAttribute;
    }
    
    public void setExecutionAttribute(ExecutionAttributeEnum executionAttribute) {
        this.executionAttribute = executionAttribute;
    }
    
    public ExecutionAttributeEnum getExecutionAttribute() {
        return executionAttribute;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public String getText() {
        return text;
    }
    

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Assignment)) return false;
        return id != null && id.equals(((Assignment) o).id);
    }
 
    @Override
    public int hashCode() {
        return 31;
    }

    
    

}
