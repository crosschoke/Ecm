/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;


import java.io.Serializable;
import static java.lang.Math.toIntExact;
import java.util.HashSet;
import java.util.Objects;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;



/**
 *
 * @author Admin
 */
@Entity
@Table(name = "employers", uniqueConstraints= @UniqueConstraint(columnNames = {"surname", "name", "patronymic"}))
public class Employer implements Serializable{
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "surname", length = 30)
    private String surname;
    
    @Column(name= "name", length = 30)
    private String name;
    
    @Column(name= "patronymic", length = 30)
    private String patronymic;
    
    @Column(name= "post")
    private String post;

    @ManyToMany(mappedBy = "executors")
    private Set<Assignment> executorAssignments = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Assignment> authorAssignments = new HashSet<Assignment>();
    
    @OneToMany(mappedBy = "head", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Organization> organizationsHead = new HashSet<Organization>();
    
    @OneToMany(mappedBy = "unitHead", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Unit> unitsHead = new HashSet<Unit>();
    
    public Employer() {
    }
    
    public Employer(String surname, String name, String patronymic, String post) {
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.post = post;
    }
    
    public Long getId() {
        return id;
    }
    
    public Set<Assignment> getExecutorAssignments() {
        return executorAssignments;
    }
    
    public String getFullname() {
        return surname + " " + name + " " + patronymic;
    }
    
    public String getSurname() {
        return surname;
    }
    
    public void setSurname(String surname) {
        this.surname = surname;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPatronymic() {
        return patronymic;
    }
    
    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }
    
    public String getPost() {
        return post;
    }
    
    public void setPost(String post) {
        this.post = post;
    }
    
    /*
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employer employer = (Employer) o;
        return Objects.equals(surname + " " + name + " " + patronymic, employer.surname + " " + employer.name + " " + employer.patronymic);
    }
 
    @Override
    public int hashCode() {
        return Objects.hash(surname + " " + name + " " + patronymic);
    }
    */
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
 
        Employer that = (Employer) o;
        if (id != that.id) return false;
        if (surname != null ? !surname.equals(that.surname) : that.surname != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (patronymic != null ? !patronymic.equals(that.patronymic) : that.patronymic != null) return false;
        return true;
    }
    
    @Override
    public int hashCode() {
        int result = toIntExact(id);
        result = 31 * result + (surname != null ? surname.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (patronymic != null ? patronymic.hashCode() : 0);
        return result;
    }
 
 

}
